import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Volume2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Search,
  Bookmark,
  Play,
} from 'lucide-react';
import { ApplicationItem } from '../types';

export const MyApplicationsView: React.FC = () => {
  const {
    t,
    lang,
    applications,
    savedDrafts,
    startApplication,
    openStatusExplainer,
    openWhyExplainer,
    openPaymentVerify,
  } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'submitted' | 'saved'>('all');

  const filteredApps = applications.filter(app => {
    const term = searchFilter.toLowerCase();
    return (
      app.id.toLowerCase().includes(term) ||
      app.serviceName.toLowerCase().includes(term) ||
      app.applicantName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t('My Applications & Tracking', 'मेरे आवेदन एवं स्थिति ट्रैकिंग')}
          </h1>
          <p className="text-xs text-slate-500">
            {t(
              'Track submissions, explain statuses with AI, and resume saved drafts anytime.',
              'आवेदन स्थिति ट्रैक करें, एआई से स्थिति का सरल अर्थ समझें और सहेजे गए ड्राफ्ट पूरे करें।'
            )}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedTab === 'all'
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {t('All Applications', 'सभी आवेदन')} ({applications.length + savedDrafts.length})
          </button>
          <button
            onClick={() => setSelectedTab('submitted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedTab === 'submitted'
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {t('Submitted', 'जमा किए गए')} ({applications.length})
          </button>
          <button
            onClick={() => setSelectedTab('saved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedTab === 'saved'
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {t('Saved Drafts', 'सहेजे गए ड्राफ्ट')} ({savedDrafts.length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white border border-slate-300 rounded-xl p-2.5 flex items-center gap-2 shadow-2xs">
        <Search className="w-4 h-4 text-slate-400 ml-1" />
        <input
          type="text"
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
          placeholder={t(
            'Search by Application ID (e.g. MP-2026-10482) or Service Name…',
            'आवेदन क्रमांक (जैसे: MP-2026-10482) या सेवा के नाम से खोजें…'
          )}
          className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
        />
      </div>

      {/* 1. Saved Applications Section (Prompt Section 10: Save & Resume) */}
      {(selectedTab === 'all' || selectedTab === 'saved') && savedDrafts.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900">
              {t('Saved Applications (In Progress)', 'सहेजे गए अधूरे आवेदन')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedDrafts.map(draft => (
              <div
                key={draft.serviceId}
                className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-4 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {t('Draft In Session', 'सत्र में सहेजा गया')}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">{draft.serviceName}</h3>
                    </div>
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                      {draft.progressPercent}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${draft.progressPercent}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-2">
                    {t('Last saved:', 'अंतिम बार सहेजा:')} {draft.lastSavedText} • {t('Applicant:', 'आवेदक:')} {draft.formData.fullName}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">
                    {t(`Step ${draft.currentStep} of 6`, `चरण ${draft.currentStep} / 6`)}
                  </span>
                  <button
                    onClick={() => startApplication(draft.serviceId, true)}
                    className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{t('Resume Application', 'जारी रखें')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Submitted Applications List (Prompt Section 11 & 12) */}
      {(selectedTab === 'all' || selectedTab === 'submitted') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900">
                {t('Submitted Applications', 'प्रस्तुत किए गए आवेदन')}
              </h2>
            </div>
            <span className="text-xs text-slate-500">{filteredApps.length} {t('records found', 'अभिलेख उपलब्ध')}</span>
          </div>

          <div className="space-y-4">
            {filteredApps.map(app => (
              <div
                key={app.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-4"
              >
                {/* Top Card Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-base text-slate-900">
                        {lang === 'hi' ? app.serviceNameHi : app.serviceName}
                      </h3>
                      <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-sm bg-slate-100 text-slate-800 border border-slate-200">
                        ID: {app.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {t('Applicant:', 'आवेदक:')} <strong className="text-slate-700">{app.applicantName}</strong> • {t('Submitted:', 'प्रस्तुत:')} {app.submittedDate} • {t('Last Updated:', 'अंतिम अद्यतन:')} {app.lastUpdated}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                        app.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : app.status === 'UNDER_VERIFICATION'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}
                    >
                      {app.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {app.status === 'UNDER_VERIFICATION' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                      {app.status === 'PAYMENT_PENDING' && <AlertTriangle className="w-3.5 h-3.5 text-red-600" />}
                      <span>{lang === 'hi' ? app.statusTextHi : app.statusText}</span>
                    </span>
                  </div>
                </div>

                {/* Timeline Visualization (Section 11) */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-700 mb-3">
                    {t('Official Scrutiny Timeline', 'विभागीय समीक्षा टाइमलाइन')}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                    {app.timeline.map((step, idx) => {
                      const isCompleted = step.status === 'completed';
                      const isCurrent = step.status === 'current';
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                            isCurrent
                              ? 'bg-amber-50 border-amber-300 text-amber-950 font-semibold'
                              : isCompleted
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                                  isCompleted
                                    ? 'bg-emerald-600 text-white'
                                    : isCurrent
                                    ? 'bg-amber-600 text-white animate-pulse'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {isCompleted ? '✓' : idx + 1}
                              </span>
                              <span className="font-bold text-xs truncate">
                                {lang === 'hi' ? step.titleHi : step.title}
                              </span>
                            </div>
                            {step.desc && (
                              <p className="text-[10px] text-slate-500 line-clamp-2">
                                {step.desc}
                              </p>
                            )}
                          </div>
                          {step.date && (
                            <span className="text-[10px] text-slate-400 mt-2 block">
                              {step.date}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Actions: Explain Status, Why? Explainer, Verify Payment */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    {/* Explain Status Button (Section 11) */}
                    <button
                      onClick={() => openStatusExplainer(app)}
                      className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{t('Explain Status with AI', 'एआई द्वारा स्थिति समझें')}</span>
                    </button>

                    {/* "Why?" Explainer Button (Section 12) */}
                    <button
                      onClick={() => openWhyExplainer(app)}
                      className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-4 h-4 text-blue-700" />
                      <span>{t('Why is it here?', 'यह यहां क्यों रुका है? (Why?)')}</span>
                    </button>
                  </div>

                  {/* Payment Recheck / Verification Tool for Payment Pending (Section 13 & 14) */}
                  {app.paymentStatus === 'PENDING' && (
                    <button
                      onClick={() => openPaymentVerify(app.id)}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t('Verify Payment & Sync', 'भुगतान सत्यापित व सिंक करें')}</span>
                    </button>
                  )}

                  {app.status === 'APPROVED' && (
                    <button
                      onClick={() => alert(t('Downloading official certificate PDF…', 'डिजिटल प्रमाण पत्र डाउनलोड हो रहा है…'))}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      ✓ {t('Download Certificate', 'प्रमाण पत्र डाउनलोड करें')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
