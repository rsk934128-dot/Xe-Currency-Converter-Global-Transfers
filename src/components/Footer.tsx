import React from 'react';
import { Share2, QrCode } from 'lucide-react';

interface FooterProps {
  onNavClick: (item: string) => void;
  onOpenShare?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onOpenShare }) => {
  const sections = [
    {
      title: 'Transfer Money',
      links: [
        'Send Money Online',
        'Send Money to India',
        'Send Money to Pakistan',
        'Send Money to Mexico',
        'Send Money to Japan',
        'Send Money to the UK',
        'Send Money to Canada',
        'Send Money to Australia',
        'Send Money to New Zealand',
        'Send Money to Mobile Wallet',
        'Large Money Transfer',
        'Transfer speed',
        'Transfer fees',
        'Security',
        'Report fraud',
        'Trustpilot Reviews'
      ]
    },
    {
      title: 'XE Business',
      links: [
        'Xe Business',
        'Check Send Rates',
        'International Business Payments',
        'Spot Transfers',
        'Same Currency Transfer',
        'Risk Management',
        'Forward Contracts',
        'Limit Orders',
        'Enterprise Resource Planning',
        'Currency Data API',
        'Payments API',
        'Mass Payments',
        'Payment Methods',
        'Business Payroll',
        'User Roles',
        'Affiliate Partner Program'
      ]
    },
    {
      title: 'Apps',
      links: [
        'Money Transfer & Currency Apps',
        'Android Money Transfer App',
        'iOS Money Transfer App'
      ]
    },
    {
      title: 'Tools & Resources',
      links: [
        'Blog',
        'Currency Converter',
        'Currency Charts',
        'Historical Currency Rates',
        'Currency Encyclopedia',
        'Currency Rate Alerts',
        'Currency Newsletters',
        'IBAN Calculator',
        'Invoice generator',
        'Mortgage Calculator',
        'SWIFT/BIC code lookup'
      ]
    },
    {
      title: 'Company Info',
      links: [
        'About Us',
        'Partnerships',
        'Careers',
        'Help Center',
        'Developer Portal',
        'Dedicated support'
      ]
    },
    {
      title: 'Legal',
      links: [
        'Privacy',
        'Cookie Policy',
        'Consent Manager',
        'Legal & Regulatory Information',
        'File a Complaint',
        'Accessibility'
      ]
    }
  ];

  return (
    <footer className="bg-[#0a146e] text-white pt-16 pb-12 border-t border-[#1a2588]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand & Mission Statement */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-12 border-b border-white/10 gap-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-black italic tracking-tighter text-white">xe</span>
            <div className="h-6 w-px bg-white/20 mx-2" />
            <span className="text-xs text-blue-200/90 font-medium max-w-sm leading-tight">
              Leading the world in currency information and global money transfers for 30+ years
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-blue-200">
            <span>Official Licensed Financial Transmitter</span>
            <span>•</span>
            <span>256-Bit SSL Security</span>
            <span>•</span>
            <span>NMLS #920968</span>
          </div>
        </div>

        {/* Multi-column navigation links */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 py-12">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-blue-200">
                {sec.title}
              </h4>
              <ul className="space-y-2 text-xs text-blue-100/70">
                {sec.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <button
                      onClick={() => onNavClick(link)}
                      className="hover:text-white hover:underline transition-colors text-left"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Share & Media Sharing Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">অ্যাপটি বন্ধুদের সাথে শেয়ার করুন</span>
              <span className="text-xs text-blue-200/70">WhatsApp, Facebook, Telegram ও অন্যান্য প্ল্যাটফর্মে এক ক্লিকেই পাঠান</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="footer-share-whatsapp"
              onClick={() => {
                const url = `https://api.whatsapp.com/send?text=${encodeURIComponent('লাইভ কারেন্সি কনভার্ট ও আন্তর্জাতিক মানি ট্রান্সফার অ্যাপ: ' + window.location.href)}`;
                window.open(url, '_blank');
              }}
              title="WhatsApp এ শেয়ার করুন"
              className="px-3 py-1.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366] text-white text-xs font-semibold border border-[#25D366]/40 transition-colors"
            >
              WhatsApp
            </button>
            <button
              id="footer-share-facebook"
              onClick={() => {
                const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                window.open(url, '_blank', 'width=600,height=450');
              }}
              title="Facebook এ শেয়ার করুন"
              className="px-3 py-1.5 rounded-full bg-[#1877F2]/20 hover:bg-[#1877F2] text-white text-xs font-semibold border border-[#1877F2]/40 transition-colors"
            >
              Facebook
            </button>
            <button
              id="footer-share-telegram"
              onClick={() => {
                const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Xe Currency Converter & Money Transfer')}`;
                window.open(url, '_blank');
              }}
              title="Telegram এ শেয়ার করুন"
              className="px-3 py-1.5 rounded-full bg-[#229ED9]/20 hover:bg-[#229ED9] text-white text-xs font-semibold border border-[#229ED9]/40 transition-colors"
            >
              Telegram
            </button>
            <button
              id="footer-share-all-modal"
              onClick={onOpenShare}
              className="px-4 py-1.5 rounded-full bg-white text-[#0a146e] hover:bg-blue-50 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-[#0071eb]" />
              <span>সব প্ল্যাটফর্ম ও কিউআর কোড</span>
            </button>
          </div>
        </div>

        {/* Bottom regulatory note and copyright matching prompt */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-blue-200/70">
          <p>
            NMLS ID#920968. © 1995-2026 Xe Corporation Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavClick('Privacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onNavClick('Terms')} className="hover:text-white transition-colors">
              Terms of Use
            </button>
            <button onClick={() => onNavClick('Security')} className="hover:text-white transition-colors">
              Security
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
