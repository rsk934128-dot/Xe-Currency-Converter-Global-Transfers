import React, { useState } from 'react';
import { Send, Bell, Clock, Calculator, Mail, ArrowRight, CheckCircle2, QrCode, Smartphone, Download } from 'lucide-react';

interface XeToolsProps {
  onOpenTool: (tool: 'transfers' | 'alerts' | 'history' | 'iban' | 'newsletter') => void;
}

export const XeTools: React.FC<XeToolsProps> = ({ onOpenTool }) => {
  const [appQrOpen, setAppQrOpen] = useState(false);

  const tools = [
    {
      id: 'transfers' as const,
      icon: Send,
      title: 'International transfers',
      description: 'Send money to 190 countries across 130 currencies. Enjoy flexible ways to send and receive money.',
      actionText: 'Learn more',
      badge: '190+ Countries'
    },
    {
      id: 'alerts' as const,
      icon: Bell,
      title: 'Rate alerts',
      description: 'Set free rate alerts for any currency pair. We’ll notify you at your desired rate.',
      actionText: 'Learn more',
      badge: 'Real-time Push'
    },
    {
      id: 'history' as const,
      icon: Clock,
      title: 'Historical currency rates',
      description: 'Analyze rate trends for any currency over a few days, weeks, months, or years. Get an automated currency feed through the Xe Currency Data API.',
      actionText: 'Learn more',
      badge: '10-Year Depth'
    },
    {
      id: 'iban' as const,
      icon: Calculator,
      title: 'IBAN calculator',
      description: 'Search and validate your IBAN (International Bank Account Number) to make sure your transfer is sent to the right destination.',
      actionText: 'Learn more',
      badge: 'Mod-97 Verified'
    },
    {
      id: 'newsletter' as const,
      icon: Mail,
      title: 'Currency email updates',
      description: 'Get a daily analysis of markets, exchange rates, and news straight in your inbox.',
      actionText: 'Learn more',
      badge: 'Daily Market Digest'
    }
  ];

  return (
    <section className="py-20 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* App promotion header banner */}
        <div className="mb-20 bg-gradient-to-r from-[#0a146e] via-[#0e1d8b] to-[#0071eb] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-blue-100 inline-block">
                On-the-go FX Freedom
              </span>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Manage your currencies on the go with the Xe app
              </h3>
              <p className="text-blue-100 text-sm sm:text-base max-w-xl leading-relaxed">
                It has everything you need for international money transfers — easy, secure, and low fees starting at $0.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="xe-app-download-btn"
                  onClick={() => setAppQrOpen(true)}
                  className="px-6 py-3 bg-white text-[#0a146e] hover:bg-blue-50 font-bold rounded-full text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download the app</span>
                </button>

                <button
                  onClick={() => setAppQrOpen(true)}
                  className="px-4 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-full text-sm transition-colors flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan QR Code</span>
                </button>
              </div>
            </div>

            {/* Mobile App mockup card */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl w-64 text-center">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                  <span className="text-xl font-black text-[#0a146e] italic">xe</span>
                </div>
                <div className="text-sm font-bold">Xe Currency &amp; Transfers</div>
                <div className="text-xs text-blue-200 mt-0.5">Rated 4.8 ★ by 500,000+ users</div>

                {/* QR code representation */}
                <div className="mt-4 bg-white p-3 rounded-xl mx-auto w-36 h-36 flex flex-col items-center justify-center shadow-inner">
                  <QrCode className="w-24 h-24 text-slate-900" />
                  <span className="text-[9px] text-slate-500 font-bold uppercase mt-1">Scan to Install</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Xe currency tools Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Xe currency tools
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            FX insights, advanced indicators, live news feeds &amp; customizable dashboards
          </p>
        </div>

        {/* 5 Currency Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-[#0071eb] hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0071eb] group-hover:bg-[#0071eb] group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0071eb] transition-colors mb-3">
                    {tool.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div>
                  <button
                    id={`tool-btn-${tool.id}`}
                    onClick={() => onOpenTool(tool.id)}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#0071eb] hover:text-[#005ec4] group-hover:translate-x-1 transition-all"
                  >
                    <span>{tool.actionText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Code Modal */}
      {appQrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-slate-200">
            <div className="w-16 h-16 bg-[#0a146e] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-black italic text-2xl">
              xe
            </div>
            <h4 className="text-xl font-bold text-slate-900">Scan to Download Xe App</h4>
            <p className="text-xs text-slate-500 mt-1">Available on iOS App Store and Google Play</p>

            <div className="bg-slate-50 p-6 rounded-2xl my-6 border border-slate-200 inline-block">
              <QrCode className="w-44 h-44 text-[#0a146e] mx-auto" />
            </div>

            <button
              onClick={() => setAppQrOpen(false)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
