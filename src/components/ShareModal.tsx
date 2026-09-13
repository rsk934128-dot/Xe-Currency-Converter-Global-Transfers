import React, { useState, useEffect, useRef } from 'react';
import {
  Share2,
  X,
  Copy,
  Check,
  QrCode,
  Smartphone,
  Send,
  MessageCircle,
  Mail,
  MessageSquare,
  Globe,
  Download,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import QRCode from 'qrcode';

export interface ShareDataPayload {
  title?: string;
  from?: string;
  to?: string;
  amount?: number;
  converted?: number;
  rate?: number;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: ShareDataPayload | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const [activeTab, setActiveTab] = useState<'social' | 'qr'>('social');
  const [copied, setCopied] = useState(false);
  const [shareMode, setShareMode] = useState<'app' | 'rate'>('rate');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const appUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : 'https://xe.com';

  // Build appropriate share message based on mode and current conversion
  const hasRateData = Boolean(data && data.from && data.to && data.rate);

  const getShareText = () => {
    if (shareMode === 'rate' && hasRateData && data) {
      const formattedAmount = (data.amount || 1).toLocaleString('en-US');
      const formattedConverted = (data.converted || data.rate || 1).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      });
      return `💱 Xe Currency Live Rate:\n${formattedAmount} ${data.from} = ${formattedConverted} ${data.to}\n(1 ${data.from} = ${data.rate?.toFixed(4)} ${data.to})\n\nবিশ্বস্ত ও লাইভ কারেন্সি কনভার্ট করতে এবং দ্রুত মানি ট্রান্সফার করতে ভিজিট করুন:`;
    }
    return `🌐 Xe Currency Converter & Global Money Transfers\nলাইভ এক্সচেঞ্জ রেট, ফ্রি রেট অ্যালার্ট এবং নিরাপদ আন্তর্জাতিক মানি ট্রান্সফার অ্যাপ:`;
  };

  const shareText = getShareText();

  // Draw QR code when switching to QR tab or when open
  useEffect(() => {
    if (isOpen && activeTab === 'qr' && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        appUrl,
        {
          width: 220,
          margin: 2,
          color: {
            dark: '#0a146e',
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [isOpen, activeTab, appUrl]);

  if (!isOpen) return null;

  // Handle Web Share API for Mobile Devices
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Xe Currency Converter & Money Transfers',
          text: shareText,
          url: appUrl
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share dismissed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Copy to clipboard
  const handleCopyLink = () => {
    const fullText = `${shareText}\n${appUrl}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // Download QR code image
  const handleDownloadQr = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'xe-currency-app-qr.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  // Social sharing platforms list
  const platforms = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      banglaName: 'হোয়াটসঅ্যাপ',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      ),
      bg: 'bg-[#25D366] hover:bg-[#1EBE5D] text-white',
      border: 'border-[#25D366]/40',
      action: () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + appUrl)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      banglaName: 'ফেসবুক',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      bg: 'bg-[#1877F2] hover:bg-[#0d65d9] text-white',
      border: 'border-[#1877F2]/40',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'width=600,height=500');
      }
    },
    {
      id: 'messenger',
      name: 'Messenger',
      banglaName: 'মেসেঞ্জার',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.082.3 2.235.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.259 5.889-3.259-6.56 6.963z"/>
        </svg>
      ),
      bg: 'bg-gradient-to-r from-[#00B2FE] via-[#006AFF] to-[#9900FF] text-white',
      border: 'border-blue-400/40',
      action: () => {
        // Direct Messenger share or fallback to FB dialog
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = `fb-messenger://share/?link=${encodeURIComponent(appUrl)}`;
        } else {
          window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(appUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(appUrl)}`, '_blank', 'width=600,height=500');
        }
      }
    },
    {
      id: 'telegram',
      name: 'Telegram',
      banglaName: 'টেলিগ্রাম',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      bg: 'bg-[#229ED9] hover:bg-[#1c8ec4] text-white',
      border: 'border-[#229ED9]/40',
      action: () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      banglaName: 'এক্স (টুইটার)',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      bg: 'bg-black hover:bg-neutral-800 text-white',
      border: 'border-slate-800',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`;
        window.open(url, '_blank', 'width=600,height=450');
      }
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      banglaName: 'লিঙ্কডইন',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      bg: 'bg-[#0A66C2] hover:bg-[#095196] text-white',
      border: 'border-[#0A66C2]/40',
      action: () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}`;
        window.open(url, '_blank', 'width=600,height=500');
      }
    },
    {
      id: 'email',
      name: 'Email',
      banglaName: 'ইমেইল',
      icon: <Mail className="w-5 h-5 text-white" />,
      bg: 'bg-slate-700 hover:bg-slate-800 text-white',
      border: 'border-slate-600',
      action: () => {
        const subject = encodeURIComponent(
          data?.from && data?.to ? `Xe Live Rate: 1 ${data.from} = ${data.rate} ${data.to}` : 'Xe Currency Converter & Transfers'
        );
        const body = encodeURIComponent(`${shareText}\n\n${appUrl}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      }
    },
    {
      id: 'sms',
      name: 'SMS / Text',
      banglaName: 'এসএমএস',
      icon: <MessageSquare className="w-5 h-5 text-white" />,
      bg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      border: 'border-emerald-500/40',
      action: () => {
        const body = encodeURIComponent(`${shareText} ${appUrl}`);
        window.location.href = `sms:?&body=${body}`;
      }
    }
  ];

  const supportsNativeShare = typeof navigator !== 'undefined' && Boolean(navigator.share);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="share-modal-container"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0a146e] to-[#12249e] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Share2 className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                বিভিন্ন প্ল্যাটফর্মে শেয়ার করুন
              </h2>
              <p className="text-xs text-blue-200/80">
                সোশ্যাল মিডিয়া, মেসেঞ্জার ও কিউআর কোডের মাধ্যমে বন্ধুদের পাঠান
              </p>
            </div>
          </div>

          <button
            id="share-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Platforms vs QR Code */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            id="share-tab-social"
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'social'
                ? 'border-[#0071eb] text-[#0071eb] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>মিডিয়া ও মেসেঞ্জার</span>
          </button>
          <button
            id="share-tab-qr"
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'qr'
                ? 'border-[#0071eb] text-[#0071eb] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>মোবাইল কিউআর কোড (QR)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Rate / App Mode Toggle if Rate data exists */}
          {hasRateData && data && (
            <div className="mb-5 p-3 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-slate-800">কী শেয়ার করতে চান?</span>
                <p className="text-[11px] text-slate-500">
                  {shareMode === 'rate'
                    ? `${data.from} ➔ ${data.to} লাইভ ক্যালকুলেশন রেট সহ`
                    : 'সাধারণ অ্যাপ হোমপেজ লিংক'}
                </p>
              </div>

              <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-xs border border-slate-200">
                <button
                  onClick={() => setShareMode('rate')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    shareMode === 'rate'
                      ? 'bg-[#0071eb] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  লাইভ রেট
                </button>
                <button
                  onClick={() => setShareMode('app')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    shareMode === 'app'
                      ? 'bg-[#0071eb] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  শুধু অ্যাপ
                </button>
              </div>
            </div>
          )}

          {activeTab === 'social' ? (
            <div className="space-y-5">
              {/* Native Share Sheet (Highlight for Mobile) */}
              {supportsNativeShare && (
                <button
                  id="share-native-mobile-btn"
                  onClick={handleNativeShare}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#0071eb] to-[#005ec4] hover:from-[#005ec4] hover:to-[#004899] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2.5 transition-transform active:scale-98"
                >
                  <Smartphone className="w-4 h-4 text-white" />
                  <span>মোবাইলের সব অ্যাপে শেয়ার করুন (Share Sheet)</span>
                </button>
              )}

              {/* Social Media Platforms Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  পছন্দের মিডিয়া প্ল্যাটফর্ম বেছে নিন
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      id={`share-btn-${p.id}`}
                      onClick={p.action}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border ${p.border} ${p.bg} transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-95 group`}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                        {p.icon}
                      </div>
                      <span className="text-xs font-bold tracking-tight">{p.name}</span>
                      <span className="text-[10px] opacity-90">{p.banglaName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview of the shared text */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    মেসেজ প্রিভিউ
                  </span>
                  <span className="text-[11px] text-slate-400">অটো-জেনারেটেড</span>
                </div>
                <p className="text-xs text-slate-600 font-mono whitespace-pre-line line-clamp-3 bg-white p-2.5 rounded-xl border border-slate-100">
                  {shareText}
                </p>
              </div>

              {/* One-click Copy Link */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  ওয়েবসাইট লিংক কপি করুন
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 truncate font-mono select-all">
                    {appUrl}
                  </div>
                  <button
                    id="share-copy-link-btn"
                    onClick={handleCopyLink}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#0a146e] hover:bg-[#12249e] text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* QR Code Scan View */
            <div className="flex flex-col items-center text-center space-y-4 py-2">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-md inline-block relative">
                <canvas ref={canvasRef} className="rounded-lg" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#0a146e] border-2 border-white flex items-center justify-center shadow-lg">
                  <span className="text-xs font-black text-white italic">xe</span>
                </div>
              </div>

              <div className="space-y-1 max-w-sm">
                <h4 className="text-sm font-bold text-slate-900">
                  মোবাইল ক্যামেরা দিয়ে স্ক্যান করুন
                </h4>
                <p className="text-xs text-slate-500">
                  যেকোনো স্মার্টফোনের ক্যামেরা বা গুগল লেন্স দিয়ে স্ক্যান করলেই সরাসরি অ্যাপটি আপনার মোবাইলে ওপেন হবে এবং হোমস্ক্রিনে ইনস্টল করার সুবিধা পাবেন।
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  id="share-download-qr-btn"
                  onClick={handleDownloadQr}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>কিউআর কোড ডাউনলোড</span>
                </button>

                <button
                  id="share-copy-qr-link-btn"
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'লিংক কপি হয়েছে!' : 'লিংক কপি'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>বিশ্বের যে কারো সাথে মুহূর্তে শেয়ার করুন</span>
          </div>
          <button
            onClick={onClose}
            className="font-semibold text-slate-700 hover:text-slate-900"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
