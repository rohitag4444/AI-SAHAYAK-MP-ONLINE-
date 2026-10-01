import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mic,
  Send,
  FileText,
  GraduationCap,
  Building2,
  Zap,
  ClipboardList,
  CreditCard,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileCheck2,
  TrendingUp,
  Volume2,
} from 'lucide-react';
import { MOCK_SERVICES_EXPLORE } from '../data/mockData';

export const HomeView: React.FC = () => {
  const {
    t,
    lang,
    lowInternetMode,
    triggerChatWithPrompt,
    setActiveTab,
    startApplication,
    services,
    setSelectedService,
    applications,
    openStatusExplainer,
    openWhyExplainer,
    openPaymentVerify,
    alerts,
    markAlertRead,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSpeak = () => {
    // Web Speech Recognition if supported, else simulate voice capture
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);
        recognition.onresult = (event: any) => {
          const spoken = event.results[0][0].transcript;
          setInputQuery(spoken);
          setIsListening(false);
          triggerChatWithPrompt(spoken);
        };
        recognition.onerror = () => {
          setIsListening(false);
          // Fallback simulation
          const fallback = lang === 'hi' ? 'मुझे छात्रवृत्ति के लिए आवेदन करना है' : 'I want to apply for a scholarship';
          setInputQuery(fallback);
          triggerChatWithPrompt(fallback);
        };
        recognition.onend = () => setIsListening(false);
        recognition.start();
      } catch {
        setIsListening(false);
        const fallback = lang === 'hi' ? 'मुझे छात्रवृत्ति के लिए आवेदन करना है' : 'I want to apply for a scholarship';
        triggerChatWithPrompt(fallback);
      }
    } else {
      // Voice input simulation for browser environments without speech api
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const sample = lang === 'hi' ? 'मुझे छात्रवृत्ति के लिए आवेदन करना है' : 'I want to apply for a scholarship';
        setInputQuery(sample);
        triggerChatWithPrompt(sample);
      }, 1200);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (inputQuery.trim()) {
      triggerChatWithPrompt(inputQuery.trim());
      setInputQuery('');
    }
  };

  const quickPrompts = [
    { textEn: 'I want to apply for a scholarship', textHi: 'मुझे छात्रवृत्ति के लिए आवेदन करना है' },
    { textEn: 'Why is my application pending?', textHi: 'मेरा आवेदन लंबित क्यों है?' },
    { textEn: 'Electricity is not available in my area', textHi: 'मेरे क्षेत्र में बिजली नहीं आ रही है' },
    { textEn: 'Money debited but payment pending', textHi: 'पैसे कट गए लेकिन स्टेटस पेंडिंग है' },
  ];

  // Quick Action Buttons (Section 3 requirement)
  const quickActions = [
    {
      titleEn: 'Apply for a Service',
      titleHi: 'सेवा के लिए आवेदन करें',
      descEn: 'Step-by-step simple form with AI error check',
      descHi: 'सरल फॉर्म एवं एआई द्वारा गलतियों की जांच',
      icon: <FileText className="w-6 h-6 text-blue-700" />,
      bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      action: () => startApplication('mp-scholarship-postmatric'),
    },
    {
      titleEn: 'Scholarships',
      titleHi: 'छात्रवृत्ति योजनाएं',
      descEn: 'Post-Matric, Medhavi & Gaon Ki Beti',
      descHi: 'पोस्ट-मैट्रिक, मेधावी व गाँव की बेटी योजना',
      icon: <GraduationCap className="w-6 h-6 text-indigo-700" />,
      bg: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      action: () => setActiveTab('more'),
    },
    {
      titleEn: 'Government Schemes',
      titleHi: 'शासकीय योजनाएं',
      descEn: 'Ladli Behna, PM/CM Kisan & Sambal 2.0',
      descHi: 'लाड़ली बहना, किसान कल्याण व संबल योजना',
      icon: <Building2 className="w-6 h-6 text-amber-700" />,
      bg: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
      action: () => setActiveTab('more'),
    },
    {
      titleEn: 'Electricity (Bijli)',
      titleHi: 'बिजली सेवा एवं शिकायत',
      descEn: 'Instant outage detection & 1-click complaint',
      descHi: 'बिजली कटौती जानकारी व तुरंत शिकायत',
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      bg: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      action: () => setActiveTab('utilities'),
    },
    {
      titleEn: 'My Applications',
      titleHi: 'मेरे आवेदन एवं स्थिति',
      descEn: 'Track progress with "Explain Status" & "Why?"',
      descHi: 'आवेदन टाइमलाइन व "क्यों रुका है?" समाधान',
      icon: <ClipboardList className="w-6 h-6 text-emerald-700" />,
      bg: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
      action: () => setActiveTab('applications'),
    },
    {
      titleEn: 'Payment Help',
      titleHi: 'भुगतान सहायता व मिलान',
      descEn: 'Verify pending transactions safely',
      descHi: 'लंबित भुगतान का सुरक्षित सत्यापन',
      icon: <CreditCard className="w-6 h-6 text-purple-700" />,
      bg: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      action: () => openPaymentVerify('MP-2026-11204'),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 pb-24 md:pb-12">
      {/* 1. Large Primary AI Interaction Area (Prompt Section 3 & 29) */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-md bg-white/20 text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold tracking-wider uppercase text-blue-200">
              {t('AI-Powered Citizen Assistance', 'एआई आधारित नागरिक सहायता प्रणाली')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            {t('👋 What do you need help with?', '👋 आपको किस काम में सहायता चाहिए?')}
          </h1>
          <p className="text-blue-100 text-sm sm:text-base mb-6 font-normal">
            {t(
              'Citizens should not have to understand portal menus first. Just tell us what you need in simple words.',
              'पोर्टल के कठिन मेन्यू समझने की आवश्यकता नहीं है। बस अपनी सरल भाषा में बताएं, एआई सहायक मार्गदर्शन करेगा।'
            )}
          </p>

          {/* Large Accessible Input Area */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-2 sm:p-3 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-2 border-white/20"
          >
            <div className="flex-1 flex items-center px-3 py-1">
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder={t(
                  'Tell me your problem… (e.g. I want to apply for a scholarship)',
                  'अपनी समस्या बताएं… (जैसे: मुझे छात्रवृत्ति के लिए आवेदन करना है)'
                )}
                className="w-full text-slate-800 placeholder-slate-400 text-base focus:outline-hidden bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              {/* Speak Button */}
              <button
                type="button"
                onClick={handleSpeak}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title="Speak in Hindi or English"
              >
                <Mic className="w-4 h-4 text-blue-700" />
                <span>{isListening ? t('Listening…', 'सुन रहा हूँ…') : t('🎙 Speak', '🎙 बोलें')}</span>
              </button>

              {/* Type / Send Button */}
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold shadow-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{t('⌨ Type / Ask', 'पूछें')}</span>
              </button>
            </div>
          </form>

          {/* Quick Prompts Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-blue-200 font-semibold">{t('Suggestions:', 'सुझाव:')}</span>
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => triggerChatWithPrompt(lang === 'hi' ? chip.textHi : chip.textEn)}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full border border-white/15 transition-colors font-medium text-left"
              >
                {lang === 'hi' ? chip.textHi : chip.textEn}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Large Simple Quick Actions Grid (Prompt Section 3) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {t('Quick Actions', 'त्वरित मुख्य सेवाएं')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('Direct access to the most frequently used public utilities', 'सर्वाधिक उपयोग की जाने वाली नागरिक सुविधाएं')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <div
              key={idx}
              onClick={action.action}
              className={`p-5 rounded-xl border ${action.bg} cursor-pointer transition-all shadow-2xs hover:shadow-md flex flex-col justify-between group`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl shadow-2xs border border-slate-200/60 group-hover:scale-105 transition-transform">
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-900 transition-colors">
                    {lang === 'hi' ? action.titleHi : action.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'hi' ? action.descHi : action.descEn}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end text-xs font-bold text-slate-700 group-hover:text-blue-700">
                <span>{t('Open', 'खोलें')}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Recent Applications Quick Status Card & Explainer (Prompt Section 11 & 12) */}
      {applications.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-700" />
              <h2 className="text-lg font-bold text-slate-900">
                {t('Recent Application Status', 'हालिया आवेदन की स्थिति')}
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('applications')}
              className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>{t('View All', 'सभी देखें')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 2).map(app => (
              <div
                key={app.id}
                className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">
                      {lang === 'hi' ? app.serviceNameHi : app.serviceName}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-sm bg-slate-200 text-slate-800">
                      ID: {app.id}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        app.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'UNDER_VERIFICATION'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {app.status === 'APPROVED'
                        ? '🟢 ' + t('Approved', 'स्वीकृत')
                        : app.status === 'UNDER_VERIFICATION'
                        ? '🟡 ' + t('Under Verification', 'सत्यापन प्रक्रियाधीन')
                        : '🔴 ' + t('Payment Pending', 'भुगतान प्रतीक्षित')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {t('Submitted on', 'प्रस्तुत दिनांक')}: {app.submittedDate} • {t('Updated', 'अद्यतन')}: {app.lastUpdated}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openStatusExplainer(app)}
                    className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{t('Explain Status', 'स्थिति समझें')}</span>
                  </button>

                  <button
                    onClick={() => openWhyExplainer(app)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors"
                  >
                    <span>{t('Why?', 'क्यों?')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. One Document → Multiple Services Feature (Prompt Section 9) */}
      <section className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-xl border border-blue-200/70 p-5 shadow-2xs">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-blue-600 text-white text-xs font-bold">
                <FileCheck2 className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {t('Services You May Be Eligible to Explore', 'संभावित सेवाएं जिनकी आप जांच कर सकते हैं')}
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {t(
                'Based on documents commonly held by MP students and citizens (Income Certificate, Aadhaar, Domicile, Marksheets). You may be eligible to explore:',
                'आपके उपलब्ध दस्तावेजों (आधार, आय, मूल निवास, अंकसूची) के आधार पर निम्न योजनाओं की पात्रता देखें:'
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {MOCK_SERVICES_EXPLORE.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-2">
                  {lang === 'hi' ? item.titleHi : item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {lang === 'hi' ? item.whyRelevantHi : item.whyRelevant}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => startApplication(item.serviceId)}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-1"
                >
                  <span>{t('Check Official Eligibility', 'आधिकारिक पात्रता जांचें')}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Popular Services (Prompt Section 3 & 5) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {t('Popular Public Services', 'लोकप्रिय नागरिक सेवाएं')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('Official MP Online portals with guided filing assistance', 'म.प्र. ऑनलाइन पोर्टल की प्रमुख सेवाएं')}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('services')}
            className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-1"
          >
            <span>{t('Browse All Services', 'सभी सेवाएं देखें')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.slice(0, 3).map(service => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {service.department}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">
                  {lang === 'hi' ? service.nameHi : service.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                  {lang === 'hi' ? service.descriptionHi : service.description}
                </p>

                <div className="mt-4 bg-slate-50 p-2.5 rounded-lg text-xs space-y-1">
                  <div className="font-semibold text-slate-700">
                    {t('Required Documents:', 'आवश्यक दस्तावेज:')}
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    {(lang === 'hi' ? service.requiredDocsHi : service.requiredDocs).slice(0, 3).join(', ')}...
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{service.officialFee}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1"
                  >
                    {t('Details', 'विवरण')}
                  </button>
                  <button
                    onClick={() => startApplication(service.id)}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    {t('Apply Now', 'आवेदन करें')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. AI Traffic Forecast Demo & Important Alerts (Prompt Section 16 & 21) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Forecast Widget (Section 16) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-700" />
            <h3 className="font-bold text-slate-900 text-base">
              {t('Traffic Forecast (Demo)', 'ट्रैफिक पूर्वानुमान (डेमो)')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {t(
              'Predictions are based on simulated historical traffic patterns in this prototype. Not real MP Online server data.',
              'यह पूर्वानुमान प्रोटोटाइप में अनुकरण पर आधारित है। वास्तविक सर्वर लोड समय-समय पर भिन्न हो सकता है।'
            )}
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-medium text-slate-700">10:00 AM</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                🟢 {t('Normal Traffic', 'सामान्य ट्रैफिक')}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-medium text-slate-700">12:00 PM</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                🟡 {t('High Traffic', 'उच्च ट्रैफिक')}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-medium text-slate-700">02:00 PM</span>
              <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                🔴 {t('Very High (Rush Hour)', 'अत्यधिक रश')}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-medium text-slate-700">05:00 PM</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                🟢 {t('Normal Traffic', 'सामान्य ट्रैफिक')}
              </span>
            </div>
          </div>
        </div>

        {/* Important Alerts (Section 3 & 21) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {t('Important Alerts & Deadlines', 'महत्वपूर्ण सूचनाएं एवं अंतिम तिथियां')}
                </h3>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                {alerts.filter(a => !a.read).length} {t('Active', 'सक्रिय')}
              </span>
            </div>

            <div className="space-y-2">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                    alert.read ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-blue-50/60 border-blue-200 text-slate-900'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{lang === 'hi' ? alert.titleHi : alert.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({alert.date})</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">
                      {lang === 'hi' ? alert.messageHi : alert.message}
                    </p>
                  </div>

                  {!alert.read && (
                    <button
                      onClick={() => markAlertRead(alert.id)}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 shrink-0"
                    >
                      {t('Mark as Read', 'पढ़ा गया')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{t('Government Helpdesk: 181 (Toll-free CM Helpline)', 'हेल्पलाइन: 181 (सीएम हेल्पलाइन निःशुल्क)')}</span>
            <button
              onClick={() => setActiveTab('more')}
              className="text-blue-700 font-bold hover:underline"
            >
              {t('Learn How Guides', 'मार्गदर्शिका वीडियो')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
