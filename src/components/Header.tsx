import React, { useState } from 'react';
import { Globe, HardDrive, HelpCircle, User, ChevronDown, CheckCircle2, ShieldCheck, ExternalLink, Bell, Radio, Share2 } from 'lucide-react';
import { getGoogleUser, getDriveAccessToken, setDriveAccessToken, setGoogleUser } from '../utils/driveStorage';

interface HeaderProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenDriveModal: () => void;
  onOpenHelp: () => void;
  onOpenBackgroundManager?: () => void;
  onOpenShareModal?: () => void;
  currentUser?: { name: string; email: string } | null;
  onLogout?: () => void;
  activeSegment: 'Personal' | 'Business' | 'Platform';
  setActiveSegment: (seg: 'Personal' | 'Business' | 'Platform') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuth,
  onOpenDriveModal,
  onOpenHelp,
  onOpenBackgroundManager,
  onOpenShareModal,
  currentUser,
  onLogout,
  activeSegment,
  setActiveSegment,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const [selectedCountry, setSelectedCountry] = useState('us');
  const googleUser = getGoogleUser();
  const driveToken = getDriveAccessToken();

  return (
    <header className="w-full bg-[#0a146e] text-white select-none border-b border-[#1b2685]">
      {/* Top tier navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Left Brand + Segment Tabs */}
          <div className="flex items-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              {/* XE Logo Icon + Brand Typography */}
              <img
                src="/pwa-192x192.png"
                alt="Xe Currency Converter Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-md border border-white/20 object-cover"
              />
              <div className="flex items-center tracking-tight">
                <span className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter">xe</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#00d084] ml-1 mb-3 animate-pulse" title="Live Financial Network Active" />
              </div>
            </div>

            {/* Segment Selector: Personal / Business / Platform */}
            <nav className="flex items-center gap-1 sm:gap-2">
              {(['Personal', 'Business', 'Platform'] as const).map((segment) => (
                <button
                  key={segment}
                  id={`nav-segment-${segment.toLowerCase()}`}
                  onClick={() => setActiveSegment(segment)}
                  className={`px-3 py-1.5 text-sm sm:text-base font-semibold rounded-full transition-all ${
                    activeSegment === segment
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {segment}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Controls: Country/Lang, Google Drive indicator, Login, Register, Help */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Background Sync & Real-time Notification Status */}
            <button
              id="header-background-sync-btn"
              onClick={onOpenBackgroundManager || (() => {
                const el = document.getElementById('pwa-background-status-btn');
                if (el) el.click();
              })}
              title="মোবাইল ব্যাকগ্রাউন্ড সক্রিয়তা ও নোটিফিকেশন"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 transition-colors border border-emerald-400/30"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="hidden sm:inline">লাইভ ব্যাকগ্রাউন্ড</span>
              <Bell className="w-3.5 h-3.5 text-emerald-300" />
            </button>

            {/* Google Drive Status Indicator */}
            <button
              id="header-google-drive-btn"
              onClick={onOpenDriveModal}
              title="Google Drive receipts & transfer backup"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-[#172594] hover:bg-[#1f31be] text-blue-100 transition-colors border border-blue-400/20"
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-300" />
              <span>Google Drive</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </button>

            {/* Country & Language selector */}
            <div className="relative">
              <button
                id="header-lang-picker"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs sm:text-sm font-semibold rounded-md hover:bg-white/10 transition-colors"
              >
                <span className="text-sm">🇺🇸</span>
                <span className="uppercase text-white/90">{selectedCountry}</span>
                <span className="text-white/50">|</span>
                <span className="text-white/90">{selectedLang}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/70" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-lg shadow-2xl py-2 z-50 border border-slate-200">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Region & Language
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCountry('us');
                      setSelectedLang('EN');
                      setLangMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between"
                  >
                    <span>🇺🇸 United States (EN)</span>
                    {selectedCountry === 'us' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCountry('gb');
                      setSelectedLang('EN');
                      setLangMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between"
                  >
                    <span>🇬🇧 United Kingdom (EN)</span>
                    {selectedCountry === 'gb' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCountry('ca');
                      setSelectedLang('EN');
                      setLangMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between"
                  >
                    <span>🇨🇦 Canada (EN)</span>
                    {selectedCountry === 'ca' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCountry('eu');
                      setSelectedLang('FR');
                      setLangMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 flex items-center justify-between"
                  >
                    <span>🇪🇺 Europe (FR)</span>
                    {selectedCountry === 'eu' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Help Button */}
            <button
              id="header-help-btn"
              onClick={onOpenHelp}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs sm:text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-white/70" />
              <span className="hidden sm:inline">Help</span>
            </button>

            {/* Share App Button */}
            <button
              id="header-share-btn"
              onClick={onOpenShareModal}
              title="বিভিন্ন মিডিয়া প্ল্যাটফর্মে শেয়ার করুন"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/15 rounded-full transition-colors border border-white/25 shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-300" />
              <span>শেয়ার</span>
            </button>

            {/* User Profile or Login/Register */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-full border border-white/20 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-[#0071eb] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold max-w-[90px] sm:max-w-[120px] truncate text-white">
                    {currentUser.name}
                  </span>
                </div>
                <button
                  id="header-logout-btn"
                  onClick={onLogout}
                  className="text-xs text-white/70 hover:text-white underline px-1 py-1 transition-colors"
                  title="Sign out of Xe account"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button
                  id="header-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 rounded-full transition-all"
                >
                  Login
                </button>
                <button
                  id="header-register-btn"
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 sm:px-5 py-1.5 text-xs sm:text-sm font-bold bg-[#0071eb] hover:bg-[#005ec4] text-white rounded-full transition-all shadow-md active:scale-95"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
