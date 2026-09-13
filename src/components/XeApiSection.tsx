import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, Code2, ArrowRight, Play } from 'lucide-react';

export const XeApiSection: React.FC = () => {
  const [activeApiTab, setActiveApiTab] = useState<'API 01' | 'API 02' | 'API 03' | 'API 04'>('API 01');
  const [copied, setCopied] = useState(false);

  const apiEndpoints = {
    'API 01': {
      method: 'GET',
      url: 'https://xecdapi.xe.com/v1/convert_from',
      desc: 'Real-time conversion against USD or any base currency',
      payload: `{
  "terms": "https://www.xe.com/legal/api",
  "privacy": "https://www.xe.com/legal/privacy",
  "from": "USD",
  "amount": 1.0,
  "timestamp": "2026-09-13T15:12:00Z",
  "to": {
    "CAD": 1.386700,
    "CHF": 0.871500,
    "EUR": 0.862022,
    "GBP": 0.739180,
    "JPY": 153.3700,
    "AUD": 1.542100,
    "INR": 84.12000,
    "MXN": 19.82000,
    "BRL": 5.614000,
    "ZAR": 17.89000,
    "AED": 3.672500,
    "SGD": 1.341200
    /* ... 170+ world currencies */
  }
}`
    },
    'API 02': {
      method: 'GET',
      url: 'https://xecdapi.xe.com/v1/historic_rate?date=2026-09-01',
      desc: 'Historical end-of-day interbank fixings back 25 years',
      payload: `{
  "from": "USD",
  "to": "EUR",
  "date": "2026-09-01",
  "historical_rate": 0.859410,
  "inverse": 1.163588,
  "fixing_source": "European Central Bank Reference Fixing",
  "status": "success"
}`
    },
    'API 03': {
      method: 'GET',
      url: 'https://xecdapi.xe.com/v1/currencies',
      desc: 'Complete ISO-4217 list of 170+ supported global currencies',
      payload: `{
  "count": 174,
  "currencies": [
    { "iso": "USD", "name": "US Dollar", "symbol": "$", "decimals": 2 },
    { "iso": "EUR", "name": "Euro", "symbol": "€", "decimals": 2 },
    { "iso": "GBP", "name": "British Pound", "symbol": "£", "decimals": 2 },
    { "iso": "JPY", "name": "Japanese Yen", "symbol": "¥", "decimals": 0 }
    /* ... additional currencies */
  ]
}`
    },
    'API 04': {
      method: 'POST',
      url: 'https://xecdapi.xe.com/v1/rate_alerts/create',
      desc: 'Automated webhook dispatch when exchange rates breach targets',
      payload: `{
  "alert_id": "alt_983120",
  "pair": "EUR/USD",
  "threshold": 1.1850,
  "trigger": "above",
  "webhook_url": "https://api.merchant.com/webhooks/fx",
  "status": "active"
}`
    }
  };

  const currentApi = apiEndpoints[activeApiTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(`${currentApi.method} ${currentApi.url}\n\n${currentApi.payload}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: API Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0071eb] text-xs font-bold uppercase tracking-wider">
              <Code2 className="w-3.5 h-3.5" />
              <span>Providing commercial grade exchange rates to 3000+ companies worldwide</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Xe currency data API
            </h2>

            <p className="text-lg font-bold text-[#0a146e]">
              The world's most trusted source for currency data
            </p>

            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Our exchange rate API offers real-time, accurate, and reliable data for hundreds of currencies. Xe's proprietary rates are sourced directly from financial data providers and reputable banks.
            </p>

            {/* Feature Pills */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </div>
                <span>99.99% Enterprise uptime SLA with global multi-region edge caches</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                  ✓
                </div>
                <span>Sub-15ms response latency across US, Europe, and Asia-Pacific</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                id="api-learn-more-btn"
                onClick={() => window.open('https://www.xe.com/xecurrencydata/', '_blank')}
                className="px-7 py-3.5 bg-[#0a146e] hover:bg-[#13229b] text-white font-bold text-sm rounded-full shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Code Terminal Viewer */}
          <div className="lg:col-span-6">
            <div className="bg-slate-950 text-slate-100 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden font-mono">
              {/* Terminal Window Bar */}
              <div className="bg-slate-900/90 px-4 py-3 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-400 font-sans ml-2">xe-currency-data-api.json</span>
                </div>

                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-slate-800 transition-colors font-sans"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* API 01 / API 02 / API 03 / API 04 Tabs from prompt */}
              <div className="flex bg-slate-900 border-b border-slate-800 px-2 overflow-x-auto">
                {(['API 01', 'API 02', 'API 03', 'API 04'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveApiTab(tab)}
                    className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors font-sans ${
                      activeApiTab === tab
                        ? 'border-[#0071eb] text-white bg-slate-800/50'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Request endpoint bar */}
              <div className="px-5 py-3 bg-slate-900/40 border-b border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-300">
                <span className="px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-400 font-bold">
                  {currentApi.method}
                </span>
                <span className="text-blue-300 truncate">{currentApi.url}</span>
              </div>

              {/* Code payload */}
              <div className="p-5 text-xs text-slate-200 overflow-x-auto max-h-80 leading-relaxed font-mono">
                <pre className="text-emerald-400/90 font-mono">{currentApi.payload}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By Logos */}
        <div className="mt-20 pt-10 border-t border-slate-100 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
            Trusted by leading global corporations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all">
            {/* Shopify */}
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800 tracking-tight">
              <span className="w-8 h-8 rounded-lg bg-[#95BF47] text-white flex items-center justify-center font-black text-sm">
                S
              </span>
              <span>shopify</span>
            </div>

            {/* Clearbooks */}
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800 tracking-tight">
              <span className="w-8 h-8 rounded-lg bg-[#0082c9] text-white flex items-center justify-center font-black text-sm">
                cb
              </span>
              <span>clearbooks</span>
            </div>

            {/* Vistaprint */}
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800 tracking-tight">
              <span className="w-8 h-8 rounded-lg bg-[#0070cd] text-white flex items-center justify-center font-black text-sm">
                V
              </span>
              <span>vistaprint</span>
            </div>

            {/* Xero */}
            <div className="flex items-center gap-2 text-xl font-bold text-slate-800 tracking-tight">
              <span className="w-8 h-8 rounded-full bg-[#13b5ea] text-white flex items-center justify-center font-black text-sm">
                x
              </span>
              <span>xero</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
