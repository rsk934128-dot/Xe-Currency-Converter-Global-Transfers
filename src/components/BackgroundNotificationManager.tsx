import React, { useState } from 'react';
import {
  Wifi,
  WifiOff,
  Bell,
  BellOff,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Play,
  Moon,
  Sun,
  Radio,
  Download,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useBackgroundActive } from '../hooks/useBackgroundActive';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const BackgroundNotificationManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    isOnline,
    permission,
    backgroundAlerts,
    wakeLockActive,
    lastSyncTime,
    testCountdown,
    toggleBackgroundAlerts,
    requestNotificationPermission,
    toggleWakeLock,
    sendInstantTestNotification,
    scheduleMinimizedTestNotification,
  } = useBackgroundActive();

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleEnableNotifications = async () => {
    const res = await requestNotificationPermission();
    if (res === 'granted') {
      showToast('✅ নোটিফিকেশন সফলভাবে সক্রিয় হয়েছে!');
    } else {
      showToast('⚠️ ব্রাউজার সেটিংসে নোটিফিকেশন অনুমোদন প্রয়োজন।');
    }
  };

  const handleTestInstant = async () => {
    if (permission !== 'granted') {
      await handleEnableNotifications();
    }
    const sent = await sendInstantTestNotification();
    if (sent) {
      showToast('🔔 আপনার ডিভাইসে টেস্ট নোটিফিকেশন পাঠানো হয়েছে!');
    }
  };

  const handleTestMinimized = () => {
    if (permission !== 'granted') {
      handleEnableNotifications();
    }
    scheduleMinimizedTestNotification(5);
    showToast('⏱️ ৫ সেকেন্ড কাউন্টডাউন শুরু হয়েছে! অ্যাপ মিনিমাইজ করুন।');
  };

  return (
    <>
      {/* Floating Status Pill (Fixed at bottom right or bottom bar) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          id="pwa-background-status-btn"
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs font-semibold shadow-xl backdrop-blur-md border transition-all transform hover:scale-105 active:scale-95 ${
            isOnline
              ? 'bg-slate-900/90 hover:bg-slate-900 text-white border-slate-700/60'
              : 'bg-amber-600/95 text-white border-amber-500 animate-pulse'
          }`}
          title="মোবাইল ব্যাকগ্রাউন্ড একটিভ ও নোটিফিকেশন কন্ট্রোল"
        >
          {/* Pulsing indicator */}
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isOnline ? 'bg-emerald-400' : 'bg-red-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isOnline ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />
          </span>

          <span className="flex items-center gap-1.5">
            {isOnline ? (
              <>
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">ব্যাকগ্রাউন্ড সক্রিয়</span>
                <span className="sm:hidden">সক্রিয়</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-200" />
                <span>অফলাইন মোড</span>
              </>
            )}
          </span>

          <span className="w-px h-3.5 bg-slate-600" />

          <span className="flex items-center gap-1 text-slate-300 hover:text-white">
            <Bell className={`w-3.5 h-3.5 ${permission === 'granted' ? 'text-blue-400' : 'text-slate-400'}`} />
            {testCountdown !== null ? (
              <span className="text-amber-400 font-bold">{testCountdown}s</span>
            ) : null}
          </span>
        </button>
      </div>

      {/* Temporary Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Background Active & Real-time Notification Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#0a146e] px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg leading-tight">
                    মোবাইল ব্যাকগ্রাউন্ড ও নোটিফিকেশন
                  </h3>
                  <p className="text-xs text-blue-200">সার্বক্ষণিক সক্রিয় সংযোগ ও পুশ অ্যালার্ট</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Status Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isOnline ? (
                      <Wifi className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-rose-500" />
                    )}
                    <span className="text-sm font-semibold text-slate-800">
                      ইন্টারনেট সংযোগ স্ট্যাটাস:
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      isOnline
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-rose-100 text-rose-700 border border-rose-300'
                    }`}
                  >
                    {isOnline ? '🟢 সংযুক্ত (Online Active)' : '🔴 বিচ্ছিন্ন (Offline)'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200">
                  <span>সর্বশেষ লাইভ ডাটা সিঙ্ক:</span>
                  <span className="font-mono text-slate-700">
                    {lastSyncTime ? lastSyncTime.toLocaleTimeString() : 'এইমাত্র'}
                  </span>
                </div>
              </div>

              {/* Minimized Background Feature Explanation */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/70 space-y-2">
                <div className="flex items-start gap-2.5">
                  <Smartphone className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      অ্যাপ মিনিমাইজ থাকলেও সার্বক্ষণিক সক্রিয়
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      মোবাইলে অন্য অ্যাপ ব্যবহার করলেও বা স্ক্রিন লক থাকলেও আমাদের সার্ভিস ওয়ার্কার ব্যাকগ্রাউন্ডে এক্সচেঞ্জ রেট পর্যবেক্ষণ করে এবং নোটিফিকেশন প্রদান করে।
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700">
                    ব্যাকগ্রাউন্ড রেট অ্যালার্ট:
                  </span>
                  <button
                    onClick={() => toggleBackgroundAlerts(!backgroundAlerts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      backgroundAlerts ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        backgroundAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Notification Permission Card */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-slate-800">
                      রিয়েল-টাইম সিস্টেম নোটিফিকেশন
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      permission === 'granted'
                        ? 'bg-emerald-100 text-emerald-700'
                        : permission === 'denied'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {permission === 'granted'
                      ? 'অনুমোদিত'
                      : permission === 'denied'
                      ? 'বন্ধ আছে'
                      : 'অনুমতি প্রয়োজন'}
                  </span>
                </div>

                {permission !== 'granted' && (
                  <button
                    onClick={handleEnableNotifications}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    <span>নোটিফিকেশন অনুমতি দিন (Enable)</span>
                  </button>
                )}

                {/* Test Notification Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleTestInstant}
                    className="py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 text-blue-600" />
                    <span>তাত্ক্ষণিক টেস্ট</span>
                  </button>

                  <button
                    onClick={handleTestMinimized}
                    className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>
                      {testCountdown !== null
                        ? `মিনিমাইজ করুন (${testCountdown}s)`
                        : 'মিনিমাইজ টেস্ট (৫ সে.)'}
                    </span>
                  </button>
                </div>
                {testCountdown !== null && (
                  <p className="text-[11px] text-amber-600 font-medium text-center animate-pulse">
                    ⚡ অনুগ্রহ করে এখন অ্যাপটি মিনিমাইজ করুন! {testCountdown} সেকেন্ডের মধ্যে মোবাইলে নোটিফিকেশন আসবে।
                  </p>
                )}
              </div>

              {/* Screen Wake Lock Option */}
              <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      লাইভ মনিটরিংয়ে স্ক্রিন চালু রাখুন (Wake Lock)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      মোবাইল স্ক্রিন স্বয়ংক্রিয় স্লিপ হওয়া রোধ করে
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleWakeLock(!wakeLockActive)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    wakeLockActive ? 'bg-amber-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      wakeLockActive ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Install PWA on Mobile Home Screen */}
              {!isInstalled && (
                <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold">হোমস্ক্রিনে অ্যাপ ইনস্টল করুন</span>
                    </div>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
                      PWA Native
                    </span>
                  </div>

                  {/* App Icon / Logo Preview */}
                  <div className="flex items-center gap-3 p-2.5 bg-slate-800/90 rounded-xl border border-slate-700">
                    <img
                      src="/pwa-192x192.png"
                      alt="Xe App Logo"
                      className="w-12 h-12 rounded-xl shadow-md border border-white/20 shrink-0 object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Xe Currency</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-400/30">
                          লোগো ভেরিফাইড
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        ব্রাউজার ট্যাব ও মোবাইলে ইনস্টল করলে এই অফিসিয়াল লোগো আইকনটি প্রদর্শিত হবে।
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    মোবাইলে ইনস্টল করলে ব্যাকগ্রাউন্ড সার্ভিস ও পুশ নোটিফিকেশন সর্বাধিক দক্ষতার সাথে সক্রিয় থাকে।
                  </p>

                  {isInstallable && (
                    <button
                      onClick={install}
                      className="w-full mt-1 py-2 px-3 rounded-lg bg-[#0071eb] hover:bg-[#005ec4] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>অ্যাপ ইনস্টল করুন (Install App)</span>
                    </button>
                  )}

                  {isIOS && (
                    <button
                      onClick={() => setShowIOSGuide(true)}
                      className="w-full mt-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700"
                    >
                      <span>iPhone / iPad এ যেভাবে ইনস্টল করবেন</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">
              iPhone / iPad-এ হোমস্ক্রিনে যোগ করুন
            </h3>
            <div className="mt-3 text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>১. Safari ব্রাউজারের নিচের <strong>Share (শেয়ার)</strong> বাটনে ট্যাপ করুন।</p>
              <p>২. অপশনগুলো স্ক্রল করে <strong>'Add to Home Screen' (হোম স্ক্রিনে যোগ করুন)</strong> বাছাই করুন।</p>
              <p>৩. এরপর উপরে ডানে <strong>Add</strong> বাটনে ক্লিক করলেই অ্যাপটি আপনার মোবাইলে হোমস্ক্রিন অ্যাপ হিসেবে যুক্ত হয়ে যাবে।</p>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
            >
              বুঝেছি
            </button>
          </div>
        </div>
      )}
    </>
  );
};
