import React, { useState } from 'react';
import { Globe, ArrowRight, Download, Send, Check } from 'lucide-react';
import { SEND_DESTINATIONS } from '../data/currencies';

interface DestinationsGridProps {
  onSelectDestination: (currency: string) => void;
  onGetStarted: () => void;
  onDownloadApp: () => void;
}

export const DestinationsGrid: React.FC<DestinationsGridProps> = ({
  onSelectDestination,
  onGetStarted,
  onDownloadApp
}) => {
  const [showAll, setShowAll] = useState(false);

  const displayedDestinations = showAll ? SEND_DESTINATIONS : SEND_DESTINATIONS.slice(0, 12);

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0071eb] text-xs font-bold uppercase tracking-wider mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>Connecting the world</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Send money destinations
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Direct real-time settlement to local bank accounts, debit cards, and mobile wallets.
          </p>
        </div>

        {/* Destination Country Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
          {displayedDestinations.map((dest) => (
            <button
              key={dest.code}
              id={`destination-btn-${dest.code.toLowerCase()}`}
              onClick={() => onSelectDestination(dest.currency)}
              className="p-4 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-[#0071eb] rounded-2xl transition-all text-left flex flex-col justify-between group shadow-2xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl group-hover:scale-110 transition-transform">{dest.flag}</span>
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-[#0071eb] uppercase font-mono">
                    {dest.code.toLowerCase()}
                  </span>
                </div>
                <div className="font-bold text-slate-900 group-hover:text-[#0071eb] text-sm line-clamp-1">
                  {dest.name}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-500">{dest.currency}</span>
                <span className="text-emerald-600 font-semibold">{dest.speed}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Show More toggle button */}
        <div className="text-center mb-20">
          <button
            id="destinations-show-more-btn"
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-bold rounded-full transition-colors shadow-xs"
          >
            {showAll ? 'Show fewer countries' : 'Show more destinations'}
          </button>
        </div>

        {/* Call to Action Banner from prompt */}
        <div className="bg-gradient-to-r from-[#0a146e] via-[#0c1b8a] to-[#0071eb] rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden text-center max-w-5xl mx-auto">
          {/* Subtle geometric line reflection */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Simplifying money transfers
            </h3>
            <p className="text-base sm:text-xl text-blue-100/90 leading-relaxed font-medium">
              Xe helps you make money transfers abroad online, quickly and with low fees
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                id="cta-get-started-btn"
                onClick={onGetStarted}
                className="px-8 py-4 bg-white text-[#0a146e] hover:bg-blue-50 font-black text-base rounded-full shadow-lg transition-all active:scale-95"
              >
                Get started
              </button>
              <button
                id="cta-download-app-btn"
                onClick={onDownloadApp}
                className="px-7 py-4 bg-white/20 hover:bg-white/30 text-white font-bold text-base rounded-full backdrop-blur-md transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Download the app</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
