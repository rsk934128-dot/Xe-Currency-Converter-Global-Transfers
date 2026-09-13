import React, { useState, useEffect } from 'react';
import { HardDrive, X, CheckCircle, Download, ExternalLink, RefreshCw, Trash2, ShieldCheck, FileText, Upload } from 'lucide-react';
import {
  DriveReceiptFile,
  getSavedReceipts,
  getGoogleUser,
  setGoogleUser,
  getDriveAccessToken,
  setDriveAccessToken
} from '../utils/driveStorage';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({ isOpen, onClose }) => {
  const [receipts, setReceipts] = useState<DriveReceiptFile[]>([]);
  const [user, setUser] = useState(getGoogleUser());
  const [isConnecting, setIsConnecting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setReceipts(getSavedReceipts());
      setUser(getGoogleUser());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConnectGoogle = () => {
    setIsConnecting(true);
    // Simulate interactive Google OAuth sign-in flow for Drive
    setTimeout(() => {
      const mockUser = {
        name: 'Rubel Bank',
        email: 'rubelbank225@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      };
      setGoogleUser(mockUser);
      setDriveAccessToken('simulated_gdrive_bearer_token_' + Date.now());
      setUser(mockUser);
      setIsConnecting(false);
      setFeedback('Connected to Google Drive as rubelbank225@gmail.com');
      setTimeout(() => setFeedback(null), 4000);
    }, 800);
  };

  const handleDisconnect = () => {
    setGoogleUser(null);
    setDriveAccessToken(null);
    setUser(null);
    setFeedback('Google Drive disconnected.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDownloadReceipt = (r: DriveReceiptFile) => {
    const blob = new Blob([r.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = r.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('xe_drive_receipts_v1');
    setReceipts([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0a146e] to-[#12228f] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <HardDrive className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Google Drive Transfer Storage</h3>
              <p className="text-xs text-blue-200">Automatically sync and archive receipts &amp; FX audit proof</p>
            </div>
          </div>

          <button onClick={onClose} className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {feedback && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* User Account Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {user.name[0]}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Google Drive Synced
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <div className="font-bold text-sm text-slate-900">Google Drive Offline</div>
                <div className="text-xs text-slate-500">Connect to auto-upload receipts to your Drive /Xe-Transfers folder.</div>
              </div>
            )}

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <a
                    href="https://drive.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>Open Drive</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                  <button
                    onClick={handleDisconnect}
                    className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  id="modal-connect-gdrive-btn"
                  onClick={handleConnectGoogle}
                  disabled={isConnecting}
                  className="px-4 py-2 bg-[#0071eb] hover:bg-[#005ec4] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>{isConnecting ? 'Connecting...' : 'Connect Google Drive'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Receipts Archive List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Saved Transfer Receipts ({receipts.length})
              </h4>
              {receipts.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear list</span>
                </button>
              )}
            </div>

            {receipts.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No transfer receipts generated yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Send a transfer or test a currency exchange to generate an official Xe receipt and sync it to Google Drive.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {receipts.map((rcpt) => (
                  <div
                    key={rcpt.id}
                    className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0071eb] flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900">{rcpt.name}</div>
                        <div className="text-xs text-slate-500">
                          {rcpt.amount} • {rcpt.recipient} • {rcpt.date}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            ✓ Ready for Drive
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleDownloadReceipt(rcpt)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted cloud storage</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
