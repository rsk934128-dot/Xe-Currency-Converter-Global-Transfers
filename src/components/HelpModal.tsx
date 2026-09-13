import React from 'react';
import { HelpCircle, X, Phone, MessageSquare, Mail, FileQuestion, ExternalLink } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    {
      q: 'What is the mid-market exchange rate?',
      a: 'The mid-market rate is the midpoint between the buy and sell rates in the global currency markets. It is the real exchange rate without commercial markups.'
    },
    {
      q: 'How fast will my international transfer arrive?',
      a: 'Most transfers to major corridors (UK, Europe, India, Australia, US) arrive within minutes. Some local bank settlements may take up to 24 hours.'
    },
    {
      q: 'How does Google Drive integration work?',
      a: 'When you initiate or complete a money transfer or save an exchange rate audit, you can automatically archive the official receipt into your Google Drive.'
    },
    {
      q: 'Are my transfers secure?',
      a: 'Yes. Xe is a fully licensed and regulated money transmitter with bank-grade 256-bit encryption and round-the-clock fraud surveillance.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
        <div className="bg-[#0a146e] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Xe Help Center &amp; Support</h3>
              <p className="text-xs text-blue-200">24/7 global customer assistance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick contact methods */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <MessageSquare className="w-5 h-5 text-[#0071eb] mx-auto" />
              <div className="text-xs font-bold text-slate-800">Live Chat</div>
              <div className="text-[11px] text-slate-500">Instant response</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <Phone className="w-5 h-5 text-[#0071eb] mx-auto" />
              <div className="text-xs font-bold text-slate-800">Toll Free Phone</div>
              <div className="text-[11px] text-slate-500">1-877-932-6640</div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <Mail className="w-5 h-5 text-[#0071eb] mx-auto" />
              <div className="text-xs font-bold text-slate-800">Email Support</div>
              <div className="text-[11px] text-slate-500">transfers@xe.com</div>
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Frequently Asked Questions</h4>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-slate-900">{faq.q}</div>
                  <div className="text-slate-600 leading-relaxed">{faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
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
