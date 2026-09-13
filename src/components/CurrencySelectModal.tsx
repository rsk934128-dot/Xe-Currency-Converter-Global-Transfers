import React, { useState, useMemo } from 'react';
import { Search, X, Check, Star } from 'lucide-react';
import { Currency } from '../types';
import { CURRENCIES } from '../data/currencies';

interface CurrencySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (currency: Currency) => void;
  selectedCode: string;
  title: string;
}

export const CurrencySelectModal: React.FC<CurrencySelectModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedCode,
  title,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Popular' | 'Europe' | 'Americas' | 'Asia-Pacific' | 'Middle East' | 'Africa'>('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return CURRENCIES.filter((curr) => {
      // Tab filter
      if (activeTab === 'Popular' && !curr.popular) return false;
      if (activeTab !== 'All' && activeTab !== 'Popular' && curr.region !== activeTab) return false;

      // Text search
      if (!q) return true;
      const inCountryCode = curr.countryCode.toLowerCase().includes(q) || curr.countryCodes?.some(cc => cc.toLowerCase().includes(q));
      const inCode = curr.code.toLowerCase().includes(q);
      const inName = curr.name.toLowerCase().includes(q);
      const inKeywords = curr.keywords.some(k => k.toLowerCase().includes(q));
      return inCountryCode || inCode || inName || inKeywords;
    });
  }, [search, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#0a146e] text-white">
          <div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-xs text-blue-200">Select from 170+ world currencies</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="currency-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by currency code, name, or country..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0071eb] text-sm text-slate-800 placeholder-slate-400 shadow-xs"
              autoFocus
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1 mt-3 overflow-x-auto pb-1 scrollbar-none">
            {(['All', 'Popular', 'Europe', 'Americas', 'Asia-Pacific', 'Middle East', 'Africa'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-[#0071eb] text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {tab === 'Popular' && <Star className="w-3 h-3 inline mr-1 fill-amber-400 text-amber-400" />}
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Currency List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm font-medium">No currencies match "{search}"</p>
              <p className="text-xs mt-1">Try searching by country name or 3-letter currency code</p>
            </div>
          ) : (
            filtered.map((curr) => {
              const isSelected = curr.code === selectedCode;
              return (
                <button
                  key={curr.code}
                  id={`currency-option-${curr.code.toLowerCase()}`}
                  onClick={() => {
                    onSelect(curr);
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-blue-50/80 text-blue-900 font-semibold' : 'hover:bg-slate-100/80 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl shadow-xs rounded-full">{curr.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base tracking-wide text-slate-900">{curr.code}</span>
                        <span className="text-xs px-2 py-0.5 rounded-sm bg-slate-200/70 text-slate-700 font-mono">
                          {curr.symbol}
                        </span>
                        {curr.popular && (
                          <span className="text-[10px] uppercase font-bold text-[#0071eb] bg-blue-100/60 px-1.5 py-0.5 rounded-sm">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{curr.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      1 USD = {curr.rateToUSD < 0.01 ? curr.rateToUSD.toFixed(6) : curr.rateToUSD.toFixed(4)}
                    </span>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#0071eb] text-white flex items-center justify-center">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Rates sourced from global mid-market data feeds</span>
          <button
            onClick={onClose}
            className="font-semibold text-[#0071eb] hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
