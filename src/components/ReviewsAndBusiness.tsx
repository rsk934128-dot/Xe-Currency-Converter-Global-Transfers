import React from 'react';
import { Star, ShieldCheck, ArrowRight, Building2, Briefcase, Globe2 } from 'lucide-react';
import { TESTIMONIALS } from '../data/currencies';

interface ReviewsAndBusinessProps {
  onBusinessClick: () => void;
}

export const ReviewsAndBusiness: React.FC<ReviewsAndBusinessProps> = ({ onBusinessClick }) => {
  return (
    <section className="py-20 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Xe is trusted by millions around the globe
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Real customer experiences across North America, Europe, and Asia-Pacific.
          </p>
        </div>

        {/* 3 Customer Review Cards from prompt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {TESTIMONIALS.map((review, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 mb-4 text-[#00b67a]">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-5 h-5 fill-[#00b67a]" />
                  ))}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {review.headline}
                </h3>

                <p className="text-slate-600 text-sm italic leading-relaxed mb-6">
                  "{review.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{review.name}</div>
                  <div className="text-xs text-slate-400">{review.location}</div>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                  Verified User
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges: App Store, Google Play, Trustpilot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-24">
          {/* Apple App Store */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shrink-0">
              
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">Apple App Store</div>
              <div className="text-lg font-black text-slate-900">4.8 / 5</div>
              <div className="text-xs text-slate-500">118k customer ratings</div>
            </div>
          </div>

          {/* Google Play Store */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              ▶
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">Google Play Store</div>
              <div className="text-lg font-black text-slate-900">4.8 / 5</div>
              <div className="text-xs text-slate-500">380k customer ratings</div>
            </div>
          </div>

          {/* Trustpilot */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#00b67a] text-white flex items-center justify-center font-bold text-xl shrink-0">
              ★
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">Trustpilot</div>
              <div className="text-lg font-black text-slate-900">4.4 / 5</div>
              <div className="text-xs text-slate-500">84k verified reviews</div>
            </div>
          </div>
        </div>

        {/* Xe for Business Banner from prompt */}
        <div className="bg-[#0a146e] text-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-200 text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Enterprise &amp; Institutional FX</span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Xe for business
              </h3>

              <p className="text-xl font-bold text-blue-200">
                Global business payments simplified.
              </p>

              <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
                Whether you need to make cross-border payments or FX risk management solutions, we’ve got you covered. Schedule international transfers across 130 currencies in 190+ countries.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="business-payments-btn"
                  onClick={onBusinessClick}
                  className="px-8 py-3.5 bg-[#0071eb] hover:bg-[#005ec4] text-white font-bold text-base rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Business payments</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Business Card graphic */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl w-full max-w-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase text-blue-200">Corporate Portal</div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="text-2xl font-black">$250,000.00 USD</div>
                <div className="text-xs text-blue-200">Multi-currency treasury sweep active</div>
                <div className="h-0.5 bg-white/10" />
                <div className="text-xs space-y-1.5 text-blue-100">
                  <div className="flex justify-between">
                    <span>Hedging Contracts</span>
                    <span className="font-bold text-white">Active (Forward lock)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Batch Payroll</span>
                    <span className="font-bold text-white">Automated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
