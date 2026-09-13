import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroConverter } from './components/HeroConverter';
import { SendOnlinePromo } from './components/SendOnlinePromo';
import { LiveRatesTable } from './components/LiveRatesTable';
import { HowToSendMoney } from './components/HowToSendMoney';
import { XeTools } from './components/XeTools';
import { XeApiSection } from './components/XeApiSection';
import { ReviewsAndBusiness } from './components/ReviewsAndBusiness';
import { DestinationsGrid } from './components/DestinationsGrid';
import { Footer } from './components/Footer';

// Modals
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { IbanModal } from './components/IbanModal';
import { NewsletterModal } from './components/NewsletterModal';
import { AuthModal } from './components/AuthModal';
import { HelpModal } from './components/HelpModal';
import { BackgroundNotificationManager } from './components/BackgroundNotificationManager';
import { ShareModal, ShareDataPayload } from './components/ShareModal';

export default function App() {
  const [activeSegment, setActiveSegment] = useState<'Personal' | 'Business' | 'Platform'>('Personal');
  const [converterTab, setConverterTab] = useState<'convert' | 'send' | 'charts' | 'alerts'>('convert');
  const [selectedFromCode, setSelectedFromCode] = useState('USD');
  const [selectedToCode, setSelectedToCode] = useState('EUR');

  // Modals state
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [ibanModalOpen, setIbanModalOpen] = useState(false);
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState<ShareDataPayload | null>(null);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('xe_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleUserLogin = (user: { name: string; email: string }) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('xe_active_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUserLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('xe_active_user');
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenShare = (payload?: ShareDataPayload) => {
    setShareData(payload || null);
    setShareModalOpen(true);
  };

  // Scroll helper
  const scrollToTopAndSetTab = (tab: 'convert' | 'send' | 'charts' | 'alerts', from?: string, to?: string) => {
    setConverterTab(tab);
    if (from) setSelectedFromCode(from);
    if (to) setSelectedToCode(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTool = (tool: 'transfers' | 'alerts' | 'history' | 'iban' | 'newsletter') => {
    switch (tool) {
      case 'transfers':
        scrollToTopAndSetTab('send');
        break;
      case 'alerts':
        scrollToTopAndSetTab('alerts');
        break;
      case 'history':
        scrollToTopAndSetTab('charts');
        break;
      case 'iban':
        setIbanModalOpen(true);
        break;
      case 'newsletter':
        setNewsletterModalOpen(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased selection:bg-[#0071eb] selection:text-white">
      {/* Top Navigation Header */}
      <Header
        activeSegment={activeSegment}
        setActiveSegment={(seg) => {
          setActiveSegment(seg);
          if (seg === 'Business') {
            const el = document.getElementById('business-payments-btn');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onOpenDriveModal={() => setDriveModalOpen(true)}
        onOpenHelp={() => setHelpModalOpen(true)}
        onOpenShareModal={() => handleOpenShare()}
        currentUser={currentUser}
        onLogout={handleUserLogout}
      />

      {/* Main Hero & Interactive Converter */}
      <main className="flex-1">
        <HeroConverter
          activeTab={converterTab}
          onTabChange={setConverterTab}
          selectedFromCode={selectedFromCode}
          selectedToCode={selectedToCode}
          onOpenDriveModal={() => setDriveModalOpen(true)}
          onOpenShareModal={handleOpenShare}
        />

        {/* Send Money Online Feature Section */}
        <SendOnlinePromo
          onSendMoney={() => scrollToTopAndSetTab('send')}
          onCompareRates={() => {
            const el = document.getElementById('live-rates-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Live Exchange Rates Table */}
        <LiveRatesTable
          onSendCurrency={(fromCode, toCode) => {
            scrollToTopAndSetTab('send', fromCode, toCode);
          }}
        />

        {/* 6-step Guide: How to send money online with Xe */}
        <HowToSendMoney
          onStartTransfer={() => scrollToTopAndSetTab('send')}
        />

        {/* Xe Currency Tools & Mobile App Promo */}
        <XeTools
          onOpenTool={handleOpenTool}
        />

        {/* Xe Currency Data API & Trusted by */}
        <XeApiSection />

        {/* Customer Reviews, Trustpilot Ratings & Xe for Business */}
        <ReviewsAndBusiness
          onBusinessClick={() => {
            setActiveSegment('Business');
            scrollToTopAndSetTab('send');
          }}
        />

        {/* Send money destinations & Connecting the world */}
        <DestinationsGrid
          onSelectDestination={(destCurrency) => {
            scrollToTopAndSetTab('send', 'USD', destCurrency);
          }}
          onGetStarted={() => scrollToTopAndSetTab('send')}
          onDownloadApp={() => {
            const el = document.getElementById('xe-app-download-btn');
            if (el) el.click();
          }}
        />
      </main>

      {/* Comprehensive Footer */}
      <Footer
        onNavClick={(link) => {
          if (link.includes('Converter')) {
            scrollToTopAndSetTab('convert');
          } else if (link.includes('Send') || link.includes('Transfer')) {
            scrollToTopAndSetTab('send');
          } else if (link.includes('Charts') || link.includes('Historical')) {
            scrollToTopAndSetTab('charts');
          } else if (link.includes('Alerts')) {
            scrollToTopAndSetTab('alerts');
          } else if (link.includes('IBAN')) {
            setIbanModalOpen(true);
          } else if (link.includes('Newsletters') || link.includes('email')) {
            setNewsletterModalOpen(true);
          } else if (link.includes('Help') || link.includes('support')) {
            setHelpModalOpen(true);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenShare={() => handleOpenShare()}
      />

      {/* Global Interactive Modals */}
      <GoogleDriveModal
        isOpen={driveModalOpen}
        onClose={() => setDriveModalOpen(false)}
      />

      <IbanModal
        isOpen={ibanModalOpen}
        onClose={() => setIbanModalOpen(false)}
      />

      <NewsletterModal
        isOpen={newsletterModalOpen}
        onClose={() => setNewsletterModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          handleUserLogin(user);
        }}
      />

      <HelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />

      {/* Social Media & Multi-Platform Sharing Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        data={shareData}
      />

      {/* Mobile Background Active & Real-time Notification Controller */}
      <BackgroundNotificationManager />
    </div>
  );
}
