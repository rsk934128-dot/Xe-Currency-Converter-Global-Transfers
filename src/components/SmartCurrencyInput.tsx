import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SmartCurrencyInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  currencySymbol?: string;
  currencyCode?: string;
  placeholder?: string;
  maxDecimals?: number;
  maxIntegerDigits?: number;
  className?: string;
  inputClassName?: string;
  size?: 'md' | 'lg';
  autoFocus?: boolean;
}

/**
 * Strips all non-digit and non-decimal characters, ensures single decimal point.
 */
export function cleanRawNumber(input: string, maxDecimals: number = 4): string {
  // Allow empty
  if (!input) return '';

  // Replace any comma used as decimal if no dot exists and standard European format pasted
  let sanitized = input;
  // If user pasted something with European format like "1.250,50"
  if (sanitized.includes(',') && sanitized.includes('.')) {
    // If dot comes before comma, dot is thousand separator
    if (sanitized.indexOf('.') < sanitized.indexOf(',')) {
      sanitized = sanitized.replace(/\./g, '').replace(',', '.');
    } else {
      // Comma is thousand separator
      sanitized = sanitized.replace(/,/g, '');
    }
  } else if (sanitized.includes(',') && !sanitized.includes('.')) {
    // Single comma could be decimal if only 1-2 digits after it and user pasted, but by default comma is thousand sep
    // We treat comma as thousand separator and strip it
    sanitized = sanitized.replace(/,/g, '');
  }

  // Strip all characters except digits and decimal point
  sanitized = sanitized.replace(/[^\d.]/g, '');

  // Ensure only first decimal point is kept
  const parts = sanitized.split('.');
  let integerPart = parts[0] || '';
  let decimalPart = parts.length > 1 ? '.' + parts.slice(1).join('') : '';

  // Limit decimal places
  if (decimalPart.length > maxDecimals + 1) {
    decimalPart = decimalPart.slice(0, maxDecimals + 1);
  }

  // Remove unnecessary leading zeros like "005" -> "5", but keep "0"
  if (integerPart.length > 1 && integerPart.startsWith('0')) {
    integerPart = integerPart.replace(/^0+/, '') || '0';
  }

  return integerPart + decimalPart;
}

/**
 * Formats a clean number string with commas for thousands: e.g. "1234567.89" -> "1,234,567.89"
 */
export function formatCurrencyValue(cleanVal: string): string {
  if (!cleanVal) return '';

  const hasTrailingDot = cleanVal.endsWith('.');
  const parts = cleanVal.split('.');
  const intPart = parts[0];
  const decPart = parts.length > 1 ? parts[1] : null;

  // Format integer part with commas
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (hasTrailingDot) {
    return `${formattedInt}.`;
  }

  if (decPart !== null) {
    return `${formattedInt}.${decPart}`;
  }

  return formattedInt;
}

export const SmartCurrencyInput: React.FC<SmartCurrencyInputProps> = ({
  id = 'smart-currency-input',
  value,
  onChange,
  currencySymbol = '$',
  currencyCode = 'USD',
  placeholder = '1.00',
  maxDecimals = 4,
  maxIntegerDigits = 12,
  className = '',
  inputClassName = '',
  size = 'lg',
  autoFocus = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorTarget, setCursorTarget] = useState<number | null>(null);

  // Derive initial formatted display from incoming value
  const cleanedVal = cleanRawNumber(value, maxDecimals);
  const displayVal = formatCurrencyValue(cleanedVal);

  // Restore cursor position accurately after React re-render & comma adjustments
  useLayoutEffect(() => {
    if (cursorTarget !== null && inputRef.current) {
      inputRef.current.setSelectionRange(cursorTarget, cursorTarget);
      setCursorTarget(null);
    }
  }, [cursorTarget, displayVal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawTyped = e.target.value;
    const currentCursor = e.target.selectionStart || 0;

    // Count how many non-comma (significant) characters existed before the cursor in the typed string
    const textBeforeCursor = rawTyped.slice(0, currentCursor);
    const significantCharsBefore = textBeforeCursor.replace(/,/g, '').length;

    // Clean and validate the raw input
    const newClean = cleanRawNumber(rawTyped, maxDecimals);

    // Limit maximum integer digits to avoid overflow
    const parts = newClean.split('.');
    if (parts[0].length > maxIntegerDigits) {
      return; // Ignore typing beyond max integer length
    }

    // Auto-format with commas
    const newFormatted = formatCurrencyValue(newClean);

    // Calculate new cursor position in the formatted string:
    // Move forward until we have passed the same number of significant (non-comma) characters
    let newCursorPos = 0;
    let countedSignificant = 0;

    for (let i = 0; i < newFormatted.length; i++) {
      if (countedSignificant === significantCharsBefore) {
        newCursorPos = i;
        break;
      }
      if (newFormatted[i] !== ',') {
        countedSignificant++;
      }
      if (countedSignificant === significantCharsBefore) {
        newCursorPos = i + 1;
        break;
      }
    }

    if (newCursorPos === 0 && significantCharsBefore > 0) {
      newCursorPos = newFormatted.length;
    }

    setCursorTarget(newCursorPos);
    // Propagate the cleaned/formatted value
    onChange(newClean);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const el = inputRef.current;
    if (!el) return;

    // Handle backspacing a comma: if cursor is immediately after a comma, e.g. "1,|000",
    // pressing backspace should delete the character BEFORE the comma (i.e. '1').
    if (e.key === 'Backspace') {
      const { selectionStart, selectionEnd } = el;
      if (selectionStart !== null && selectionStart === selectionEnd && selectionStart > 1) {
        if (displayVal[selectionStart - 1] === ',') {
          e.preventDefault();
          // Delete the character before the comma
          const beforeComma = displayVal.slice(0, selectionStart - 2);
          const afterComma = displayVal.slice(selectionStart);
          const combined = beforeComma + afterComma;
          const cleaned = cleanRawNumber(combined, maxDecimals);
          const formatted = formatCurrencyValue(cleaned);

          // Calculate cursor
          const sigBefore = beforeComma.replace(/,/g, '').length;
          let newPos = 0;
          let counted = 0;
          for (let i = 0; i < formatted.length; i++) {
            if (formatted[i] !== ',') counted++;
            if (counted === sigBefore) {
              newPos = i + 1;
              break;
            }
          }
          setCursorTarget(newPos);
          onChange(cleaned);
          return;
        }
      }
    }

    // Quick increment/decrement with ArrowUp / ArrowDown
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const currentNum = parseFloat(cleanedVal) || 0;
      const step = e.shiftKey ? 100 : e.altKey ? 0.1 : 1;
      const nextNum = e.key === 'ArrowUp' ? currentNum + step : Math.max(0, currentNum - step);
      const nextStr = nextNum % 1 === 0 ? nextNum.toString() : nextNum.toFixed(2);
      onChange(nextStr);
    }
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const isLg = size === 'lg';

  return (
    <div
      className={`relative rounded-xl border-2 transition-all bg-white overflow-hidden flex items-center group ${
        displayVal
          ? 'border-slate-300 hover:border-slate-400 focus-within:border-[#0071eb] focus-within:ring-4 focus-within:ring-blue-100'
          : 'border-slate-200 hover:border-slate-300 focus-within:border-[#0071eb] focus-within:ring-4 focus-within:ring-blue-100'
      } ${className}`}
    >
      {/* Leading Currency Symbol */}
      <span
        className={`select-none font-black text-slate-400 group-focus-within:text-[#0071eb] transition-colors pl-3.5 pr-1.5 shrink-0 ${
          isLg ? 'text-lg sm:text-xl' : 'text-base'
        }`}
        aria-hidden="true"
      >
        {currencySymbol}
      </span>

      {/* Smart Formatted Number Input */}
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        id={id}
        value={displayVal}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full py-2.5 font-black text-slate-900 focus:outline-none placeholder:text-slate-300 placeholder:font-normal bg-transparent tracking-tight ${
          isLg ? 'text-lg sm:text-2xl' : 'text-base font-bold'
        } ${inputClassName}`}
      />

      {/* Trailing Controls: Clear & Currency Code Badge */}
      <div className="flex items-center gap-1.5 pr-3 shrink-0">
        {displayVal && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            title="Clear amount"
            aria-label="Clear amount"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <span className="text-xs font-mono font-black text-slate-400 group-focus-within:text-[#0071eb] uppercase px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200/60 hidden sm:inline select-none">
          {currencyCode}
        </span>
      </div>
    </div>
  );
};
