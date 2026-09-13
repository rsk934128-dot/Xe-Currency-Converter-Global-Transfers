import { Currency, DestinationCountry } from '../types';

export const CURRENCIES: Currency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    countryCode: 'US',
    countryCodes: ['US', 'USA'],
    rateToUSD: 1.0,
    change24h: 0.0,
    sparkline: [1.0, 1.0002, 0.9998, 1.0001, 1.0, 1.0003, 1.0],
    popular: true,
    region: 'Americas',
    keywords: ['United States Dollar', 'United States', 'America', 'Puerto Rico', 'Ecuador', 'Panama', 'El Salvador', 'Guam']
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    countryCode: 'EU',
    countryCodes: ['EU', 'EUR', 'DE', 'DEU', 'FR', 'FRA', 'IT', 'ITA', 'ES', 'ESP', 'NL', 'NLD', 'BE', 'BEL', 'AT', 'AUT', 'IE', 'IRL', 'PT', 'PRT', 'FI', 'FIN', 'GR', 'GRC'],
    rateToUSD: 0.86202258,
    change24h: -0.024,
    sparkline: [0.864, 0.8632, 0.8628, 0.8625, 0.8619, 0.8624, 0.86202],
    popular: true,
    region: 'Europe',
    keywords: ['Euro Member Countries', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria', 'Ireland', 'Portugal', 'Finland', 'Greece']
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    countryCode: 'GB',
    countryCodes: ['GB', 'GBR', 'UK'],
    rateToUSD: 0.73918,
    change24h: -0.0049,
    sparkline: [0.7398, 0.7402, 0.7395, 0.7389, 0.7394, 0.73918],
    popular: true,
    region: 'Europe',
    keywords: ['United Kingdom', 'Great Britain', 'England', 'Scotland', 'Wales', 'Northern Ireland', 'Pound Sterling']
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    flag: '🇯🇵',
    countryCode: 'JP',
    countryCodes: ['JP', 'JPN'],
    rateToUSD: 153.37,
    change24h: -0.13,
    sparkline: [153.8, 153.65, 153.9, 153.4, 153.55, 153.37],
    popular: true,
    region: 'Asia-Pacific',
    keywords: ['Japan', 'Tokyo', 'Yen', 'Nihon']
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    flag: '🇨🇦',
    countryCode: 'CA',
    countryCodes: ['CA', 'CAN'],
    rateToUSD: 1.3867,
    change24h: -0.026,
    sparkline: [1.388, 1.3875, 1.3869, 1.3872, 1.3861, 1.3867],
    popular: true,
    region: 'Americas',
    keywords: ['Canada', 'Loonie', 'Toronto', 'Vancouver', 'Montreal']
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    flag: '🇦🇺',
    countryCode: 'AU',
    countryCodes: ['AU', 'AUS'],
    rateToUSD: 1.5421,
    change24h: 0.18,
    sparkline: [1.538, 1.539, 1.541, 1.5405, 1.543, 1.5421],
    popular: true,
    region: 'Asia-Pacific',
    keywords: ['Australia', 'Aussie Dollar', 'Sydney', 'Melbourne']
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    flag: '🇨🇭',
    countryCode: 'CH',
    countryCodes: ['CH', 'CHE'],
    rateToUSD: 0.8715,
    change24h: 0.05,
    sparkline: [0.8708, 0.8712, 0.872, 0.8711, 0.8715],
    popular: true,
    region: 'Europe',
    keywords: ['Switzerland', 'Swiss', 'Zurich', 'Geneva', 'Liechtenstein']
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳',
    countryCode: 'IN',
    countryCodes: ['IN', 'IND'],
    rateToUSD: 84.12,
    change24h: -0.015,
    sparkline: [84.05, 84.08, 84.15, 84.1, 84.14, 84.12],
    popular: true,
    region: 'Asia-Pacific',
    keywords: ['India', 'Rupee', 'Delhi', 'Mumbai', 'Bangalore']
  },
  {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: 'Mex$',
    flag: '🇲🇽',
    countryCode: 'MX',
    countryCodes: ['MX', 'MEX'],
    rateToUSD: 19.82,
    change24h: 0.32,
    sparkline: [19.74, 19.79, 19.85, 19.8, 19.82],
    popular: true,
    region: 'Americas',
    keywords: ['Mexico', 'Peso', 'Mexico City', 'Cancun', 'Guadalajara']
  },
  {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    flag: '🇸🇬',
    countryCode: 'SG',
    countryCodes: ['SG', 'SGP'],
    rateToUSD: 1.3412,
    change24h: -0.08,
    sparkline: [1.343, 1.342, 1.3415, 1.3418, 1.3412],
    popular: true,
    region: 'Asia-Pacific',
    keywords: ['Singapore', 'Sing Dollar', 'Lion City']
  },
  {
    code: 'HKD',
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
    flag: '🇭🇰',
    countryCode: 'HK',
    countryCodes: ['HK', 'HKG'],
    rateToUSD: 7.782,
    change24h: 0.01,
    sparkline: [7.781, 7.783, 7.782, 7.782],
    popular: true,
    region: 'Asia-Pacific',
    keywords: ['Hong Kong', 'HKD', 'Kowloon']
  },
  {
    code: 'NZD',
    name: 'New Zealand Dollar',
    symbol: 'NZ$',
    flag: '🇳🇿',
    countryCode: 'NZ',
    countryCodes: ['NZ', 'NZL'],
    rateToUSD: 1.684,
    change24h: 0.12,
    sparkline: [1.681, 1.683, 1.685, 1.684],
    popular: false,
    region: 'Asia-Pacific',
    keywords: ['New Zealand', 'Kiwi', 'Auckland', 'Wellington']
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    flag: '🇨🇳',
    countryCode: 'CN',
    countryCodes: ['CN', 'CHN'],
    rateToUSD: 7.241,
    change24h: -0.04,
    sparkline: [7.245, 7.242, 7.239, 7.241],
    popular: true,
    region: 'Asia-Pacific',
    keywords: ['China', 'Yuan', 'Renminbi', 'RMB', 'Beijing', 'Shanghai']
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    flag: '🇧🇷',
    countryCode: 'BR',
    countryCodes: ['BR', 'BRA'],
    rateToUSD: 5.614,
    change24h: 0.45,
    sparkline: [5.58, 5.60, 5.62, 5.614],
    popular: false,
    region: 'Americas',
    keywords: ['Brazil', 'Real', 'Sao Paulo', 'Rio de Janeiro']
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    flag: '🇿🇦',
    countryCode: 'ZA',
    countryCodes: ['ZA', 'ZAF'],
    rateToUSD: 17.89,
    change24h: -0.22,
    sparkline: [17.95, 17.91, 17.86, 17.89],
    popular: false,
    region: 'Africa',
    keywords: ['South Africa', 'Rand', 'Johannesburg', 'Cape Town']
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    flag: '🇦🇪',
    countryCode: 'AE',
    countryCodes: ['AE', 'ARE'],
    rateToUSD: 3.6725,
    change24h: 0.00,
    sparkline: [3.6725, 3.6725, 3.6725, 3.6725],
    popular: true,
    region: 'Middle East',
    keywords: ['United Arab Emirates', 'Dubai', 'Abu Dhabi', 'Dirham']
  },
  {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: '﷼',
    flag: '🇸🇦',
    countryCode: 'SA',
    countryCodes: ['SA', 'SAU'],
    rateToUSD: 3.751,
    change24h: 0.002,
    sparkline: [3.751, 3.751, 3.751, 3.751],
    popular: false,
    region: 'Middle East',
    keywords: ['Saudi Arabia', 'Riyadh', 'Jeddah', 'Riyal']
  },
  {
    code: 'SEK',
    name: 'Swedish Krona',
    symbol: 'kr',
    flag: '🇸🇪',
    countryCode: 'SE',
    countryCodes: ['SE', 'SWE'],
    rateToUSD: 10.42,
    change24h: 0.08,
    sparkline: [10.4, 10.43, 10.41, 10.42],
    popular: false,
    region: 'Europe',
    keywords: ['Sweden', 'Krona', 'Stockholm']
  },
  {
    code: 'NOK',
    name: 'Norwegian Krone',
    symbol: 'kr',
    flag: '🇳🇴',
    countryCode: 'NO',
    countryCodes: ['NO', 'NOR'],
    rateToUSD: 10.78,
    change24h: -0.11,
    sparkline: [10.81, 10.79, 10.76, 10.78],
    popular: false,
    region: 'Europe',
    keywords: ['Norway', 'Krone', 'Oslo']
  },
  {
    code: 'DKK',
    name: 'Danish Krone',
    symbol: 'kr.',
    flag: '🇩🇰',
    countryCode: 'DK',
    countryCodes: ['DK', 'DNK'],
    rateToUSD: 6.945,
    change24h: -0.018,
    sparkline: [6.95, 6.94, 6.948, 6.945],
    popular: false,
    region: 'Europe',
    keywords: ['Denmark', 'Copenhagen', 'Krone']
  },
  {
    code: 'PHP',
    name: 'Philippine Peso',
    symbol: '₱',
    flag: '🇵🇭',
    countryCode: 'PH',
    countryCodes: ['PH', 'PHL'],
    rateToUSD: 57.65,
    change24h: -0.09,
    sparkline: [57.72, 57.68, 57.61, 57.65],
    popular: true,
    region: 'Asia-Pacific',
    keywords: ['Philippines', 'Manila', 'Peso']
  },
  {
    code: 'THB',
    name: 'Thai Baht',
    symbol: '฿',
    flag: '🇹🇭',
    countryCode: 'TH',
    countryCodes: ['TH', 'THA'],
    rateToUSD: 35.12,
    change24h: 0.15,
    sparkline: [35.05, 35.10, 35.18, 35.12],
    popular: false,
    region: 'Asia-Pacific',
    keywords: ['Thailand', 'Bangkok', 'Baht']
  },
  {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    flag: '🇲🇾',
    countryCode: 'MY',
    countryCodes: ['MY', 'MYS'],
    rateToUSD: 4.415,
    change24h: 0.05,
    sparkline: [4.41, 4.42, 4.418, 4.415],
    popular: false,
    region: 'Asia-Pacific',
    keywords: ['Malaysia', 'Kuala Lumpur', 'Ringgit']
  },
  {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
    flag: '🇮🇩',
    countryCode: 'ID',
    countryCodes: ['ID', 'IDN'],
    rateToUSD: 15680.0,
    change24h: -0.12,
    sparkline: [15700, 15690, 15670, 15680],
    popular: false,
    region: 'Asia-Pacific',
    keywords: ['Indonesia', 'Jakarta', 'Bali', 'Rupiah']
  },
  {
    code: 'PKR',
    name: 'Pakistani Rupee',
    symbol: '₨',
    flag: '🇵🇰',
    countryCode: 'PK',
    countryCodes: ['PK', 'PAK'],
    rateToUSD: 279.4,
    change24h: 0.03,
    sparkline: [279.2, 279.5, 279.3, 279.4],
    popular: true,
    region: 'Asia-Pacific',
    keywords: ['Pakistan', 'Karachi', 'Lahore', 'Islamabad', 'Rupee']
  },
  {
    code: 'BDT',
    name: 'Bangladeshi Taka',
    symbol: '৳',
    flag: '🇧🇩',
    countryCode: 'BD',
    countryCodes: ['BD', 'BGD'],
    rateToUSD: 119.8,
    change24h: 0.02,
    sparkline: [119.7, 119.9, 119.8, 119.8],
    popular: true,
    region: 'Asia-Pacific',
    keywords: ['Bangladesh', 'Dhaka', 'Taka', 'Chittagong']
  },
  {
    code: 'VND',
    name: 'Vietnamese Dong',
    symbol: '₫',
    flag: '🇻🇳',
    countryCode: 'VN',
    countryCodes: ['VN', 'VNM'],
    rateToUSD: 25350.0,
    change24h: -0.04,
    sparkline: [25360, 25340, 25350, 25350],
    popular: false,
    region: 'Asia-Pacific',
    keywords: ['Vietnam', 'Hanoi', 'Ho Chi Minh City', 'Dong']
  },
  {
    code: 'TRY',
    name: 'Turkish Lira',
    symbol: '₺',
    flag: '🇹🇷',
    countryCode: 'TR',
    countryCodes: ['TR', 'TUR'],
    rateToUSD: 34.25,
    change24h: -0.35,
    sparkline: [34.1, 34.2, 34.28, 34.25],
    popular: false,
    region: 'Middle East',
    keywords: ['Turkey', 'Istanbul', 'Ankara', 'Lira']
  },
  {
    code: 'PLN',
    name: 'Polish Zloty',
    symbol: 'zł',
    flag: '🇵🇱',
    countryCode: 'PL',
    countryCodes: ['PL', 'POL'],
    rateToUSD: 4.025,
    change24h: 0.07,
    sparkline: [4.01, 4.03, 4.02, 4.025],
    popular: false,
    region: 'Europe',
    keywords: ['Poland', 'Warsaw', 'Zloty']
  },
  {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'E£',
    flag: '🇪🇬',
    countryCode: 'EG',
    countryCodes: ['EG', 'EGY'],
    rateToUSD: 48.75,
    change24h: -0.05,
    sparkline: [48.7, 48.8, 48.72, 48.75],
    popular: false,
    region: 'Africa',
    keywords: ['Egypt', 'Cairo', 'Alexandria', 'Pound']
  },
  {
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
    flag: '🇰🇷',
    countryCode: 'KR',
    countryCodes: ['KR', 'KOR'],
    rateToUSD: 1378.5,
    change24h: 0.18,
    sparkline: [1374, 1377, 1381, 1378.5],
    popular: false,
    region: 'Asia-Pacific',
    keywords: ['South Korea', 'Seoul', 'Won']
  },
  {
    code: 'ILS',
    name: 'Israeli Shekel',
    symbol: '₪',
    flag: '🇮🇱',
    countryCode: 'IL',
    countryCodes: ['IL', 'ISR'],
    rateToUSD: 3.74,
    change24h: -0.06,
    sparkline: [3.75, 3.73, 3.74, 3.74],
    popular: false,
    region: 'Middle East',
    keywords: ['Israel', 'Tel Aviv', 'Jerusalem', 'Shekel']
  },
  {
    code: 'CLP',
    name: 'Chilean Peso',
    symbol: 'CL$',
    flag: '🇨🇱',
    countryCode: 'CL',
    countryCodes: ['CL', 'CHL'],
    rateToUSD: 945.0,
    change24h: 0.22,
    sparkline: [942, 946, 944, 945],
    popular: false,
    region: 'Americas',
    keywords: ['Chile', 'Santiago', 'Peso']
  },
  {
    code: 'COP',
    name: 'Colombian Peso',
    symbol: 'COL$',
    flag: '🇨🇴',
    countryCode: 'CO',
    countryCodes: ['CO', 'COL'],
    rateToUSD: 4320.0,
    change24h: 0.35,
    sparkline: [4310, 4325, 4318, 4320],
    popular: false,
    region: 'Americas',
    keywords: ['Colombia', 'Bogota', 'Medellin', 'Peso']
  },
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    flag: '🇳🇬',
    countryCode: 'NG',
    countryCodes: ['NG', 'NGA'],
    rateToUSD: 1675.0,
    change24h: -0.15,
    sparkline: [1680, 1670, 1675, 1675],
    popular: false,
    region: 'Africa',
    keywords: ['Nigeria', 'Lagos', 'Abuja', 'Naira']
  },
  {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    flag: '🇰🇪',
    countryCode: 'KE',
    countryCodes: ['KE', 'KEN'],
    rateToUSD: 129.5,
    change24h: 0.08,
    sparkline: [129.4, 129.6, 129.5, 129.5],
    popular: false,
    region: 'Africa',
    keywords: ['Kenya', 'Nairobi', 'Shilling']
  }
];

export const SEND_DESTINATIONS: DestinationCountry[] = [
  { code: 'AL', name: 'Albania', flag: '🇦🇱', currency: 'ALL', speed: 'Within minutes' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', currency: 'DZD', speed: 'Same day' },
  { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬', currency: 'XCD', speed: 'Within 24 hours' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', currency: 'ARS', speed: 'Instant to account' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', currency: 'AMD', speed: 'Within 1 hour' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', currency: 'AUD', speed: 'Instant (NPP)' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', currency: 'EUR', speed: 'Instant (SEPA)' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', currency: 'BHD', speed: 'Within 12 hours' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', currency: 'BDT', speed: 'Minutes to bKash' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧', currency: 'BBD', speed: 'Next business day' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', currency: 'EUR', speed: 'Instant (SEPA)' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', currency: 'XOF', speed: 'Instant mobile money' },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR', speed: 'Instant (UPI/IMPS)' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', currency: 'PKR', speed: 'Instant (Raast)' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', currency: 'MXN', speed: 'Instant (SPEI)' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', speed: 'Instant (Faster Payments)' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD', speed: 'Instant (Interac)' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY', speed: 'Same day' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', currency: 'PHP', speed: 'Instant (GCash/Maya)' }
];

export const TESTIMONIALS = [
  {
    name: 'Muhammad Khan',
    headline: 'It is excellent app …',
    quote: 'It is excellent app for transferring money thanks very much',
    rating: 5,
    location: 'United Kingdom'
  },
  {
    name: 'Justin Buck',
    headline: 'Always easy and competitive rates',
    quote: 'Always easy and competitive rates. Reliable updates and prompt transfers every time.',
    rating: 5,
    location: 'Australia'
  },
  {
    name: 'Sharon',
    headline: 'Easy to usr',
    quote: 'Always have no trouble with using XE. Fast transfer and clear exchange rates.',
    rating: 5,
    location: 'Canada'
  }
];

// Generates historical rate points for a given pair
export function generateHistoricalPoints(
  fromCode: string,
  toCode: string,
  baseRate: number,
  timeframe: '1D' | '1W' | '1M' | '1Y' | '5Y'
) {
  let count = 24;
  let volatility = 0.005;
  const now = new Date(2026, 8, 13, 15, 12); // Sep 13, 2026, 15:12 UTC
  const points: { timeLabel: string; rate: number; high: number; low: number }[] = [];

  switch (timeframe) {
    case '1D':
      count = 24;
      volatility = 0.002;
      break;
    case '1W':
      count = 7;
      volatility = 0.008;
      break;
    case '1M':
      count = 30;
      volatility = 0.015;
      break;
    case '1Y':
      count = 12;
      volatility = 0.035;
      break;
    case '5Y':
      count = 20;
      volatility = 0.06;
      break;
  }

  let runningRate = baseRate;
  for (let i = count - 1; i >= 0; i--) {
    const change = (Math.sin(i * 1.3) + Math.cos(i * 0.7)) * (runningRate * volatility * 0.5);
    const pointRate = Math.max(0.0001, runningRate + change);
    const high = pointRate * (1 + volatility * 0.4);
    const low = pointRate * (1 - volatility * 0.4);

    let timeLabel = '';
    if (timeframe === '1D') {
      const h = (now.getHours() - i + 24) % 24;
      timeLabel = `${h.toString().padStart(2, '0')}:00`;
    } else if (timeframe === '1W') {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      timeLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (timeframe === '1M') {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      timeLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      const d = new Date(now);
      d.setMonth(d.getMonth() - i);
      timeLabel = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }

    points.push({ timeLabel, rate: pointRate, high, low });
  }

  if (points.length > 0) {
    points[points.length - 1].rate = baseRate;
  }

  return points;
}
