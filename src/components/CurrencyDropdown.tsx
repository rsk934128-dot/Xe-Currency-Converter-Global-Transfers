import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, Star, X, Globe, Sparkles } from 'lucide-react';
import { Currency } from '../types';
import { CURRENCIES } from '../data/currencies';

interface CurrencyDropdownProps {
  label: string;
  selectedCurrency: Currency;
  onSelect: (currency: Currency) => void;
  idPrefix: string;
  className?: string;
  placeholder?: string;
}

export const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  label,
  selectedCurrency,
  onSelect,
  idPrefix,
  className = '',
  placeholder = 'Search currency name or country (e.g. Euro, Germany, Japan)...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Popular' | 'Americas' | 'Europe' | 'Asia-Pacific'>('All');

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownSearchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // When dropdown opens, automatically focus the search input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        dropdownSearchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Real-time filtering by currency name, country name, country code, or currency code
  const filteredCurrencies = useMemo(() => {
    const rawQuery = searchQuery.trim();
    const query = rawQuery.toLowerCase();

    const matched = CURRENCIES.filter((curr) => {
      // Category filter
      if (activeCategory === 'Popular' && !curr.popular) return false;
      if (activeCategory !== 'All' && activeCategory !== 'Popular' && curr.region !== activeCategory) {
        return false;
      }

      // If no search query, show all in category
      if (!query) return true;

      // 1. Filter by Currency Name (e.g. 'Euro', 'US Dollar', 'Japanese Yen', 'British Pound', 'Peso', 'Rupee')
      const matchesName = curr.name.toLowerCase().includes(query);

      // 2. Filter by Country Name / Keywords (e.g. 'Germany', 'France', 'United States', 'Japan', 'Canada', 'Australia')
      const matchesCountryName = curr.keywords.some((kw) => kw.toLowerCase().includes(query));

      // 3. Filter by Country Code (e.g. 'US', 'GB', 'JP', 'DE', 'FR', 'CA', 'AU', 'IN', 'MX')
      const matchesCountryCode =
        curr.countryCode.toLowerCase() === query ||
        curr.countryCode.toLowerCase().startsWith(query) ||
        curr.countryCodes?.some((cc) => cc.toLowerCase() === query || cc.toLowerCase().startsWith(query));

      // 4. Filter by Currency ISO Code (e.g. 'USD', 'EUR', 'GBP', 'JPY', 'CAD')
      const matchesCurrencyCode = curr.code.toLowerCase().includes(query);

      return matchesName || matchesCountryName || matchesCountryCode || matchesCurrencyCode;
    });

    // Rank results to prioritize exact currency code, country code, or name prefix matches
    if (query) {
      return [...matched].sort((a, b) => {
        // Exact country code match
        const aExactCountry = a.countryCode.toLowerCase() === query || a.countryCodes?.some(c => c.toLowerCase() === query);
        const bExactCountry = b.countryCode.toLowerCase() === query || b.countryCodes?.some(c => c.toLowerCase() === query);
        if (aExactCountry && !bExactCountry) return -1;
        if (!aExactCountry && bExactCountry) return 1;

        // Exact currency code match
        const aExactCode = a.code.toLowerCase() === query;
        const bExactCode = b.code.toLowerCase() === query;
        if (aExactCode && !bExactCode) return -1;
        if (!aExactCode && bExactCode) return 1;

        // Name starts with query
        const aNameStarts = a.name.toLowerCase().startsWith(query);
        const bNameStarts = b.name.toLowerCase().startsWith(query);
        if (aNameStarts && !bNameStarts) return -1;
        if (!aNameStarts && bNameStarts) return 1;

        // Country name starts with query
        const aCountryStarts = a.keywords.some(k => k.toLowerCase().startsWith(query));
        const bCountryStarts = b.keywords.some(k => k.toLowerCase().startsWith(query));
        if (aCountryStarts && !bCountryStarts) return -1;
        if (!aCountryStarts && bCountryStarts) return 1;

        // Popular currencies preferred
        if (a.popular && !b.popular) return -1;
        if (!a.popular && b.popular) return 1;

        return 0;
      });
    }

    return matched;
  }, [searchQuery, activeCategory]);

  // Reset highlighted index when filter results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredCurrencies]);

  // Scroll active item into view when navigating with keyboard
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (curr: Currency) => {
    onSelect(curr);
    setSearchQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredCurrencies.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCurrencies[highlightedIndex]) {
        handleSelect(filteredCurrencies[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Label and Helper info */}
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={`${idPrefix}-trigger-btn`}
          className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
        >
          {label}
        </label>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline flex items-center gap-1">
          <Search className="w-3 h-3 text-[#0071eb]" />
          <span>Real-time search active</span>
        </span>
      </div>

      {/* Main Trigger Button */}
      <button
        type="button"
        id={`${idPrefix}-trigger-btn`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${idPrefix}-currency-list`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full rounded-xl border-2 transition-all bg-white flex items-center justify-between px-3.5 py-2.5 shadow-2xs text-left group ${
          isOpen
            ? 'border-[#0071eb] ring-4 ring-blue-100 shadow-sm'
            : 'border-slate-200 hover:border-slate-300 focus:outline-none focus:border-[#0071eb] focus:ring-4 focus:ring-blue-100'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl select-none shrink-0" aria-hidden="true">
            {selectedCurrency.flag}
          </span>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-base tracking-wide">
                {selectedCurrency.code}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-[#0071eb] font-mono font-bold" title="Country Code">
                {selectedCurrency.countryCode}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono font-bold hidden sm:inline">
                {selectedCurrency.symbol}
              </span>
            </div>
            <div className="text-xs text-slate-500 truncate mt-0.5">
              {selectedCurrency.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className="text-xs text-slate-400 font-medium hidden md:inline group-hover:text-slate-600">
            Click to search
          </span>
          <div className="p-1 rounded-lg text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100 transition-colors">
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-[#0071eb]' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {/* Floating Dropdown Results Panel with Dedicated Real-time Search Input */}
      {isOpen && (
        <div
          id={`${idPrefix}-currency-list`}
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col max-h-[440px] animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Top Search Input Bar */}
          <div className="p-3 bg-white border-b border-slate-200">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-[#0071eb]" />
              <input
                ref={dropdownSearchInputRef}
                type="text"
                id={`${idPrefix}-search-input`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 focus:border-[#0071eb] focus:outline-none focus:ring-4 focus:ring-blue-100 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  id={`${idPrefix}-clear-search-btn`}
                  onClick={() => {
                    setSearchQuery('');
                    dropdownSearchInputRef.current?.focus();
                  }}
                  className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                  title="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick helper tip */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
              <span>Filter in real-time by country or currency name</span>
              <span className="font-semibold text-slate-600">
                {filteredCurrencies.length} {filteredCurrencies.length === 1 ? 'result' : 'results'}
              </span>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="p-2 bg-slate-50 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            {(['All', 'Popular', 'Americas', 'Europe', 'Asia-Pacific'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  dropdownSearchInputRef.current?.focus();
                }}
                className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#0071eb] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat === 'Popular' && <Star className="w-2.5 h-2.5 inline mr-1 fill-amber-400 text-amber-400" />}
                {cat}
              </button>
            ))}
          </div>

          {/* Scrollable Currencies List Filtered in Real-Time */}
          <div ref={listRef} className="overflow-y-auto flex-1 divide-y divide-slate-100 p-1.5">
            {filteredCurrencies.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Globe className="w-9 h-9 mx-auto mb-2 text-slate-300 animate-pulse" />
                <p className="text-sm font-bold text-slate-700">
                  No currencies match "{searchQuery}"
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Try searching by country name (e.g. <em>Germany, Japan, Mexico, United States</em>) or currency name (e.g. <em>Euro, Yen, Dollar, Pound, Rupee</em>).
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('All');
                    dropdownSearchInputRef.current?.focus();
                  }}
                  className="mt-3 px-3 py-1.5 text-xs font-bold text-[#0071eb] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  Clear search &amp; view all
                </button>
              </div>
            ) : (
              filteredCurrencies.map((curr, idx) => {
                const isSelected = curr.code === selectedCurrency.code;
                const isHighlighted = idx === highlightedIndex;
                const q = searchQuery.trim().toLowerCase();

                // Check if query matched country name in keywords
                const matchedCountry = q && curr.keywords.find(k => k.toLowerCase().includes(q));

                // Check if query matched currency name
                const matchedName = q && curr.name.toLowerCase().includes(q);

                // Check if query matched country code
                const matchedCountryCode = q && (
                  curr.countryCode.toLowerCase().includes(q) ||
                  curr.countryCodes?.find(cc => cc.toLowerCase().includes(q))
                );

                return (
                  <button
                    key={curr.code}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-index={idx}
                    id={`${idPrefix}-option-${curr.code.toLowerCase()}`}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleSelect(curr)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                      isHighlighted
                        ? 'bg-blue-50 text-blue-950 font-semibold'
                        : isSelected
                        ? 'bg-blue-50/50 text-blue-900'
                        : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0 select-none">{curr.flag}</span>
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm tracking-wide text-slate-900">
                            {curr.code}
                          </span>
                          <span className="text-[11px] px-1.5 py-0.2 rounded-sm bg-blue-100/70 text-blue-800 font-mono font-bold" title="ISO Country Code">
                            [{curr.countryCode}]
                          </span>
                          <span className="text-[11px] px-1.5 py-0.2 rounded-sm bg-slate-200/70 text-slate-700 font-mono font-bold">
                            {curr.symbol}
                          </span>
                          {curr.popular && (
                            <span className="text-[9px] uppercase font-bold text-[#0071eb] bg-blue-100/70 px-1.5 py-0.2 rounded-xs">
                              Popular
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 truncate mt-0.5">
                          {curr.name}
                        </div>

                        {/* Real-time Match Indicator Badge */}
                        {matchedCountry && (
                          <div className="text-[10px] text-emerald-700 font-bold truncate flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>Country: {matchedCountry}</span>
                          </div>
                        )}
                        {!matchedCountry && matchedName && (
                          <div className="text-[10px] text-blue-700 font-semibold truncate flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            <span>Matched Currency: {curr.name}</span>
                          </div>
                        )}
                        {!matchedCountry && !matchedName && matchedCountryCode && (
                          <div className="text-[10px] text-indigo-700 font-semibold truncate flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                            <span>Country Code: {typeof matchedCountryCode === 'string' ? matchedCountryCode.toUpperCase() : curr.countryCode}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 ml-2">
                      <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                        1 USD = {curr.rateToUSD < 0.01 ? curr.rateToUSD.toFixed(5) : curr.rateToUSD.toFixed(3)}
                      </span>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#0071eb] text-white flex items-center justify-center shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Dropdown Footer with keyboard hint & real-time badge */}
          <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-[#0071eb] font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>Real-time instant filtering</span>
            </span>
            <span className="hidden sm:inline">Use ↑↓ keys &amp; Enter to select</span>
          </div>
        </div>
      )}
    </div>
  );
};
