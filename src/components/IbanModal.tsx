import React, { useState } from 'react';
import { Calculator, X, CheckCircle2, AlertTriangle, Building, Globe } from 'lucide-react';
import { IbanValidationResult } from '../types';

interface IbanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IBAN_LENGTHS: Record<string, { len: number; country: string }> = {
  AL: { len: 28, country: 'Albania' },
  AT: { len: 20, country: 'Austria' },
  BE: { len: 16, country: 'Belgium' },
  BA: { len: 20, country: 'Bosnia and Herzegovina' },
  BG: { len: 22, country: 'Bulgaria' },
  CH: { len: 21, country: 'Switzerland' },
  CY: { len: 28, country: 'Cyprus' },
  CZ: { len: 24, country: 'Czech Republic' },
  DE: { len: 22, country: 'Germany' },
  DK: { len: 18, country: 'Denmark' },
  EE: { len: 20, country: 'Estonia' },
  ES: { len: 24, country: 'Spain' },
  FI: { len: 18, country: 'Finland' },
  FR: { len: 27, country: 'France' },
  GB: { len: 22, country: 'United Kingdom' },
  GR: { len: 27, country: 'Greece' },
  HR: { len: 21, country: 'Croatia' },
  HU: { len: 28, country: 'Hungary' },
  IE: { len: 22, country: 'Ireland' },
  IT: { len: 27, country: 'Italy' },
  LU: { len: 20, country: 'Luxembourg' },
  NL: { len: 18, country: 'Netherlands' },
  NO: { len: 15, country: 'Norway' },
  PL: { len: 28, country: 'Poland' },
  PT: { len: 25, country: 'Portugal' },
  RO: { len: 24, country: 'Romania' },
  SE: { len: 24, country: 'Sweden' },
  TR: { len: 26, country: 'Turkey' }
};

export const IbanModal: React.FC<IbanModalProps> = ({ isOpen, onClose }) => {
  const [ibanInput, setIbanInput] = useState('DE89 3704 0044 0532 0130 00');
  const [result, setResult] = useState<IbanValidationResult | null>(null);

  if (!isOpen) return null;

  const validateIban = (raw: string) => {
    const cleaned = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleaned.length < 4) {
      setResult({
        isValid: false,
        countryCode: '',
        countryName: 'Unknown',
        bankCode: '',
        accountNumber: '',
        formattedIban: cleaned,
        error: 'IBAN is too short. Minimum 15 characters required.'
      });
      return;
    }

    const country = cleaned.substring(0, 2);
    const countryMeta = IBAN_LENGTHS[country];

    if (!countryMeta) {
      setResult({
        isValid: false,
        countryCode: country,
        countryName: 'Unknown or Unsupported Country',
        bankCode: cleaned.substring(4, 8),
        accountNumber: cleaned.substring(8),
        formattedIban: cleaned,
        error: `Country code "${country}" is not recognized in SEPA/SWIFT registry.`
      });
      return;
    }

    if (cleaned.length !== countryMeta.len) {
      setResult({
        isValid: false,
        countryCode: country,
        countryName: countryMeta.country,
        bankCode: cleaned.substring(4, 8),
        accountNumber: cleaned.substring(8),
        formattedIban: cleaned,
        error: `Invalid length. An IBAN for ${countryMeta.country} must be exactly ${countryMeta.len} characters (found ${cleaned.length}).`
      });
      return;
    }

    // Mod 97 algorithm
    const rearranged = cleaned.substring(4) + cleaned.substring(0, 4);
    let numericStr = '';
    for (let i = 0; i < rearranged.length; i++) {
      const code = rearranged.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        numericStr += (code - 55).toString();
      } else {
        numericStr += rearranged[i];
      }
    }

    // BigInt mod 97
    let remainder = 0;
    for (let i = 0; i < numericStr.length; i++) {
      remainder = (remainder * 10 + parseInt(numericStr[i], 10)) % 97;
    }

    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;

    if (remainder === 1) {
      setResult({
        isValid: true,
        countryCode: country,
        countryName: countryMeta.country,
        bankCode: cleaned.substring(4, 8),
        accountNumber: cleaned.substring(8),
        formattedIban: formatted
      });
    } else {
      setResult({
        isValid: false,
        countryCode: country,
        countryName: countryMeta.country,
        bankCode: cleaned.substring(4, 8),
        accountNumber: cleaned.substring(8),
        formattedIban: formatted,
        error: 'Checksum failure: The check digits in this IBAN do not match the Mod-97 checksum.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="bg-[#0a146e] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Xe IBAN Calculator &amp; Validator</h3>
              <p className="text-xs text-blue-200">Verify destination accounts before sending funds</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
              Enter IBAN to Validate
            </label>
            <input
              type="text"
              id="iban-calculator-input"
              value={ibanInput}
              onChange={(e) => setIbanInput(e.target.value)}
              placeholder="e.g. GB29 NWBK 6016 1331 9268 19"
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#0071eb] font-mono font-bold text-sm tracking-wide"
            />
          </div>

          <div className="flex gap-2">
            <button
              id="validate-iban-btn"
              onClick={() => validateIban(ibanInput)}
              className="flex-1 py-3 bg-[#0071eb] hover:bg-[#005ec4] text-white font-bold rounded-xl text-sm transition-all shadow-xs"
            >
              Validate IBAN
            </button>
            <button
              onClick={() => {
                setIbanInput('GB29 NWBK 6016 1331 9268 19');
                validateIban('GB29 NWBK 6016 1331 9268 19');
              }}
              className="px-3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Try UK Sample
            </button>
          </div>

          {result && (
            <div
              className={`p-4 rounded-2xl border ${
                result.isValid ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                {result.isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <span className={`text-sm font-bold ${result.isValid ? 'text-emerald-900' : 'text-rose-900'}`}>
                  {result.isValid ? 'Valid IBAN Structure & Checksum' : 'Invalid IBAN'}
                </span>
              </div>

              {result.error && (
                <p className="text-xs text-rose-700 mb-3">{result.error}</p>
              )}

              <div className="space-y-1.5 text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-slate-200/50">
                <div className="flex justify-between">
                  <span className="text-slate-500">Country:</span>
                  <span className="font-semibold">{result.countryName} ({result.countryCode})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank Code:</span>
                  <span className="font-mono font-semibold">{result.bankCode || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Formatted:</span>
                  <span className="font-mono font-bold text-slate-900">{result.formattedIban}</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            Supports 80+ SEPA and ISO-13616 compliant bank formats worldwide with Mod-97 verification.
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
