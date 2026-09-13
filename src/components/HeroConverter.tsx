import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeftRight,
  TrendingUp,
  Send,
  Bell,
  Calculator,
  Info,
  Clock,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  Download,
  Share2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Currency, TransferQuote, RateAlert } from '../types';
import { CURRENCIES, generateHistoricalPoints } from '../data/currencies';
import { CurrencySelectModal } from './CurrencySelectModal';
import { CurrencyDropdown } from './CurrencyDropdown';
import { SmartCurrencyInput } from './SmartCurrencyInput';
import { uploadReceiptToGoogleDrive, downloadReceiptFile } from '../utils/driveStorage';

interface HeroConverterProps {
  onOpenDriveModal: () => void;
  activeTab?: 'convert' | 'send' | 'charts' | 'alerts';
  onTabChange?: (tab: 'convert' | 'send' | 'charts' | 'alerts') => void;
  selectedFromCode?: string;
  selectedToCode?: string;
  onOpenShareModal?: (data?: { from?: string; to?: string; amount?: number; converted?: number; rate?: number }) => void;
}

export const HeroConverter: React.FC<HeroConverterProps> = ({
  onOpenDriveModal,
  activeTab: externalTab,
  onTabChange,
  selectedFromCode = 'USD',
  selectedToCode = 'EUR',
  onOpenShareModal
}) => {
  const [internalTab, setInternalTab] = useState<'convert' | 'send' | 'charts' | 'alerts'>('convert');
  const activeTab = externalTab || internalTab;
  const setTab = (t: 'convert' | 'send' | 'charts' | 'alerts') => {
    if (onTabChange) onTabChange(t);
    setInternalTab(t);
  };

  // Currencies state
  const [fromCurr, setFromCurr] = useState<Currency>(
    () => CURRENCIES.find(c => c.code === selectedFromCode) || CURRENCIES[0]
  );
  const [toCurr, setToCurr] = useState<Currency>(
    () => CURRENCIES.find(c => c.code === selectedToCode) || CURRENCIES[1]
  );

  useEffect(() => {
    if (selectedFromCode) {
      const match = CURRENCIES.find(c => c.code === selectedFromCode);
      if (match) setFromCurr(match);
    }
  }, [selectedFromCode]);

  useEffect(() => {
    if (selectedToCode) {
      const match = CURRENCIES.find(c => c.code === selectedToCode);
      if (match) setToCurr(match);
    }
  }, [selectedToCode]);

  // Amount
  const [amountStr, setAmountStr] = useState<string>('1000');

  // Modals for selection
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [pickingTarget, setPickingTarget] = useState<'from' | 'to'>('from');

  // Swap animation
  const [isSwapping, setIsSwapping] = useState(false);

  // Send Flow States
  const [sendStep, setSendStep] = useState<1 | 2 | 3 | 4>(1);
  const [recipientName, setRecipientName] = useState('Jane Doe');
  const [recipientEmail, setRecipientEmail] = useState('jane.doe@example.com');
  const [recipientIban, setRecipientIban] = useState('DE89 3704 0044 0532 0130 00');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'card' | 'wire'>('bank');
  const [completedTransfer, setCompletedTransfer] = useState<TransferQuote | null>(null);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [driveUploadStatus, setDriveUploadStatus] = useState<string | null>(null);

  // Chart States
  const [chartTimeframe, setChartTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | '5Y'>('1M');
  const [hoveredPoint, setHoveredPoint] = useState<{ timeLabel: string; rate: number } | null>(null);

  // Alerts State
  const [alertTargetRate, setAlertTargetRate] = useState<string>('');
  const [alertEmail, setAlertEmail] = useState<string>('user@example.com');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');
  const [alertsList, setAlertsList] = useState<RateAlert[]>([
    {
      id: 'alt-1',
      fromCode: 'USD',
      toCode: 'EUR',
      currentRate: 0.86202,
      targetRate: 0.88,
      condition: 'above',
      email: 'user@example.com',
      frequency: 'once',
      active: true,
      createdAt: 'Sep 12, 2026'
    }
  ]);
  const [alertSuccessMessage, setAlertSuccessMessage] = useState<string | null>(null);

  // Math Calculations: sanitize commas before parsing float
  const numericAmount = useMemo(() => {
    const cleaned = amountStr.replace(/,/g, '');
    const val = parseFloat(cleaned);
    return isNaN(val) ? 0 : val;
  }, [amountStr]);
  // Rate: fromCurr -> USD -> toCurr
  // 1 fromCurr = (toCurr.rateToUSD / fromCurr.rateToUSD) toCurr
  const exchangeRate = useMemo(() => {
    if (!fromCurr || !toCurr || fromCurr.rateToUSD <= 0) return 1;
    return toCurr.rateToUSD / fromCurr.rateToUSD;
  }, [fromCurr, toCurr]);

  const convertedAmount = numericAmount * exchangeRate;
  const inverseRate = exchangeRate > 0 ? 1 / exchangeRate : 0;

  // Set default alert rate whenever exchangeRate changes
  useEffect(() => {
    if (!alertTargetRate) {
      setAlertTargetRate((exchangeRate * 1.02).toFixed(4));
    }
  }, [exchangeRate]);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 400);
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  const handleOpenPicker = (target: 'from' | 'to') => {
    setPickingTarget(target);
    setSelectModalOpen(true);
  };

  // Complete Send Transfer
  const handleCompleteTransfer = async () => {
    const newTransfer: TransferQuote = {
      id: `XE-${Math.floor(100000 + Math.random() * 900000)}`,
      fromCode: fromCurr.code,
      toCode: toCurr.code,
      sendAmount: numericAmount,
      receiveAmount: convertedAmount,
      exchangeRate: exchangeRate,
      fee: 0.0,
      deliveryEstimate: 'Arrives in 15 minutes',
      recipientName,
      recipientEmail,
      recipientIban,
      paymentMethod,
      status: 'completed',
      createdAt: 'Sep 13, 2026, 15:12 UTC'
    };

    setCompletedTransfer(newTransfer);
    setSendStep(4);

    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Auto-record to Google Drive storage utility
    try {
      await uploadReceiptToGoogleDrive(newTransfer);
    } catch (e) {
      console.warn('Auto drive record failed', e);
    }
  };

  const handleSaveToDrive = async () => {
    if (!completedTransfer) return;
    setIsUploadingToDrive(true);
    setDriveUploadStatus(null);
    try {
      const result = await uploadReceiptToGoogleDrive(completedTransfer);
      setDriveUploadStatus(result.message);
      if (result.fileUrl) {
        setCompletedTransfer(prev => prev ? { ...prev, driveFileUrl: result.fileUrl } : null);
      }
    } catch (err: any) {
      setDriveUploadStatus(err.message || 'Saved locally to records.');
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  // Historical chart data
  const chartPoints = useMemo(() => {
    return generateHistoricalPoints(fromCurr.code, toCurr.code, exchangeRate, chartTimeframe);
  }, [fromCurr.code, toCurr.code, exchangeRate, chartTimeframe]);

  const ratesOnly = chartPoints.map(p => p.rate);
  const minRate = Math.min(...ratesOnly);
  const maxRate = Math.max(...ratesOnly);
  const avgRate = ratesOnly.reduce((a, b) => a + b, 0) / (ratesOnly.length || 1);
  const firstRate = ratesOnly[0] || exchangeRate;
  const lastRate = ratesOnly[ratesOnly.length - 1] || exchangeRate;
  const pctChange = firstRate > 0 ? ((lastRate - firstRate) / firstRate) * 100 : 0;

  // Add Alert handler
  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(alertTargetRate);
    if (isNaN(target) || target <= 0) return;

    const newAlert: RateAlert = {
      id: `alt-${Date.now()}`,
      fromCode: fromCurr.code,
      toCode: toCurr.code,
      currentRate: exchangeRate,
      targetRate: target,
      condition: alertCondition,
      email: alertEmail,
      frequency: 'once',
      active: true,
      createdAt: 'Today, 15:12 UTC'
    };

    setAlertsList([newAlert, ...alertsList]);
    setAlertSuccessMessage(`Rate alert set! We will notify ${alertEmail} when 1 ${fromCurr.code} is ${alertCondition} ${target} ${toCurr.code}.`);
    setTimeout(() => setAlertSuccessMessage(null), 5000);
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#0a146e] via-[#0c187e] to-[#f4f6fa] pt-8 pb-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Main Title and Tagline from prompt */}
        <div className="text-center mb-8 text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Global currency conversions &amp; money transfers
          </h1>
          <p className="mt-3 text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto font-medium">
            Leading the world in currency information and global transfers for 30+ years
          </p>
        </div>

        {/* Main Interactive Widget Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          {/* Tab Navigation (Convert, Send, Charts, Alerts) */}
          <div className="flex items-center border-b border-slate-200/80 bg-slate-50/70 overflow-x-auto scrollbar-none">
            <button
              id="tab-convert"
              onClick={() => setTab('convert')}
              className={`flex-1 min-w-[120px] py-4 px-4 sm:px-6 text-sm sm:text-base font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'convert'
                  ? 'border-[#0071eb] text-[#0071eb] bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Calculator className="w-5 h-5" />
              <span>Convert</span>
            </button>

            <button
              id="tab-send"
              onClick={() => {
                setTab('send');
                if (sendStep === 4) setSendStep(1);
              }}
              className={`flex-1 min-w-[120px] py-4 px-4 sm:px-6 text-sm sm:text-base font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'send'
                  ? 'border-[#0071eb] text-[#0071eb] bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>Send</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-full uppercase">
                $0 Fee
              </span>
            </button>

            <button
              id="tab-charts"
              onClick={() => setTab('charts')}
              className={`flex-1 min-w-[120px] py-4 px-4 sm:px-6 text-sm sm:text-base font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'charts'
                  ? 'border-[#0071eb] text-[#0071eb] bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span>Charts</span>
            </button>

            <button
              id="tab-alerts"
              onClick={() => setTab('alerts')}
              className={`flex-1 min-w-[120px] py-4 px-4 sm:px-6 text-sm sm:text-base font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'alerts'
                  ? 'border-[#0071eb] text-[#0071eb] bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span>Alerts</span>
            </button>
          </div>

          {/* TAB 1: CONVERT */}
          {activeTab === 'convert' && (
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* Amount Field with Smart Auto-formatting */}
                <div className="md:col-span-3">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="convert-amount" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Amount
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                      Auto-formatted
                    </span>
                  </div>
                  <SmartCurrencyInput
                    id="convert-amount"
                    value={amountStr}
                    onChange={(val) => setAmountStr(val)}
                    currencySymbol={fromCurr.symbol}
                    currencyCode={fromCurr.code}
                    placeholder="1,000.00"
                    size="lg"
                  />
                  {/* Quick Preset Amount Pills */}
                  <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5 scrollbar-none">
                    {['100', '500', '1,000', '5,000', '10,000'].map((preset) => {
                      const presetNum = parseFloat(preset.replace(/,/g, ''));
                      const isSelected = numericAmount === presetNum;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setAmountStr(preset.replace(/,/g, ''))}
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md border transition-all shrink-0 ${
                            isSelected
                              ? 'bg-blue-50 text-[#0071eb] border-blue-200 ring-1 ring-blue-100'
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                          }`}
                        >
                          {fromCurr.symbol}{preset}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* From Currency Selector with Real-time Search */}
                <div className="md:col-span-4">
                  <CurrencyDropdown
                    label="From"
                    selectedCurrency={fromCurr}
                    onSelect={(curr) => setFromCurr(curr)}
                    idPrefix="convert-from"
                  />
                </div>

                {/* Visual Swap Currency Button */}
                <div className="md:col-span-1 flex flex-col items-center justify-end pb-1 relative my-2 md:my-0">
                  {/* Connector line for mobile view */}
                  <div className="w-full h-px bg-slate-200 absolute top-1/2 -translate-y-1/2 md:hidden" aria-hidden="true" />
                  <button
                    type="button"
                    id="convert-swap-btn"
                    onClick={handleSwap}
                    aria-label={`Swap ${fromCurr.code} and ${toCurr.code} currencies`}
                    title={`Swap ${fromCurr.code} and ${toCurr.code}`}
                    className="relative z-10 w-12 h-12 rounded-full border-2 border-slate-200 bg-white hover:border-[#0071eb] hover:bg-blue-50 text-slate-600 hover:text-[#0071eb] flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md active:scale-90 group focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    <ArrowLeftRight
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isSwapping ? 'rotate-180 text-[#0071eb]' : 'group-hover:rotate-180'
                      }`}
                    />
                    <span className="sr-only">Swap currencies</span>
                  </button>
                </div>

                {/* To Currency Selector with Real-time Search */}
                <div className="md:col-span-4">
                  <CurrencyDropdown
                    label="To"
                    selectedCurrency={toCurr}
                    onSelect={(curr) => setToCurr(curr)}
                    idPrefix="convert-to"
                  />
                </div>
              </div>

              {/* Conversion Result Block */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <div className="text-sm font-semibold text-slate-500 mb-1">
                    {numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                    {fromCurr.name} =
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
                    {convertedAmount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6
                    })}{' '}
                    <span className="text-[#0071eb]">{toCurr.code}</span>
                  </div>

                  {/* Mid-market rate timestamp line */}
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>
                        1.00 {fromCurr.code} = {exchangeRate < 0.01 ? exchangeRate.toFixed(8) : exchangeRate.toFixed(8)} {toCurr.code}
                      </span>
                    </div>
                    <span>•</span>
                    <div>
                      1.00 {toCurr.code} = {inverseRate < 0.01 ? inverseRate.toFixed(8) : inverseRate.toFixed(8)} {fromCurr.code}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Mid-market rate at 15:12 UTC</span>
                    </div>
                  </div>
                </div>

                {/* Converter Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                  <button
                    type="button"
                    id="convert-track-rates-btn"
                    onClick={() => setTab('charts')}
                    className="flex-1 sm:flex-initial px-4 py-3 rounded-full font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>Track exchange rates</span>
                  </button>

                  <button
                    type="button"
                    id="convert-share-btn"
                    onClick={() =>
                      onOpenShareModal?.({
                        from: fromCurr.code,
                        to: toCurr.code,
                        amount: numericAmount,
                        converted: convertedAmount,
                        rate: exchangeRate
                      })
                    }
                    className="flex-1 sm:flex-initial px-4 py-3 rounded-full font-bold text-sm border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors flex items-center justify-center gap-2"
                    title="এই কারেন্সি রেট বিভিন্ন প্ল্যাটফর্মে শেয়ার করুন"
                  >
                    <Share2 className="w-4 h-4 text-[#0071eb]" />
                    <span>শেয়ার করুন</span>
                  </button>

                  <button
                    type="button"
                    id="convert-send-money-btn"
                    onClick={() => setTab('send')}
                    className="flex-1 sm:flex-initial px-6 py-3 rounded-full font-bold text-sm bg-[#0071eb] hover:bg-[#005ec4] text-white transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send money</span>
                  </button>
                </div>
              </div>

              {/* Informational Disclaimer from prompt */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs text-slate-600">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  We use the mid-market rate for our Converter. This is for informational purposes only. You won’t
                  receive this rate when sending money.{' '}
                  <button
                    onClick={() => setTab('send')}
                    className="text-[#0071eb] font-semibold underline hover:text-[#005ec4]"
                  >
                    Login to view send rates
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SEND MONEY FLOW */}
          {activeTab === 'send' && (
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Stepper Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {[
                    { step: 1, label: 'Get Quote' },
                    { step: 2, label: 'Recipient' },
                    { step: 3, label: 'Payment' },
                    { step: 4, label: 'Confirmation' }
                  ].map((s, idx) => (
                    <div key={s.step} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                            sendStep === s.step
                              ? 'bg-[#0071eb] text-white ring-4 ring-blue-100 shadow-sm'
                              : sendStep > s.step
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {sendStep > s.step ? <CheckCircle2 className="w-5 h-5" /> : s.step}
                        </div>
                        <span className="text-xs font-semibold mt-1 text-slate-700 hidden sm:inline">
                          {s.label}
                        </span>
                      </div>
                      {idx < 3 && (
                        <div
                          className={`w-12 sm:w-24 h-0.5 mx-2 transition-all ${
                            sendStep > s.step ? 'bg-emerald-500' : 'bg-slate-200'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 1: QUOTE */}
              {sendStep === 1 && (
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-blue-600 shrink-0" />
                    <div className="text-xs text-blue-900">
                      <span className="font-bold">Xe First Transfer Promotion:</span> Enjoy $0 transfer fees and guaranteed mid-market competitive rates for transfers to 190+ countries.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">You Send Amount</label>
                        <SmartCurrencyInput
                          id="send-amount"
                          value={amountStr}
                          onChange={(val) => setAmountStr(val)}
                          currencySymbol={fromCurr.symbol}
                          currencyCode={fromCurr.code}
                          placeholder="1,000.00"
                          size="md"
                        />
                      </div>
                      <CurrencyDropdown
                        label="Send Currency"
                        selectedCurrency={fromCurr}
                        onSelect={(c) => setFromCurr(c)}
                        idPrefix="send-from"
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Recipient Gets</label>
                        <div className="flex items-center border-2 border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50">
                          <span className="text-slate-400 font-bold mr-2">{toCurr.symbol}</span>
                          <div className="w-full text-lg font-bold text-slate-900">
                            {convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                      <CurrencyDropdown
                        label="Recipient Currency"
                        selectedCurrency={toCurr}
                        onSelect={(c) => setToCurr(c)}
                        idPrefix="send-to"
                      />
                    </div>
                  </div>

                  {/* Transfer details summary table */}
                  <div className="border border-slate-200 rounded-xl p-4 divide-y divide-slate-100 text-sm">
                    <div className="flex justify-between py-2 text-slate-600">
                      <span>Transfer Fee</span>
                      <span className="font-bold text-emerald-600">$0.00 (Free promotion)</span>
                    </div>
                    <div className="flex justify-between py-2 text-slate-600">
                      <span>Exchange Rate</span>
                      <span className="font-mono text-slate-900">1 {fromCurr.code} = {exchangeRate.toFixed(6)} {toCurr.code}</span>
                    </div>
                    <div className="flex justify-between py-2 text-slate-600">
                      <span>Estimated Delivery</span>
                      <span className="font-semibold text-slate-900">Within minutes (Fast settlement)</span>
                    </div>
                    <div className="flex justify-between pt-2 text-base font-bold text-slate-900">
                      <span>Total to Pay</span>
                      <span>{numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {fromCurr.code}</span>
                    </div>
                  </div>

                  <button
                    id="send-continue-step1"
                    onClick={() => setSendStep(2)}
                    className="w-full py-3.5 bg-[#0071eb] hover:bg-[#005ec4] text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-base flex items-center justify-center gap-2"
                  >
                    <span>Continue to Recipient Details</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* STEP 2: RECIPIENT */}
              {sendStep === 2 && (
                <div className="max-w-2xl mx-auto space-y-5">
                  <h3 className="text-lg font-bold text-slate-900">Who are you sending money to?</h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Recipient Full Name</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#0071eb] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Recipient Email (for tracking updates)</label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="e.g. jane.doe@example.com"
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#0071eb] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                      Bank IBAN or Account Number in {toCurr.name}
                    </label>
                    <input
                      type="text"
                      value={recipientIban}
                      onChange={(e) => setRecipientIban(e.target.value)}
                      placeholder="e.g. DE89 3704 0044 0532 0130 00"
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#0071eb] text-sm font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Verified with Xe Global Bank Validation Engine</p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setSendStep(1)}
                      className="flex-1 py-3 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      id="send-continue-step2"
                      onClick={() => setSendStep(3)}
                      className="flex-2 py-3 bg-[#0071eb] hover:bg-[#005ec4] text-white font-bold rounded-xl transition-all shadow-md text-sm"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {sendStep === 3 && (
                <div className="max-w-2xl mx-auto space-y-5">
                  <h3 className="text-lg font-bold text-slate-900">Choose how to fund your transfer</h3>

                  <div className="space-y-3">
                    {[
                      { id: 'bank', title: 'Connected Bank Account (ACH/SEPA)', desc: 'Fastest & zero transfer fees. Free settlement.', speed: 'Instant / 15 mins' },
                      { id: 'card', title: 'Debit or Credit Card', desc: 'Instant authorization with Visa or Mastercard.', speed: 'Immediate' },
                      { id: 'wire', title: 'Domestic Bank Wire', desc: 'Ideal for larger enterprise and high-value transfers.', speed: 'Same day' }
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-start justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-[#0071eb] bg-blue-50/50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id as any)}
                            className="mt-1 text-[#0071eb]"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{method.title}</div>
                            <div className="text-xs text-slate-500">{method.desc}</div>
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                          {method.speed}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Sending to:</span>
                      <span className="font-semibold text-slate-900">{recipientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recipient receives:</span>
                      <span className="font-bold text-emerald-600 text-sm">
                        {convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurr.code}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guaranteed mid-market rate:</span>
                      <span className="font-mono text-slate-900">1 {fromCurr.code} = {exchangeRate.toFixed(6)} {toCurr.code}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSendStep(2)}
                      className="flex-1 py-3 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      id="send-confirm-transfer-btn"
                      onClick={handleCompleteTransfer}
                      className="flex-2 py-3 bg-[#0071eb] hover:bg-[#005ec4] text-white font-bold rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-5 h-5 text-emerald-300" />
                      <span>Confirm and Fund Transfer</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CONFIRMATION WITH GOOGLE DRIVE INTEGRATION */}
              {sendStep === 4 && completedTransfer && (
                <div className="max-w-2xl mx-auto text-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Transfer Initiated Successfully!</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Reference ID: <span className="font-mono font-bold text-slate-800">{completedTransfer.id}</span>
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left text-sm space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-slate-500">Amount Sent:</span>
                      <span className="font-bold text-slate-900">
                        {completedTransfer.sendAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {completedTransfer.fromCode}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-slate-500">Recipient ({completedTransfer.recipientName}) Gets:</span>
                      <span className="font-extrabold text-emerald-600 text-base">
                        {completedTransfer.receiveAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {completedTransfer.toCode}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                      <span className="text-slate-500">Exchange Rate:</span>
                      <span className="font-mono text-slate-800">
                        1 {completedTransfer.fromCode} = {completedTransfer.exchangeRate.toFixed(6)} {completedTransfer.toCode}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Status:</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#0071eb]">
                        <span className="w-2 h-2 rounded-full bg-[#0071eb] animate-pulse" />
                        Processing for delivery
                      </span>
                    </div>
                  </div>

                  {/* Google Drive Integration Action Box */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-blue-200 flex items-center justify-center shrink-0">
                        <HardDrive className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          <span>Google Drive Sync</span>
                          <span className="text-[10px] bg-blue-200/80 text-blue-800 font-bold px-1.5 py-0.2 rounded-sm">
                            Enabled
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Save official Xe money transfer receipt and PDF audit proof to Google Drive.
                        </p>
                        {driveUploadStatus && (
                          <p className="text-xs font-semibold text-emerald-700 mt-1">
                            {driveUploadStatus}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        id="save-to-drive-btn"
                        onClick={handleSaveToDrive}
                        disabled={isUploadingToDrive}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>{isUploadingToDrive ? 'Saving to Drive...' : 'Save to Drive'}</span>
                      </button>
                      <button
                        type="button"
                        id="download-receipt-btn"
                        onClick={() => downloadReceiptFile(completedTransfer)}
                        className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        title="Download Text/PDF Receipt"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSendStep(1);
                        setTab('convert');
                      }}
                      className="flex-1 py-3 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 text-sm"
                    >
                      Make Another Transfer
                    </button>
                    <button
                      type="button"
                      onClick={onOpenDriveModal}
                      className="flex-1 py-3 bg-[#0a146e] hover:bg-[#13229b] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <HardDrive className="w-4 h-4 text-blue-300" />
                      <span>View All Saved Receipts</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CHARTS */}
          {activeTab === 'charts' && (
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Chart Header & Currency Pair controls */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex-1 w-full lg:w-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end max-w-xl mb-2">
                    <CurrencyDropdown
                      label="Base Currency"
                      selectedCurrency={fromCurr}
                      onSelect={(c) => setFromCurr(c)}
                      idPrefix="chart-from"
                    />
                    <div className="flex justify-center pb-1">
                      <button
                        type="button"
                        id="chart-swap-btn"
                        onClick={handleSwap}
                        title={`Swap Base (${fromCurr.code}) and Target (${toCurr.code})`}
                        aria-label="Swap Base and Target currencies"
                        className="w-11 h-11 rounded-full border-2 border-slate-200 bg-white hover:border-[#0071eb] hover:bg-blue-50 text-slate-600 hover:text-[#0071eb] flex items-center justify-center transition-all shadow-xs active:scale-90 group focus:outline-none focus:ring-4 focus:ring-blue-100"
                      >
                        <ArrowLeftRight className={`w-4 h-4 transition-transform duration-300 ${isSwapping ? 'rotate-180 text-[#0071eb]' : 'group-hover:rotate-180'}`} />
                      </button>
                    </div>
                    <CurrencyDropdown
                      label="Target Currency"
                      selectedCurrency={toCurr}
                      onSelect={(c) => setToCurr(c)}
                      idPrefix="chart-to"
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Mid-market rate: 1 {fromCurr.code} = {exchangeRate.toFixed(6)} {toCurr.code}
                  </div>
                </div>

                {/* Timeframe Selector */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 self-end lg:self-center">
                  {(['1D', '1W', '1M', '1Y', '5Y'] as const).map((tf) => (
                    <button
                      key={tf}
                      id={`chart-tf-${tf.toLowerCase()}`}
                      onClick={() => setChartTimeframe(tf)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        chartTimeframe === tf
                          ? 'bg-[#0071eb] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Period High</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">{maxRate.toFixed(5)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Period Low</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">{minRate.toFixed(5)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Average</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">{avgRate.toFixed(5)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">{chartTimeframe} Change</div>
                  <div className={`text-base font-extrabold mt-0.5 ${pctChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {pctChange >= 0 ? '+' : ''}{pctChange.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Interactive SVG Chart Canvas */}
              <div className="relative w-full h-64 sm:h-80 bg-slate-50/70 rounded-2xl border border-slate-200/80 p-4">
                {hoveredPoint && (
                  <div className="absolute top-4 left-4 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-mono shadow-lg z-10">
                    <span className="font-bold">{hoveredPoint.rate.toFixed(6)} {toCurr.code}</span>
                    <span className="text-slate-400 ml-2">({hoveredPoint.timeLabel})</span>
                  </div>
                )}

                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0071eb" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#0071eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#e2e8f0" strokeDasharray="2 2" strokeWidth="0.5" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeDasharray="2 2" strokeWidth="0.5" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#e2e8f0" strokeDasharray="2 2" strokeWidth="0.5" />

                  {/* Area fill */}
                  {(() => {
                    const range = maxRate - minRate || 1;
                    const pathCoords = chartPoints.map((pt, idx) => {
                      const x = (idx / (chartPoints.length - 1)) * 100;
                      const y = 85 - ((pt.rate - minRate) / range) * 70;
                      return `${x},${y}`;
                    });
                    const areaD = `M0,90 L${pathCoords.join(' L')} L100,90 Z`;
                    const lineD = `M${pathCoords.join(' L')}`;

                    return (
                      <>
                        <path d={areaD} fill="url(#chartGradient)" />
                        <path d={lineD} fill="none" stroke="#0071eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        {chartPoints.map((pt, idx) => {
                          const x = (idx / (chartPoints.length - 1)) * 100;
                          const y = 85 - ((pt.rate - minRate) / range) * 70;
                          return (
                            <circle
                              key={idx}
                              cx={x}
                              cy={y}
                              r="3"
                              className="fill-[#0071eb] hover:r-5 cursor-pointer transition-all"
                              onMouseEnter={() => setHoveredPoint({ timeLabel: pt.timeLabel, rate: pt.rate })}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>

              {/* Chart Footer Actions */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Data updated from official Xe Currency Data Feed API • Live interbank feeds
                </div>
                <button
                  type="button"
                  id="chart-send-pair-btn"
                  onClick={() => setTab('send')}
                  className="px-6 py-2.5 bg-[#0071eb] hover:bg-[#005ec4] text-white rounded-full font-bold text-xs transition-all shadow-sm"
                >
                  Send {fromCurr.code} to {toCurr.code} Now
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ALERTS */}
          {activeTab === 'alerts' && (
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Set a Free Xe Rate Alert</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    We'll email you the moment your desired exchange rate hits the market so you can transfer at the peak.
                  </p>
                </div>

                {alertSuccessMessage && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{alertSuccessMessage}</span>
                  </div>
                )}

                <form onSubmit={handleAddAlert} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
                    <CurrencyDropdown
                      label="From Currency"
                      selectedCurrency={fromCurr}
                      onSelect={(c) => setFromCurr(c)}
                      idPrefix="alert-from"
                    />
                    <div className="flex justify-center pb-1">
                      <button
                        type="button"
                        id="alert-swap-btn"
                        onClick={handleSwap}
                        title={`Swap Alert Currencies (${fromCurr.code} <-> ${toCurr.code})`}
                        aria-label="Swap Alert Currencies"
                        className="w-11 h-11 rounded-full border-2 border-slate-200 bg-white hover:border-[#0071eb] hover:bg-blue-50 text-slate-600 hover:text-[#0071eb] flex items-center justify-center transition-all shadow-xs active:scale-90 group focus:outline-none focus:ring-4 focus:ring-blue-100"
                      >
                        <ArrowLeftRight className={`w-4 h-4 transition-transform duration-300 ${isSwapping ? 'rotate-180 text-[#0071eb]' : 'group-hover:rotate-180'}`} />
                      </button>
                    </div>
                    <CurrencyDropdown
                      label="To Currency"
                      selectedCurrency={toCurr}
                      onSelect={(c) => setToCurr(c)}
                      idPrefix="alert-to"
                    />
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">Live Exchange Rate:</span>
                    <span className="font-mono font-bold text-slate-800">
                      1 {fromCurr.code} = {exchangeRate.toFixed(6)} {toCurr.code}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Trigger Condition</label>
                      <select
                        value={alertCondition}
                        onChange={(e) => setAlertCondition(e.target.value as any)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#0071eb]"
                      >
                        <option value="above">Rises Above Target</option>
                        <option value="below">Falls Below Target</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Target Rate</label>
                      <input
                        type="number"
                        step="any"
                        value={alertTargetRate}
                        onChange={(e) => setAlertTargetRate(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold font-mono focus:outline-none focus:border-[#0071eb]"
                        placeholder="0.8800"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Notification Email</label>
                    <input
                      type="email"
                      value={alertEmail}
                      onChange={(e) => setAlertEmail(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0071eb]"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    id="set-rate-alert-btn"
                    className="w-full py-3 bg-[#0071eb] hover:bg-[#005ec4] text-white font-bold rounded-xl text-sm transition-all shadow-sm"
                  >
                    Set Free Rate Alert
                  </button>
                </form>

                {/* Active Alerts List */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Your Active Alerts ({alertsList.length})</h4>
                  <div className="space-y-2">
                    {alertsList.map((alt) => (
                      <div key={alt.id} className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {alt.fromCode}/{alt.toCode} {alt.condition === 'above' ? '≥' : '≤'} {alt.targetRate}
                          </div>
                          <div className="text-slate-500">
                            Sent to {alt.email} • Created {alt.createdAt}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                            Active
                          </span>
                          <button
                            onClick={() => setAlertsList(alertsList.filter(a => a.id !== alt.id))}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Delete Alert"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Currency Select Modal */}
      <CurrencySelectModal
        isOpen={selectModalOpen}
        onClose={() => setSelectModalOpen(false)}
        onSelect={(curr) => {
          if (pickingTarget === 'from') {
            setFromCurr(curr);
          } else {
            setToCurr(curr);
          }
        }}
        selectedCode={pickingTarget === 'from' ? fromCurr.code : toCurr.code}
        title={pickingTarget === 'from' ? 'Select Send Currency' : 'Select Receive Currency'}
      />
    </div>
  );
};
