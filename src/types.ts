export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  countryCode: string; // ISO 3166-1 alpha-2 e.g. US, GB, JP, DE, CA, AU
  countryCodes?: string[]; // All associated country codes e.g. ['US', 'USA'] or ['DE', 'FR', 'IT', 'ES']
  rateToUSD: number; // 1 USD = rateToUSD
  change24h: number; // percentage e.g. -0.024
  sparkline: number[];
  popular?: boolean;
  region: 'Americas' | 'Europe' | 'Asia-Pacific' | 'Africa' | 'Middle East';
  keywords: string[];
}

export interface TransferQuote {
  id: string;
  fromCode: string;
  toCode: string;
  sendAmount: number;
  receiveAmount: number;
  exchangeRate: number;
  fee: number;
  deliveryEstimate: string;
  recipientName: string;
  recipientEmail: string;
  recipientIban: string;
  paymentMethod: 'bank' | 'card' | 'wire';
  status: 'quoted' | 'processing' | 'completed' | 'delivered';
  createdAt: string;
  driveFileId?: string;
  driveFileUrl?: string;
}

export interface RateAlert {
  id: string;
  fromCode: string;
  toCode: string;
  currentRate: number;
  targetRate: number;
  condition: 'above' | 'below';
  email: string;
  frequency: 'once' | 'daily';
  active: boolean;
  createdAt: string;
}

export interface IbanValidationResult {
  isValid: boolean;
  countryCode: string;
  countryName: string;
  bankCode: string;
  accountNumber: string;
  formattedIban: string;
  error?: string;
}

export interface DestinationCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
  speed: string;
}
