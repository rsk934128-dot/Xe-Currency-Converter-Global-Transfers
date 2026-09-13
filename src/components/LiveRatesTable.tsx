import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Plus, TrendingDown, TrendingUp, Send, Trash2, Edit3, LineChart } from 'lucide-react';
import { Currency } from '../types';
import { CURRENCIES, generateHistoricalPoints } from '../data/currencies';
import { CurrencySelectModal } from './CurrencySelectModal';
import { Sparkline7D } from './Sparkline7D';

interface LiveRatesTableProps {
  onSendCurrency: (fromCode: string, toCode: string) => void;
}

export const LiveRatesTable: React.FC<LiveRatesTableProps> = ({ onSendCurrency }) => {
  // Base currency defaults to USD
  const [baseCode, setBaseCode] = useState<string>('USD');
  const [isInverse, setIsInverse] = useState<boolean>(false);
  const [showTrends, setShowTrends] = useState<boolean>(true);
  const [tableCurrencies, setTableCurrencies] = useState<string[]>(['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'INR']);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const baseCurrency = CURRENCIES.find(c => c.code === baseCode) || CURRENCIES[0];

  const handleAddCurrency = (currency: Currency) => {
    if (!tableCurrencies.includes(currency.code) && currency.code !== baseCode) {
      setTableCurrencies([...tableCurrencies, currency.code]);
    }
  };

  const handleRemoveCurrency = (code: string) => {
    setTableCurrencies(tableCurrencies.filter(c => c !== code));
  };

  const handleChangeBase = (code: string) => {
    setBaseCode(code);
    // If table has the new base, remove it or replace with old base
    if (tableCurrencies.includes(code)) {
      setTableCurrencies(tableCurrencies.map(c => (c === code ? baseCode : c)));
    }
  };

  // Pre-calculate 7-day sparkline points for each currency
  const currencyData = useMemo(() => {
    return tableCurrencies.map((code) => {
      const curr = CURRENCIES.find((c) => c.code === code);
      if (!curr) return null;

      // Rate relative to baseCurrency
      const rawRate = curr.rateToUSD / baseCurrency.rateToUSD;
      const displayRate = isInverse ? (rawRate > 0 ? 1 / rawRate : 0) : rawRate;
      const formattedRate = displayRate < 0.01 ? displayRate.toFixed(6) : displayRate.toFixed(5);
      const isPositive24h = curr.change24h >= 0;

      // Generate 7-day historical movement points
      const points7d = generateHistoricalPoints(baseCurrency.code, curr.code, displayRate, '1W');

      return {
        curr,
        displayRate,
        formattedRate,
        isPositive24h,
        points7d
      };
    }).filter(Boolean) as {
      curr: Currency;
      displayRate: number;
      formattedRate: string;
      isPositive24h: boolean;
      points7d: ReturnType<typeof generateHistoricalPoints>;
    }[];
  }, [tableCurrencies, baseCurrency, isInverse]);

  return (
    <section id="live-rates-section" className="py-16 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Toolbar Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Live exchange rates
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Compare 100+ currencies in real time with 7-day trend movement tracking
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 7-Day Trends Toggle Button */}
            <button
              id="live-rates-trends-toggle-btn"
              type="button"
              onClick={() => setShowTrends(!showTrends)}
              aria-pressed={showTrends}
              title={showTrends ? 'Hide 7-day sparkline trends' : 'Show 7-day sparkline trends'}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                showTrends
                  ? 'bg-blue-50 text-[#0071eb] border-blue-200 shadow-2xs hover:bg-blue-100/70 ring-2 ring-blue-100'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <LineChart className="w-4 h-4" />
              <span>7D Trends</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-black uppercase transition-colors ${
                  showTrends ? 'bg-[#0071eb] text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {showTrends ? 'On' : 'Off'}
              </span>
            </button>

            {/* Inverse Rate Toggle Button */}
            <button
              id="live-rates-inverse-btn"
              type="button"
              onClick={() => setIsInverse(!isInverse)}
              aria-pressed={isInverse}
              title="Invert currency calculation ratio"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                isInverse
                  ? 'bg-[#0a146e] text-white border-[#0a146e] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Inverse</span>
            </button>

            {/* Edit Mode Toggle Button */}
            <button
              id="live-rates-edit-btn"
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              aria-pressed={isEditMode}
              title="Edit currency list"
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors ${
                isEditMode
                  ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-100'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Done' : 'Edit'}</span>
            </button>
          </div>
        </div>

        {/* Rates Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Base Currency Header Banner */}
          <div className="bg-[#0a146e] text-white p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-3xl sm:text-4xl select-none" aria-hidden="true">{baseCurrency.flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black uppercase tracking-wider">{baseCurrency.code}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">Base Currency</span>
                </div>
                <div className="text-xs text-blue-200">{baseCurrency.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-left sm:text-right">
                <div className="text-2xl sm:text-3xl font-black">1.00 {baseCurrency.code}</div>
                <div className="text-xs text-blue-200">Base Unit {isInverse ? '(Inverted view)' : ''}</div>
              </div>
            </div>
          </div>

          {/* Dynamic Table Column Headers depending on showTrends */}
          <div
            className={`hidden md:grid gap-4 px-6 py-3 bg-slate-100/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider items-center ${
              showTrends ? 'grid-cols-12' : 'grid-cols-12'
            }`}
          >
            <div className={showTrends ? 'col-span-3' : 'col-span-4'}>Currency</div>
            <div className={`${showTrends ? 'col-span-2' : 'col-span-3'} text-right`}>Amount</div>
            <div className={`${showTrends ? 'col-span-2' : 'col-span-3'} text-right`}>Change (24h)</div>
            {showTrends && (
              <div className="col-span-4 pl-2 flex items-center justify-between">
                <span>7-Day Trend Movement</span>
                <span className="text-[10px] text-slate-400 font-normal lowercase tracking-normal">
                  (hover to inspect)
                </span>
              </div>
            )}
            <div className={`${showTrends ? 'col-span-1' : 'col-span-2'} text-right`}>Action</div>
          </div>

          {/* Currency Rows */}
          <div className="divide-y divide-slate-100">
            {currencyData.map(({ curr, formattedRate, isPositive24h, points7d }) => (
              <div
                key={curr.code}
                className="p-4 sm:px-6 sm:py-4.5 hover:bg-blue-50/30 transition-colors flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center"
              >
                {/* 1. Currency Information */}
                <div className={`w-full ${showTrends ? 'md:col-span-3' : 'md:col-span-4'} flex items-center justify-between md:justify-start gap-3`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl select-none" aria-hidden="true">{curr.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleChangeBase(curr.code)}
                          title={`Set ${curr.code} as base currency`}
                          className="font-black text-slate-900 hover:text-[#0071eb] transition-colors flex items-center gap-1 group text-base"
                        >
                          <span>{curr.code}</span>
                          <span className="text-[10px] text-slate-400 group-hover:text-[#0071eb] font-normal hidden sm:inline">
                            (Set base)
                          </span>
                        </button>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-slate-100 text-slate-600 font-mono font-bold">
                          {curr.countryCode}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[150px]">{curr.name}</div>
                    </div>
                  </div>

                  {/* Mobile rate & 24h change view */}
                  <div className="md:hidden text-right">
                    <div className="font-mono font-bold text-base text-slate-900">{formattedRate}</div>
                    <div className={`text-xs font-semibold ${isPositive24h ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPositive24h ? '+' : ''}{curr.change24h.toFixed(3)}%
                    </div>
                  </div>
                </div>

                {/* 2. Desktop Amount */}
                <div className={`hidden md:block ${showTrends ? 'col-span-2' : 'col-span-3'} text-right`}>
                  <div className="font-mono font-bold text-base text-slate-900">{formattedRate}</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {isInverse ? `1 ${curr.code} in ${baseCurrency.code}` : `1 ${baseCurrency.code} in ${curr.code}`}
                  </div>
                </div>

                {/* 3. 24h Change Badge */}
                <div className={`hidden md:block ${showTrends ? 'col-span-2' : 'col-span-3'} text-right`}>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      isPositive24h ? 'bg-emerald-100/70 text-emerald-800' : 'bg-rose-100/70 text-rose-800'
                    }`}
                  >
                    {isPositive24h ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{isPositive24h ? '+' : ''}{curr.change24h.toFixed(3)}%</span>
                  </span>
                </div>

                {/* 4. Desktop 7-Day Sparkline Trend Chart (Visible when showTrends is ON) */}
                {showTrends && (
                  <div className="hidden md:flex col-span-4 pl-2 items-center">
                    <Sparkline7D
                      points={points7d}
                      currencyCode={curr.code}
                      baseCode={baseCurrency.code}
                    />
                  </div>
                )}

                {/* Mobile 7-Day Sparkline Trend (Visible when showTrends is ON) */}
                {showTrends && (
                  <div className="md:hidden w-full pt-2.5 pb-1 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                      <LineChart className="w-3 h-3 text-[#0071eb]" />
                      <span>7-Day Movement:</span>
                    </div>
                    <Sparkline7D
                      points={points7d}
                      currencyCode={curr.code}
                      baseCode={baseCurrency.code}
                      compact
                    />
                  </div>
                )}

                {/* 5. Action Column: Send or Delete */}
                <div className={`w-full ${showTrends ? 'md:col-span-1' : 'md:col-span-2'} flex items-center justify-end gap-2 mt-2 md:mt-0`}>
                  {isEditMode ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveCurrency(curr.code)}
                      className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                      title={`Remove ${curr.code} from table`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      id={`live-rate-send-${curr.code.toLowerCase()}`}
                      onClick={() => onSendCurrency(baseCurrency.code, curr.code)}
                      className="w-full md:w-auto px-4 py-1.5 bg-[#0071eb] hover:bg-[#005ec4] text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center justify-center gap-1 active:scale-95"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer: Add Currency & Last Updated Timestamp */}
          <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              id="live-rates-add-currency-btn"
              onClick={() => setAddModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 text-[#0071eb]" />
              <span>Add currency</span>
            </button>

            <div className="text-xs text-slate-500 text-center sm:text-right font-medium">
              Last updated Sep 13, 2026, 15:12 UTC • Real-time interbank data
              {showTrends && ' • 7-day historical trends enabled'}
            </div>
          </div>
        </div>
      </div>

      {/* Add Currency Modal */}
      <CurrencySelectModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSelect={handleAddCurrency}
        selectedCode=""
        title="Add Currency to Live Rates"
      />
    </section>
  );
};
