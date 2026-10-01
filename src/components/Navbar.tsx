import React from 'react';
import { useApp, NavTab } from '../context/AppContext';
import {
  Home,
  Bot,
  FileText,
  Grid,
  MoreHorizontal,
  WifiOff,
  Gauge,
  Type,
  Bell,
  Languages,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    lang,
    toggleLang,
    t,
    largeText,
    toggleLargeText,
    lowInternetMode,
    toggleLowInternetMode,
    rushMode,
    toggleRushMode,
    activeTab,
    setActiveTab,
    unreadAlertsCount,
  } = useApp();

  const navItems: { id: NavTab; labelEn: string; labelHi: string; icon: React.ReactNode }[] = [
    { id: 'home', labelEn: 'Home', labelHi: 'होम', icon: <Home className="w-5 h-5" /> },
    { id: 'sahayak', labelEn: 'AI Sahayak', labelHi: 'एआई सहायक', icon: <Bot className="w-5 h-5" /> },
    { id: 'applications', labelEn: 'My Applications', labelHi: 'मेरे आवेदन', icon: <FileText className="w-5 h-5" /> },
    { id: 'services', labelEn: 'Services', labelHi: 'सेवाएं', icon: <Grid className="w-5 h-5" /> },
    { id: 'more', labelEn: 'More', labelHi: 'अन्य सेवाएं', icon: <MoreHorizontal className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        {/* Top Government Disclaimer & Mode Bar */}
        <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-300">
              {t('MP Online Citizen Service Prototype • AI for Public Service', 'म.प्र. ऑनलाइन नागरिक सेवा प्रोटोटाइप • लोक सेवा नवाचार')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Rush Mode Demo Toggle */}
            <button
              onClick={toggleRushMode}
              title="Toggle Rush Hour / High Traffic simulation"
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs transition-colors ${
                rushMode ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{rushMode ? t('🚦 Rush Mode: ON', '🚦 रश मोड: चालू') : t('Traffic Demo', 'ट्रैफिक डेमो')}</span>
            </button>

            {/* Low Internet Mode Toggle */}
            <button
              onClick={toggleLowInternetMode}
              title="Toggle Low Internet / Lightweight Data-Saving Mode"
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-xs transition-colors ${
                lowInternetMode ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>{lowInternetMode ? t('📶 Low Net: ON', '📶 लो नेट: चालू') : t('Low Net Mode', 'लो नेट मोड')}</span>
            </button>

            {/* Font Size Toggle */}
            <button
              onClick={toggleLargeText}
              title="Toggle Large Text for readability"
              className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-semibold"
            >
              <Type className="w-3 h-3" />
              <span>{largeText ? 'A (Normal)' : 'A+ (Large)'}</span>
            </button>
          </div>
        </div>

        {/* Primary Navbar */}
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo & Emblem */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-blue-800 transition-colors">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-blue-950">
                  AI Sahayak
                </span>
                <span className="text-xs px-2 py-0.5 font-semibold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                  MP Online
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                {t('Your simple guide to public services', 'नागरिक सेवाओं के लिए आपका सरल मार्गदर्शक')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{lang === 'hi' ? item.labelHi : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Utilities: Language Switcher & Alert Bell */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-blue-400 bg-white text-slate-700 text-xs font-bold shadow-2xs transition-colors"
              aria-label="Switch Language"
            >
              <Languages className="w-4 h-4 text-blue-600" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setActiveTab('more')}
              className="relative p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadAlertsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Low Internet Active Alert Banner (Section 17) */}
        {lowInternetMode && (
          <div className="bg-emerald-50 border-t border-b border-emerald-200 px-4 py-2 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="font-semibold">
                {t(
                  'Low connectivity detected. Essential services remain available in lightweight mode.',
                  'धीमा इंटरनेट कनेक्शन सक्रिय। आवश्यक सेवाएं हल्के (कम डेटा) मोड में उपलब्ध हैं।'
                )}
              </span>
            </div>
            <button
              onClick={toggleLowInternetMode}
              className="underline text-emerald-800 hover:text-emerald-950 font-bold ml-2"
            >
              {t('Turn Off', 'सामान्य मोड')}
            </button>
          </div>
        )}

        {/* Rush Mode Active Alert Banner (Section 15) */}
        {rushMode && (
          <div className="bg-amber-50 border-t border-b border-amber-300 px-4 py-2.5 text-xs text-amber-950">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🚦</span>
                <div>
                  <span className="font-bold">
                    {t('High Traffic / Rush Mode Active', 'उच्च ट्रैफिक / रश मोड सक्रिय')}
                  </span>
                  <span className="ml-2 text-slate-700">
                    {t(
                      `Token: A-1842 • Approx queue wait: 12–15 mins. Please do not refresh.`,
                      `वर्चुअल टोकन: A-1842 • अनुमानित प्रतीक्षा: 12-15 मिनट। कृपया पेज रीफ्रेश न करें।`
                    )}
                  </span>
                </div>
              </div>
              <button
                onClick={toggleRushMode}
                className="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded text-xs"
              >
                {t('Simulate Normal Traffic', 'सामान्य ट्रैफिक करें')}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Bottom Navigation for Mobile Devices */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        {navItems.map(item => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-xs font-semibold transition-all ${
                active ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-full ${active ? 'bg-blue-50' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">
                {lang === 'hi' ? item.labelHi : item.labelEn}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
