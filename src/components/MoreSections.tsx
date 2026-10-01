import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Building2,
  Video,
  HelpCircle,
  Bell,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  Clock,
  Send,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  MOCK_SCHOLARSHIPS,
  MOCK_GOVERNMENT_SCHEMES,
  MOCK_VIDEO_GUIDES,
} from '../data/mockData';
import { ScholarshipItem, GovernmentSchemeItem, VideoGuideItem } from '../types';

export const MoreSections: React.FC = () => {
  const {
    t,
    lang,
    startApplication,
    triggerChatWithPrompt,
    alerts,
    markAlertRead,
    grievances,
    addGrievance,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'scholarships' | 'schemes' | 'videos' | 'grievance' | 'alerts'>('scholarships');

  // Explainer modals / popups
  const [selectedScholarshipExplainer, setSelectedScholarshipExplainer] = useState<ScholarshipItem | null>(null);
  const [selectedSchemeExplainer, setSelectedSchemeExplainer] = useState<GovernmentSchemeItem | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<VideoGuideItem | null>(null);

  // Grievance Form State
  const [grvCategory, setGrvCategory] = useState('Application');
  const [grvSubject, setGrvSubject] = useState('');
  const [grvDescription, setGrvDescription] = useState('');
  const [grvSuccessId, setGrvSuccessId] = useState<string | null>(null);

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grvSubject.trim() || !grvDescription.trim()) return;

    const newTicketId = 'GRV-2026-' + Math.floor(1000 + Math.random() * 9000);
    addGrievance({
      id: newTicketId,
      category: grvCategory,
      subject: grvSubject.trim(),
      description: grvDescription.trim(),
      status: 'Registered',
      createdAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resolutionNote: 'Forwarded to Departmental Grievance Officer.',
    });

    setGrvSuccessId(newTicketId);
    setGrvSubject('');
    setGrvDescription('');
  };

  const tabs = [
    { id: 'scholarships', labelEn: 'Scholarships', labelHi: 'छात्रवृत्तियां', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'schemes', labelEn: 'Govt Schemes', labelHi: 'शासकीय योजनाएं', icon: <Building2 className="w-4 h-4" /> },
    { id: 'videos', labelEn: 'Learn How Guides', labelHi: 'वीडियो व मार्गदर्शिका', icon: <Video className="w-4 h-4" /> },
    { id: 'grievance', labelEn: 'Help / Grievance (181)', labelHi: 'सीएम हेल्पलाइन (181)', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'alerts', labelEn: 'Alerts', labelHi: 'सूचनाएं', icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12">
      {/* Sub-navigation bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
              activeSubTab === tab.id
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{lang === 'hi' ? tab.labelHi : tab.labelEn}</span>
          </button>
        ))}
      </div>

      {/* 1. SCHOLARSHIPS (Prompt Section 19) */}
      {activeSubTab === 'scholarships' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {t('MP Scholarship Schemes', 'मध्य प्रदेश छात्रवृत्ति योजनाएं')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('Official financial support for school and college students', 'स्कूल एवं कॉलेज के विद्यार्थियों हेतु छात्रवृत्ति सहायता')}
              </p>
            </div>
            <button
              onClick={() => triggerChatWithPrompt(lang === 'hi' ? 'मुझे कौन सी छात्रवृत्ति मिल सकती है?' : 'Which scholarships can I apply for?')}
              className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 self-start"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              <span>{t('Ask AI: "Which scholarship is for me?"', 'एआई से पूछें: "मेरे लिए कौन सी सही है?"')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {MOCK_SCHOLARSHIPS.map(sch => (
              <div
                key={sch.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    {lang === 'hi' ? sch.providerHi : sch.provider}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">
                    {lang === 'hi' ? sch.titleHi : sch.title}
                  </h3>
                  <div className="text-xs font-bold text-emerald-700 mt-1 bg-emerald-50 p-2 rounded-lg">
                    {sch.amount}
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5 mt-3">
                    <div>
                      <span className="font-bold text-slate-700">{t('Eligibility: ', 'पात्रता: ')}</span>
                      {lang === 'hi' ? sch.eligibilitySummaryHi : sch.eligibilitySummary}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">{t('Deadline: ', 'अंतिम तिथि: ')}</span>
                      <span className="text-red-700 font-semibold">{sch.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedScholarshipExplainer(sch)}
                    className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                    <span>{t('Explain this scholarship in simple words', 'इस छात्रवृत्ति को सरल शब्दों में समझें')}</span>
                  </button>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => setSelectedScholarshipExplainer(sch)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      {t('Check Eligibility', 'पात्रता जांचें')}
                    </button>
                    <button
                      onClick={() => startApplication(sch.serviceId || 'mp-scholarship-postmatric')}
                      className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      {t('Apply', 'आवेदन करें')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. GOVERNMENT SCHEMES (Prompt Section 20) */}
      {activeSubTab === 'schemes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {t('MP Government Welfare Schemes', 'मध्य प्रदेश जन कल्याण योजनाएं')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('Financial, women, farmer, and social security programs', 'महिला, किसान, श्रमिक एवं सामाजिक सुरक्षा कार्यक्रम')}
              </p>
            </div>
            <button
              onClick={() => triggerChatWithPrompt(lang === 'hi' ? 'मैं कौन सी योजनाओं की जांच कर सकता हूँ?' : 'Which schemes can I explore?')}
              className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-blue-100 self-start"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              <span>{t('Ask AI: "Which schemes can I explore?"', 'एआई से पूछें: "योजनाएं खोजें"')}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {MOCK_GOVERNMENT_SCHEMES.map(scheme => (
              <div
                key={scheme.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {lang === 'hi' ? scheme.categoryHi : scheme.category} • {scheme.department}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-2">
                    {lang === 'hi' ? scheme.titleHi : scheme.title}
                  </h3>
                  <div className="text-xs font-bold text-emerald-800 mt-2 bg-emerald-50 p-2 rounded-lg">
                    {lang === 'hi' ? scheme.benefitSummaryHi : scheme.benefitSummary}
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5 mt-3">
                    <div>
                      <span className="font-bold text-slate-700">{t('Eligibility: ', 'पात्रता: ')}</span>
                      {lang === 'hi' ? scheme.eligibilityHi : scheme.eligibility}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">{t('Required Documents: ', 'दस्तावेज: ')}</span>
                      {scheme.requiredDocs.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedSchemeExplainer(scheme)}
                    className="text-xs font-bold text-blue-700 hover:underline"
                  >
                    {t('Check Official Eligibility', 'आधिकारिक पात्रता जांचें')}
                  </button>

                  <button
                    onClick={() => startApplication(scheme.serviceId || 'mp-ladli-behna')}
                    className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    {t('Explore / Apply', 'योजना देखें')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. INFORMATIONAL VIDEOS ("Learn How") (Prompt Section 22) */}
      {activeSubTab === 'videos' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {t('Learn How — Step-by-Step Video Walkthroughs', 'मार्गदर्शिका वीडियो — कैसे करें')}
            </h2>
            <p className="text-xs text-slate-500">
              {t(
                'Visual, easy-to-follow demonstrations for first-time digital users and rural citizens.',
                'ग्रामीण एवं नए डिजिटल उपयोगकर्ताओं के लिए सरल सचित्र वीडियो मार्गदर्शन।'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MOCK_VIDEO_GUIDES.map(v => (
              <div
                key={v.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between"
              >
                {/* Visual Video Thumbnail Placeholder */}
                <div
                  className={`bg-gradient-to-r ${v.thumbnailColor} p-6 text-white flex items-center justify-between relative cursor-pointer group`}
                  onClick={() => setActiveVideoModal(v)}
                >
                  <div>
                    <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded font-mono font-bold">
                      {v.duration}
                    </span>
                    <h3 className="font-bold text-base mt-2 pr-4">
                      {lang === 'hi' ? v.titleHi : v.title}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 group-hover:bg-white/30 backdrop-blur-xs flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-600">
                    {lang === 'hi' ? v.descriptionHi : v.description}
                  </p>

                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg text-xs">
                    <span className="font-bold text-slate-700">{t('Key Walkthrough Steps:', 'प्रमुख चरण:')}</span>
                    <ol className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px]">
                      {(lang === 'hi' ? v.stepsHi : v.steps).slice(0, 3).map((st, idx) => (
                        <li key={idx} className="line-clamp-1">{st}</li>
                      ))}
                    </ol>
                  </div>

                  <button
                    onClick={() => setActiveVideoModal(v)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-blue-700" />
                    <span>{t('Watch Video Walkthrough', 'वीडियो देखें')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. GRIEVANCE / HELP (CM HELPLINE 181) (Prompt Section 23) */}
      {activeSubTab === 'grievance' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {t('Register Grievance / Complaint (CM Helpline 181)', 'शिकायत दर्ज करें (सीएम हेल्पलाइन 181)')}
              </h2>
              <p className="text-xs text-slate-500">
                {t(
                  'Facing an issue with your application, payment, or local service? Report it directly.',
                  'आवेदन, भुगतान अथवा शासकीय कार्य में आ रही समस्या की सीधी शिकायत दर्ज करें।'
                )}
              </p>
            </div>

            {grvSuccessId && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1 text-xs">
                <span className="font-bold text-emerald-900">
                  ✓ {t('Grievance Registered Successfully!', 'शिकायत सफलतापूर्वक दर्ज!')}
                </span>
                <p className="text-emerald-800">
                  {t('Complaint Reference ID:', 'शिकायत संदर्भ क्रमांक:')}{' '}
                  <strong className="font-mono text-sm text-slate-900">{grvSuccessId}</strong>
                </p>
                <p className="text-slate-500 text-[10px]">
                  {t(
                    '* Labeled as prototype/demo complaint in this hackathon version.',
                    '* प्रोटोटाइप/डेमो संदर्भ क्रमांक।'
                  )}
                </p>
              </div>
            )}

            <form onSubmit={handleGrievanceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('What type of problem are you facing? *', 'समस्या का प्रकार क्या है? *')}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {['Application', 'Payment', 'Document', 'Login', 'Service', 'Other'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setGrvCategory(cat)}
                      className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                        grvCategory === cat
                          ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                          : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('Brief Subject / Application ID *', 'संक्षिप्त विषय / संबंधित आवेदन क्रमांक *')}
                </label>
                <input
                  type="text"
                  value={grvSubject}
                  onChange={e => setGrvSubject(e.target.value)}
                  placeholder={t('e.g. Payment deducted but scholarship portal shows pending', 'जैसे: पैसे कट गए किंतु पोर्टल पर पेंडिंग दिख रहा है')}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('Describe the Issue in Detail *', 'समस्या का विस्तृत विवरण *')}
                </label>
                <textarea
                  rows={4}
                  value={grvDescription}
                  onChange={e => setGrvDescription(e.target.value)}
                  placeholder={t('Enter details to help the nodal grievance officer resolve your issue quickly…', 'समस्या का स्पष्ट विवरण लिखें…')}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('Submit Grievance', 'शिकायत दर्ज करें')}</span>
              </button>
            </form>
          </div>

          {/* Grievances Track List */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              {t('Registered Complaints & Tickets', 'पंजीकृत शिकायतें')}
            </h3>

            <div className="space-y-3">
              {grievances.map(ticket => (
                <div key={ticket.id} className="bg-white border border-slate-200 p-3 rounded-lg text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-900">{ticket.id}</span>
                    <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
                      {ticket.status}
                    </span>
                  </div>
                  <div className="font-bold text-slate-800">{ticket.subject}</div>
                  <p className="text-slate-500 text-[11px]">{ticket.description}</p>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    {ticket.createdAt} • {ticket.resolutionNote}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. PERSONALIZED ALERTS (Prompt Section 21) */}
      {activeSubTab === 'alerts' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {t('Personalized Citizen Alerts', 'व्यक्तिगत नागरिक सूचनाएं')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('Important updates on your documents, deadlines, and application status.', 'आपके दस्तावेजों, अंतिम तिथियों और आवेदनों से जुड़े महत्वपूर्ण संदेश।')}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {alerts.map(a => (
              <div
                key={a.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 text-xs ${
                  a.read ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-blue-50/70 border-blue-200 text-slate-900 shadow-2xs'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {lang === 'hi' ? a.titleHi : a.title}
                    </span>
                    <span className="text-[10px] text-slate-400">({a.date})</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {lang === 'hi' ? a.messageHi : a.message}
                  </p>
                </div>

                {!a.read && (
                  <button
                    onClick={() => markAlertRead(a.id)}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 shrink-0"
                  >
                    {t('Mark as Read', 'पढ़ा गया')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scholarship Explainer Modal */}
      {selectedScholarshipExplainer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">
              {lang === 'hi' ? selectedScholarshipExplainer.titleHi : selectedScholarshipExplainer.title}
            </h3>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 leading-relaxed">
              <span className="font-bold block mb-1">🤖 AI Sahayak Explanation:</span>
              {lang === 'hi' ? selectedScholarshipExplainer.explanationHi : selectedScholarshipExplainer.explanation}
            </div>
            <div className="text-xs space-y-1 text-slate-700">
              <div>
                <strong>{t('Eligibility: ', 'पात्रता: ')}</strong>
                {lang === 'hi' ? selectedScholarshipExplainer.eligibilitySummaryHi : selectedScholarshipExplainer.eligibilitySummary}
              </div>
              <div>
                <strong>{t('Required Documents: ', 'दस्तावेज: ')}</strong>
                {selectedScholarshipExplainer.requiredDocs.join(', ')}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedScholarshipExplainer(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                {t('Close', 'बंद करें')}
              </button>
              <button
                onClick={() => {
                  const sId = selectedScholarshipExplainer.serviceId || 'mp-scholarship-postmatric';
                  setSelectedScholarshipExplainer(null);
                  startApplication(sId);
                }}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold"
              >
                {t('Apply Now', 'आवेदन करें')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scheme Explainer Modal */}
      {selectedSchemeExplainer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">
              {lang === 'hi' ? selectedSchemeExplainer.titleHi : selectedSchemeExplainer.title}
            </h3>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 leading-relaxed">
              <span className="font-bold block mb-1">🏛 Scheme Overview & Purpose:</span>
              {lang === 'hi' ? selectedSchemeExplainer.explanationHi : selectedSchemeExplainer.explanation}
            </div>
            <div className="text-xs space-y-1 text-slate-700">
              <div>
                <strong>{t('Official Department: ', 'शासकीय विभाग: ')}</strong>
                {selectedSchemeExplainer.department}
              </div>
              <div>
                <strong>{t('Eligibility Criteria: ', 'पात्रता नियम: ')}</strong>
                {lang === 'hi' ? selectedSchemeExplainer.eligibilityHi : selectedSchemeExplainer.eligibility}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedSchemeExplainer(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                {t('Close', 'बंद करें')}
              </button>
              <button
                onClick={() => {
                  const sId = selectedSchemeExplainer.serviceId || 'mp-ladli-behna';
                  setSelectedSchemeExplainer(null);
                  startApplication(sId);
                }}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold"
              >
                {t('Apply / Register', 'आवेदन करें')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Walkthrough Player Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {t('Citizen Video Guide', 'नागरिक वीडियो मार्गदर्शिका')}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">
                  {lang === 'hi' ? activeVideoModal.titleHi : activeVideoModal.title}
                </h3>
              </div>
              <button onClick={() => setActiveVideoModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            {/* Simulated Video Player Screen */}
            <div className="bg-slate-950 aspect-video rounded-xl flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-blue-600/90 flex items-center justify-center shadow-lg">
                <Play className="w-8 h-8 fill-white ml-1 text-white" />
              </div>
              <p className="text-xs text-slate-300 mt-3 font-medium">
                {t('Simulated Official Video Guide (MP Online Tutorial)', 'म.प्र. ऑनलाइन आधिकारिक ट्यूटोरियल')}
              </p>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>01:15 / {activeVideoModal.duration}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded">1080p HD</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                {t('Step-by-Step Instructions Covered in this Video:', 'इस वीडियो में बताए गए प्रमुख बिंदु:')}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {(lang === 'hi' ? activeVideoModal.stepsHi : activeVideoModal.steps).map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg">
                    <span className="font-bold text-blue-700 shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveVideoModal(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
              >
                {t('Done', 'पूर्ण')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
