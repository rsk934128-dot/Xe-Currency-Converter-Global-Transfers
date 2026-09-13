import React, { useState } from 'react';
import { Mail, X, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [subscribed, setSubscribed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="bg-[#0a146e] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Currency Email Updates</h3>
              <p className="text-xs text-blue-200">Xe Market Analysis &amp; Daily Fixings</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {subscribed ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">You're Subscribed!</h4>
              <p className="text-xs text-slate-600">
                A confirmation has been sent to <span className="font-bold text-slate-800">{email}</span>. You'll receive your first {frequency} currency digest at next market opening.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#0071eb] text-white rounded-xl font-bold text-xs"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Get a daily analysis of major currency market moves, central bank rate decisions, and interbank exchange rate summaries directly in your inbox.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#0071eb]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Frequency</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFrequency('daily')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      frequency === 'daily'
                        ? 'bg-blue-50 border-[#0071eb] text-[#0071eb]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Daily Morning Digest
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('weekly')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                      frequency === 'weekly'
                        ? 'bg-blue-50 border-[#0071eb] text-[#0071eb]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Weekly Roundup
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0071eb] hover:bg-[#005ec4] text-white font-bold rounded-xl text-sm transition-all shadow-xs"
              >
                Subscribe to Updates
              </button>

              <div className="flex items-center gap-1.5 justify-center text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Zero spam. Unsubscribe in 1 click at any time.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
