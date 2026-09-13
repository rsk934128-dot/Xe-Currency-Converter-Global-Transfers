import { TransferQuote } from '../types';

export interface DriveReceiptFile {
  id: string;
  name: string;
  transferId: string;
  amount: string;
  date: string;
  recipient: string;
  mimeType: string;
  driveUrl?: string;
  syncedToDrive: boolean;
  content: string;
}

const STORAGE_KEY = 'xe_drive_receipts_v1';
const DRIVE_TOKEN_KEY = 'xe_google_drive_token';
const DRIVE_USER_KEY = 'xe_google_user';

export function getSavedReceipts(): DriveReceiptFile[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse receipts', e);
    return [];
  }
}

export function saveReceiptToStorage(receipt: DriveReceiptFile) {
  const existing = getSavedReceipts();
  const filtered = existing.filter(r => r.id !== receipt.id);
  const updated = [receipt, ...filtered];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getGoogleUser(): { name: string; email: string; avatar?: string } | null {
  try {
    const data = localStorage.getItem(DRIVE_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setGoogleUser(user: { name: string; email: string; avatar?: string } | null) {
  if (user) {
    localStorage.setItem(DRIVE_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(DRIVE_USER_KEY);
  }
}

export function getDriveAccessToken(): string | null {
  return localStorage.getItem(DRIVE_TOKEN_KEY);
}

export function setDriveAccessToken(token: string | null) {
  if (token) {
    localStorage.setItem(DRIVE_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(DRIVE_TOKEN_KEY);
  }
}

export function generateReceiptText(quote: TransferQuote): string {
  return `=====================================================
            XE MONEY TRANSFER RECEIPT
=====================================================
Transfer Reference : ${quote.id}
Date & Time        : ${quote.createdAt}
Status             : ${quote.status.toUpperCase()}
Est. Delivery      : ${quote.deliveryEstimate}

-----------------------------------------------------
TRANSFER SUMMARY
-----------------------------------------------------
You Sent           : ${quote.sendAmount.toFixed(2)} ${quote.fromCode}
Exchange Rate      : 1 ${quote.fromCode} = ${quote.exchangeRate.toFixed(6)} ${quote.toCode}
Transfer Fee       : ${quote.fee === 0 ? '$0.00 (Xe Zero Fee Promotion)' : `$${quote.fee.toFixed(2)}`}
Recipient Gets     : ${quote.receiveAmount.toFixed(2)} ${quote.toCode}

-----------------------------------------------------
RECIPIENT DETAILS
-----------------------------------------------------
Recipient Name     : ${quote.recipientName}
Recipient Email    : ${quote.recipientEmail || 'N/A'}
Account / IBAN     : ${quote.recipientIban || 'N/A'}
Payment Method     : ${quote.paymentMethod.toUpperCase()}

-----------------------------------------------------
REGULATORY COMPLIANCE
-----------------------------------------------------
Xe Corporation Inc. | NMLS ID#920968
Licensed & Regulated International Money Transmitter
30+ years of trusted global currency transfers.
For 24/7 transfer support, visit https://www.xe.com/help
=====================================================`;
}

export async function uploadReceiptToGoogleDrive(
  quote: TransferQuote,
  token?: string
): Promise<{ success: boolean; fileId?: string; fileUrl?: string; message: string }> {
  const content = generateReceiptText(quote);
  const fileName = `Xe_Transfer_Receipt_${quote.id}.txt`;
  const authToken = token || getDriveAccessToken();

  if (!authToken) {
    // If no direct OAuth token is currently active, store locally with ready-to-sync state
    const receiptRecord: DriveReceiptFile = {
      id: quote.id,
      name: fileName,
      transferId: quote.id,
      amount: `${quote.sendAmount.toFixed(2)} ${quote.fromCode} → ${quote.receiveAmount.toFixed(2)} ${quote.toCode}`,
      date: quote.createdAt,
      recipient: quote.recipientName,
      mimeType: 'text/plain',
      syncedToDrive: false,
      content
    };
    saveReceiptToStorage(receiptRecord);

    return {
      success: true,
      message: 'Receipt saved securely to your Xe Drive records! Connect Google Drive to sync to cloud.'
    };
  }

  try {
    const metadata = {
      name: fileName,
      mimeType: 'text/plain',
      description: `Xe Money Transfer receipt for ${quote.id} to ${quote.recipientName}`
    };

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelim = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: text/plain\r\n\r\n' +
      content +
      closeDelim;

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Drive upload failed: ${response.status}`);
    }

    const data = await response.json();
    const driveUrl = `https://drive.google.com/file/d/${data.id}/view`;

    const receiptRecord: DriveReceiptFile = {
      id: quote.id,
      name: fileName,
      transferId: quote.id,
      amount: `${quote.sendAmount.toFixed(2)} ${quote.fromCode} → ${quote.receiveAmount.toFixed(2)} ${quote.toCode}`,
      date: quote.createdAt,
      recipient: quote.recipientName,
      mimeType: 'text/plain',
      driveUrl,
      syncedToDrive: true,
      content
    };
    saveReceiptToStorage(receiptRecord);

    return {
      success: true,
      fileId: data.id,
      fileUrl: driveUrl,
      message: 'Successfully uploaded receipt directly to your Google Drive!'
    };
  } catch (error: any) {
    console.error('Google Drive API error:', error);
    // Fallback: save locally
    const receiptRecord: DriveReceiptFile = {
      id: quote.id,
      name: fileName,
      transferId: quote.id,
      amount: `${quote.sendAmount.toFixed(2)} ${quote.fromCode} → ${quote.receiveAmount.toFixed(2)} ${quote.toCode}`,
      date: quote.createdAt,
      recipient: quote.recipientName,
      mimeType: 'text/plain',
      syncedToDrive: false,
      content
    };
    saveReceiptToStorage(receiptRecord);

    return {
      success: false,
      message: error.message || 'Could not upload to Google Drive directly. Saved locally.'
    };
  }
}

export function downloadReceiptFile(quote: TransferQuote) {
  const content = generateReceiptText(quote);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Xe_Receipt_${quote.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
