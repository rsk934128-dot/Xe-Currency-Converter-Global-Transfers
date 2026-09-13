import React from 'react';
import { Send, Shield, Zap, Globe, Smartphone, Check, ArrowRight } from 'lucide-react';

interface SendOnlinePromoProps {
  onSendMoney: () => void;
  onCompareRates: () => void;
}

export const SendOnlinePromo: React.FC<SendOnlinePromoProps> = ({
  onSendMoney,
  onCompareRates
}) => {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Realistic Phone Mockup Representation */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Decorative aura */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl blur-2xl -z-10" />

              {/* Realistic Phone Mockup Frame */}
              <div className="bg-slate-900 p-3 rounded-[2.5rem] shadow-2xl border-4 border-slate-800">
                {/* Screen */}
                <div className="bg-[#0a146e] text-white rounded-[2rem] p-5 overflow-hidden">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-[10px] text-white/70 mb-4">
                    <span>15:12</span>
                    <div className="flex items-center gap-1">
                      <span>5G</span>
                      <div className="w-4 h-2 border border-white/70 rounded-xs p-0.5">
                        <div className="w-full h-full bg-white rounded-xs" />
                      </div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-black italic tracking-tight">xe</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>

                  {/* Mock Transfer Card */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 mb-4">
                    <div className="text-[11px] text-white/70">Send Money Worldwide</div>
                    <div className="text-2xl font-black text-white mt-1">$1,000.00 USD</div>
                    <div className="h-0.5 bg-white/10 my-3" />
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/80">Recipient gets</span>
                      <span className="font-bold text-emerald-400 text-sm">€862.02 EUR</span>
                    </div>
                    <div className="text-[10px] text-white/60 mt-1">Fee: $0.00 • Rate guaranteed</div>
                  </div>

                  {/* Quick Feature Pills */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-2 text-xs bg-white/5 p-2 rounded-xl border border-white/5">
                      <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-[11px] text-white/90">Instant bank transfer in 15 mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs bg-white/5 p-2 rounded-xl border border-white/5">
                      <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-[11px] text-white/90">Bank-grade 256-bit encryption</span>
                    </div>
                  </div>

                  {/* Phone CTA Button */}
                  <button
                    onClick={onSendMoney}
                    className="w-full py-2.5 bg-[#0071eb] text-white rounded-xl font-bold text-xs shadow-md hover:bg-blue-600 transition-colors"
                  >
                    Confirm &amp; Send Transfer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy and Actions matching the prompt exactly */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0071eb] text-xs font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              <span>International Money Transfers Made Easy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Send money online
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              At Xe, we make sending money fast, secure, and convenient. With just a few clicks, you can send money to over 190 countries worldwide. Join thousands who trust us daily for their money transfer needs.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Transparent mid-market rates',
                'No hidden transfer fees on promos',
                'Bank-level security & fraud monitoring',
                'Track progress in real time'
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-blue-100 text-[#0071eb] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            {/* Action buttons from prompt */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                id="promo-send-money-now-btn"
                onClick={onSendMoney}
                className="px-7 py-3.5 bg-[#0071eb] hover:bg-[#005ec4] text-white font-bold text-base rounded-full shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Send money now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="promo-compare-rates-btn"
                onClick={onCompareRates}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base rounded-full transition-colors"
              >
                Compare rates
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
