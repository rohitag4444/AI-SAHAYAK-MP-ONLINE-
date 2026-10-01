import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ApplicationDraft, ApplicationItem, Service } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Upload,
  ArrowRight,
  ArrowLeft,
  Save,
  X,
  CreditCard,
  ShieldCheck,
  RotateCw,
  Eye,
  AlertCircle,
  QrCode,
  Download,
} from 'lucide-react';

interface Props {
  serviceId: string;
  onClose: () => void;
  initialDraftResume?: boolean;
}

export const ApplicationWizard: React.FC<Props> = ({ serviceId, onClose, initialDraftResume = false }) => {
  const {
    t,
    lang,
    services,
    savedDrafts,
    saveDraft,
    submitApplication,
    openPaymentVerify,
    setActiveTab,
  } = useApp();

  const service: Service = services.find(s => s.id === serviceId) || services[0];

  // Try to retrieve existing draft
  const existingDraft = savedDrafts.find(d => d.serviceId === serviceId);

  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (initialDraftResume && existingDraft) {
      return existingDraft.currentStep || 1;
    }
    return 1;
  });

  const [formData, setFormData] = useState(() => {
    if (initialDraftResume && existingDraft) {
      return existingDraft.formData;
    }
    return {
      fullName: 'Rohit Sharma',
      fatherName: 'Ramprasad Sharma',
      gender: 'Male',
      dob: '2004-08-15',
      mobile: '9876543210',
      samagraId: '109283746',
      aadhaarNumber: '8910 2341 5678',
      district: 'Bhopal',
      tehsil: 'Huzur',
      address: 'House No 42, Ward 18, Kolar Road, Bhopal',
      category: 'OBC',
      annualIncome: '180000',
      collegeName: 'Govt Excellence Institute of Higher Education Bhopal',
      courseName: 'B.Sc Computer Science (2nd Year)',
      bankName: 'State Bank of India',
      accountNumber: '39482710294',
      ifscCode: 'SBIN0001053',
      isMpResident: true,
    };
  });

  // Uploaded docs with simulated OCR states
  const [uploadedDocs, setUploadedDocs] = useState<{
    [key: string]: {
      fileName: string;
      status: 'analyzing' | 'verified' | 'mismatch' | 'unreadable';
      detectedName?: string;
      issueNote?: string;
      reviewed?: boolean;
    };
  }>(() => {
    if (initialDraftResume && existingDraft?.uploadedDocs) {
      return existingDraft.uploadedDocs;
    }
    return {
      aadhaar: {
        fileName: 'Aadhaar_Card_Rohit.pdf',
        status: 'verified',
        detectedName: 'Rohit Sharma',
      },
      income: {
        fileName: 'Income_Certificate_2025.pdf',
        status: 'verified',
        detectedName: 'Rohit Sharma',
      },
      marksheet: {
        fileName: '12th_Marksheet_MPBoard.pdf',
        status: 'mismatch',
        detectedName: 'Rohit Kumar Sharma',
        issueNote: 'The name on this document (Rohit Kumar Sharma) has a middle name not typed in the Personal Details.',
      },
      bank: {
        fileName: 'SBI_Passbook_Front.jpg',
        status: 'verified',
        detectedName: 'Rohit Sharma',
      },
    };
  });

  const [simulatingUploadKey, setSimulatingUploadKey] = useState<string | null>(null);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [paymentStatus, setPaymentStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'PENDING' | 'FAILED'>('IDLE');
  const [generatedAppId, setGeneratedAppId] = useState<string>('');

  const steps = [
    { number: 1, titleEn: 'Personal', titleHi: 'व्यक्तिगत जानकारी' },
    { number: 2, titleEn: 'Eligibility', titleHi: 'पात्रता विवरण' },
    { number: 3, titleEn: 'Documents', titleHi: 'दस्तावेज' },
    { number: 4, titleEn: 'Review & AI Check', titleHi: 'समीक्षा एवं एआई जांच' },
    { number: 5, titleEn: 'Payment', titleHi: 'भुगतान' },
    { number: 6, titleEn: 'Submit', titleHi: 'पुष्टि' },
  ];

  // Auto-save progress
  const handleSaveProgress = () => {
    const draft: ApplicationDraft = {
      serviceId: service.id,
      serviceName: lang === 'hi' ? service.nameHi : service.name,
      progressPercent: Math.round((currentStep / 6) * 100),
      lastSavedText: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastSavedTimestamp: Date.now(),
      currentStep,
      formData,
      uploadedDocs,
    };
    saveDraft(draft);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  // Simulated Document Upload & OCR
  const handleUploadSimulate = (docKey: string, file: File | null) => {
    const fileName = file ? file.name : `${docKey.toUpperCase()}_Document.pdf`;
    setSimulatingUploadKey(docKey);

    setUploadedDocs(prev => ({
      ...prev,
      [docKey]: {
        fileName,
        status: 'analyzing',
      },
    }));

    setTimeout(() => {
      setSimulatingUploadKey(null);
      if (docKey === 'marksheet') {
        setUploadedDocs(prev => ({
          ...prev,
          [docKey]: {
            fileName,
            status: 'mismatch',
            detectedName: 'Rohit Kumar Sharma',
            issueNote: 'Potential Issue: The name on this document (Rohit Kumar Sharma) has a middle name not matching the entered name (Rohit Sharma).',
          },
        }));
      } else {
        setUploadedDocs(prev => ({
          ...prev,
          [docKey]: {
            fileName,
            status: 'verified',
            detectedName: formData.fullName,
          },
        }));
      }
    }, 1200);
  };

  // Payment Execution Simulation
  const handlePay = (simulatedOutcome: 'SUCCESS' | 'PENDING' | 'FAILED' = 'SUCCESS') => {
    setPaymentStatus('PROCESSING');
    setTimeout(() => {
      setPaymentStatus(simulatedOutcome);
      if (simulatedOutcome === 'SUCCESS') {
        const newAppId = 'MP-2026-' + Math.floor(10000 + Math.random() * 90000);
        setGeneratedAppId(newAppId);

        const newApplication: ApplicationItem = {
          id: newAppId,
          serviceId: service.id,
          serviceName: service.name,
          serviceNameHi: service.nameHi,
          applicantName: formData.fullName,
          submittedDate: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          lastUpdated: 'Just now',
          status: 'UNDER_VERIFICATION',
          statusText: 'Under Verification',
          statusTextHi: 'सत्यापन प्रक्रियाधीन',
          feeAmount: 75,
          paymentStatus: 'SUCCESS',
          transactionId: 'TXN-MP-' + Math.floor(1000000 + Math.random() * 9000000),
          timeline: [
            {
              title: 'Application Submitted',
              titleHi: 'आवेदन प्रस्तुत किया गया',
              status: 'completed',
              date: 'Just now',
              desc: 'Form data and attachments verified.',
            },
            {
              title: 'Documents Received',
              titleHi: 'दस्तावेज प्राप्त हुए',
              status: 'completed',
              date: 'Just now',
              desc: 'Digital repository updated.',
            },
            {
              title: 'Verification in Progress',
              titleHi: 'सत्यापन प्रक्रियाधीन',
              status: 'current',
              date: 'Under Nodal desk review',
              desc: 'Assigned for scrutiny.',
            },
            {
              title: 'Final Decision',
              titleHi: 'अंतिम निर्णय व डीबीटी अंतरण',
              status: 'pending',
            },
          ],
          whyReason: 'The scrutiny officer is reviewing submitted academic and residency credentials.',
          whyReasonHi: 'नोडल अधिकारी द्वारा शैक्षणिक एवं मूल निवास अभिलेखों का सत्यापन किया जा रहा है।',
          whatToDoNext: 'No action is needed. You will receive an SMS when the verification is approved.',
          whatToDoNextHi: 'वर्तमान में कुछ करने की आवश्यकता नहीं है। स्वीकृति पर एसएमएस प्राप्त होगा।',
        };

        submitApplication(newApplication);
        setCurrentStep(6);
      }
    }, 1500);
  };

  const hasNameMismatch =
    uploadedDocs.marksheet?.status === 'mismatch' &&
    !uploadedDocs.marksheet?.reviewed &&
    formData.fullName.trim() !== 'Rohit Kumar Sharma';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs text-blue-300 font-bold uppercase tracking-wider">
                {t('Smart Application Portal', 'स्मार्ट आवेदन पोर्टल')}
              </span>
              <h2 className="text-base sm:text-lg font-bold">
                {lang === 'hi' ? service.nameHi : service.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveProgress}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Save draft to continue later"
            >
              <Save className="w-3.5 h-3.5 text-blue-400" />
              <span>{t('Save Progress', 'सहेजें')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Toast Notification */}
        {showSaveToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between">
            <span>✓ {t('Application draft saved successfully! You can resume anytime.', 'प्रगति सफलतापूर्वक सहेज ली गई है! आप कभी भी इसे पुनः जारी रख सकते हैं।')}</span>
          </div>
        )}

        {/* Steps Progress Indicator (Prompt Section 6: 1 Personal → 2 Eligibility → 3 Documents → 4 Review → 5 Payment → 6 Submit) */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[500px] text-xs">
            {steps.map((st, idx) => {
              const isPassed = currentStep > st.number;
              const isCurrent = currentStep === st.number;
              return (
                <div key={st.number} className="flex items-center gap-2 flex-1">
                  <div
                    className={`flex items-center gap-1.5 font-bold ${
                      isCurrent
                        ? 'text-blue-700'
                        : isPassed
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCurrent
                          ? 'bg-blue-700 text-white'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isPassed ? '✓' : st.number}
                    </span>
                    <span className="hidden sm:inline">
                      {lang === 'hi' ? st.titleHi : st.titleEn}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 ${
                        isPassed ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body / Step Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {t('Step 1: Personal & Citizen Identification', 'चरण 1: व्यक्तिगत एवं नागरिक पहचान')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('Details linked to your Samagra ID & Aadhaar', 'आपकी समग्र आईडी एवं आधार से जुड़े विवरण')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('Applicant Full Name *', 'आवेदक का पूरा नाम *')}
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-hidden"
                  />
                  <span className="text-[11px] text-slate-500">
                    {t('Tip: Enter exact name as on your 10th/12th marksheet', 'सुझाव: अंकसूची के अनुसार सही नाम दर्ज करें')}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('Father’s / Guardian’s Name *', 'पिता / अभिभावक का नाम *')}
                  </label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('9-Digit Samagra Member ID *', '9 अंकों की सदस्य समग्र आईडी *')}
                  </label>
                  <input
                    type="text"
                    value={formData.samagraId}
                    onChange={e => setFormData({ ...formData, samagraId: e.target.value })}
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('Mobile Number (for SMS Alerts) *', 'मोबाइल नंबर (एसएमएस सूचना हेतु) *')}
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('Social Category *', 'सामाजिक वर्ग *')}
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="OBC">OBC (Other Backward Class)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="General">General / EWS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('District (Madhya Pradesh) *', 'जिला (मध्य प्रदेश) *')}
                  </label>
                  <select
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="Bhopal">Bhopal (भोपाल)</option>
                    <option value="Indore">Indore (इंदौर)</option>
                    <option value="Jabalpur">Jabalpur (जबलपुर)</option>
                    <option value="Gwalior">Gwalior (ग्वालियर)</option>
                    <option value="Ujjain">Ujjain (उज्जैन)</option>
                    <option value="Sagar">Sagar (सागर)</option>
                    <option value="Rewa">Rewa (रीवा)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Eligibility Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {t('Step 2: Eligibility & Course Details', 'चरण 2: पात्रता एवं पाठ्यक्रम विवरण')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('Details verified against official departmental criteria', 'विभागीय पात्रता नियमों के अनुसार जांच')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('Annual Family Income (₹) *', 'पारिवारिक वार्षिक आय (₹) *')}
                  </label>
                  <input
                    type="number"
                    value={formData.annualIncome}
                    onChange={e => setFormData({ ...formData, annualIncome: e.target.value })}
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-hidden"
                  />
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    ✓ {t('Eligible (Must be under ₹3,00,000 for full scholarship)', 'पात्र (पूर्ण छात्रवृत्ति हेतु ₹3 लाख से कम होना चाहिए)')}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('Are you a permanent resident of MP? *', 'क्या आप म.प्र. के मूल निवासी हैं? *')}
                  </label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={formData.isMpResident}
                        onChange={() => setFormData({ ...formData, isMpResident: true })}
                        className="text-blue-600"
                      />
                      <span>{t('Yes (हाँ)', 'हाँ')}</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={!formData.isMpResident}
                        onChange={() => setFormData({ ...formData, isMpResident: false })}
                        className="text-blue-600"
                      />
                      <span>{t('No (नहीं)', 'नहीं')}</span>
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('College / Institution Name in MP *', 'कॉलेज / संस्थान का नाम *')}
                  </label>
                  <input
                    type="text"
                    value={formData.collegeName}
                    onChange={e => setFormData({ ...formData, collegeName: e.target.value })}
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('Current Course & Year *', 'वर्तमान पाठ्यक्रम व वर्ष *')}
                  </label>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('Bank IFSC Code (Aadhaar DBT enabled) *', 'बैंक आईएफएससी कोड (डीबीटी सक्रिय) *')}
                  </label>
                  <input
                    type="text"
                    value={formData.ifscCode}
                    onChange={e => setFormData({ ...formData, ifscCode: e.target.value })}
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-hidden font-mono uppercase"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Documents & Smart Document Checker (Prompt Section 7) */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <span>{t('Step 3: Smart Document Checker', 'चरण 3: स्मार्ट दस्तावेज चेकर')}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    {t('AI OCR Verification', 'एआई ओसीआर सत्यापन')}
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  {t(
                    'Upload your certificates. Our simulated AI/OCR verifies readability, extracts your name, and checks for mismatches to prevent application rejection.',
                    'दस्तावेज अपलोड करें। हमारा टूल स्वतः नाम पढ़कर जांच करेगा ताकि फॉर्म निरस्त न हो।'
                  )}
                </p>
              </div>

              <div className="space-y-3">
                {/* 1. Aadhaar Card */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">✓ {t('Aadhaar Card', 'आधार कार्ड')}</span>
                      <p className="text-xs text-slate-500">{uploadedDocs.aadhaar?.fileName || 'No file selected'}</p>
                    </div>

                    <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t('Re-upload', 'अपलोड')}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={e => handleUploadSimulate('aadhaar', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>

                  {simulatingUploadKey === 'aadhaar' ? (
                    <div className="text-xs text-blue-700 flex items-center gap-2 py-1">
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{t('Analyzing document…', 'दस्तावेज का विश्लेषण किया जा रहा है…')}</span>
                    </div>
                  ) : (
                    <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 p-2 rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        {t('Document readable • Name detected: "Rohit Sharma" • Matches application profile.', 'दस्तावेज स्पष्ट है • नाम: "Rohit Sharma" • फॉर्म से पूर्णतः मेल खाता है।')}
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Income Certificate */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">✓ {t('Income Certificate (Aay Praman Patra)', 'आय प्रमाण पत्र')}</span>
                      <p className="text-xs text-slate-500">{uploadedDocs.income?.fileName || 'No file selected'}</p>
                    </div>

                    <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t('Re-upload', 'अपलोड')}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={e => handleUploadSimulate('income', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>

                  <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 p-2 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {t('Document readable • Tehsildar digital signature detected • Annual income ₹1,80,000 matches.', 'दस्तावेज स्पष्ट • तहसीलदार के डिजिटल हस्ताक्षर सत्यापित • ₹1,80,000 की आय मेल खाती है।')}
                    </span>
                  </div>
                </div>

                {/* 3. Previous Marksheet (With Potential Mismatch Scenario per Prompt Section 7 & 8) */}
                <div
                  className={`p-3.5 rounded-xl border space-y-2 ${
                    hasNameMismatch
                      ? 'border-amber-300 bg-amber-50/70'
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        ✓ {t('Class 12th / Previous Marksheet', '12वीं अथवा गत वर्ष की अंकसूची')}
                      </span>
                      <p className="text-xs text-slate-500">{uploadedDocs.marksheet?.fileName}</p>
                    </div>

                    <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t('Re-upload', 'पुनः अपलोड')}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={e => handleUploadSimulate('marksheet', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>

                  {simulatingUploadKey === 'marksheet' ? (
                    <div className="text-xs text-blue-700 flex items-center gap-2 py-1">
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{t('Analyzing document…', 'दस्तावेज का विश्लेषण किया जा रहा है…')}</span>
                    </div>
                  ) : hasNameMismatch ? (
                    <div className="bg-amber-100/80 border border-amber-300 rounded-lg p-3 text-xs space-y-2">
                      <div className="flex items-start gap-2 text-amber-900 font-bold">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span>{t('⚠ Potential Issue Detected', '⚠ संभावित समस्या पाई गई')}</span>
                          <p className="font-normal text-amber-800 text-[11px] mt-0.5">
                            {t(
                              'The name on this marksheet ("Rohit Kumar Sharma") includes a middle name that does not match the entered name ("Rohit Sharma").',
                              'इस अंकसूची पर नाम ("Rohit Kumar Sharma") लिखा है, जबकि फॉर्म में आपने ("Rohit Sharma") भरा है।'
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, fullName: 'Rohit Kumar Sharma' });
                            setUploadedDocs(prev => ({
                              ...prev,
                              marksheet: { ...prev.marksheet, reviewed: true, status: 'verified' },
                            }));
                          }}
                          className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-md transition-colors"
                        >
                          {t('Fix Issue (Update Name in Form)', 'त्रुटि सुधारें (फॉर्म में नाम बदलें)')}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setUploadedDocs(prev => ({
                              ...prev,
                              marksheet: { ...prev.marksheet, reviewed: true },
                            }));
                          }}
                          className="px-3 py-1.5 bg-white border border-amber-400 hover:bg-amber-50 text-amber-900 font-bold rounded-md transition-colors"
                        >
                          {t('Continue Anyway', 'आगे बढ़ें')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 p-2 rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        {t('Document verified • Roll number & marks validated • No mismatch.', 'अंकसूची सत्यापित • रोल नंबर व अंक सत्यापित • कोई विसंगति नहीं।')}
                      </span>
                    </div>
                  )}
                </div>

                {/* 4. Bank Account Passbook */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">✓ {t('Bank Passbook Front Page', 'बैंक पासबुक प्रथम पृष्ठ')}</span>
                      <p className="text-xs text-slate-500">{uploadedDocs.bank?.fileName}</p>
                    </div>

                    <label className="cursor-pointer px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{t('Re-upload', 'अपलोड')}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={e => handleUploadSimulate('bank', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>

                  <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 p-2 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {t('IFSC Code SBIN0001053 verified • Aadhaar DBT seeding confirmed active.', 'आईएफएससी कोड SBIN0001053 सत्यापित • आधार डीबीटी सक्रिय पाया गया।')}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                {t(
                  '* Note: OCR verification in this hackathon prototype simulates document analysis to demonstrate error prevention.',
                  '* नोट: यह ओसीआर विश्लेषण प्रोटोटाइप में त्रुटि निवारण का सजीव प्रदर्शन प्रस्तुत करता है।'
                )}
              </p>
            </div>
          )}

          {/* STEP 4: Review & Application Rejection Predictor (Prompt Section 8) */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  {t('Step 4: AI Application Check & Pre-Submission Audit', 'चरण 4: एआई एप्लीकेशन चेक (अंतिम पूर्व-समीक्षा)')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t(
                    'Our system checks for mandatory fields, documents, and mismatches to reduce the chance of rejection.',
                    'हमारा सिस्टम अनिवार्य फ़ील्ड, दस्तावेज एवं विसंगतियों की पूर्व जांच करता है।'
                  )}
                </p>
              </div>

              {/* Pre-Submission Audit Card */}
              <div className="bg-slate-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
                <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                  <span>{t('Pre-Submission Checklist', 'आवेदन पूर्व-सत्यापन सूची')}</span>
                  <span className="text-xs bg-blue-700 text-white px-2 py-0.5 rounded font-mono">
                    AI Audit
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>✓ {t('Mandatory fields completed (100% of required questions answered)', 'अनिवार्य फ़ील्ड पूर्ण रूप से भरे गए हैं')}</span>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>✓ {t('Required documents uploaded (Aadhaar, Income, Marksheet, Bank)', 'सभी आवश्यक दस्तावेज संलग्न हैं')}</span>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>✓ {t('Document readability checked (No blurred or unreadable scans detected)', 'दस्तावेजों की स्पष्टता सत्यापित')}</span>
                  </div>

                  {hasNameMismatch ? (
                    <div className="flex items-start justify-between gap-2 text-amber-900 font-semibold bg-amber-50 p-2.5 rounded-lg border border-amber-300">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span>⚠ {t('Possible Information Mismatch', 'संभावित सूचना विसंगति')}</span>
                          <p className="font-normal text-amber-800 text-[11px] mt-0.5">
                            {t(
                              'Entered Name: "Rohit Sharma" vs Uploaded Document: "Rohit Kumar Sharma".',
                              'दर्ज नाम: "Rohit Sharma" जबकि दस्तावेज में "Rohit Kumar Sharma" है।'
                            )}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setFormData({ ...formData, fullName: 'Rohit Kumar Sharma' });
                          setUploadedDocs(prev => ({
                            ...prev,
                            marksheet: { ...prev.marksheet, reviewed: true, status: 'verified' },
                          }));
                        }}
                        className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded text-xs font-bold shrink-0"
                      >
                        {t('Fix Issue', 'त्रुटि सुधारें')}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>✓ {t('All detectable issues resolved: Your application is ready for submission.', 'सभी पहचानी गई त्रुटियां सुलझा ली गई हैं: आवेदन प्रस्तुति हेतु तैयार है।')}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-600 text-xs space-y-1">
                  <div className="font-bold text-slate-800">{t('Important Disclaimer:', 'महत्वपूर्ण अस्वीकरण:')}</div>
                  <p className="text-[11px]">
                    {t(
                      'AI Application Check identifies common mistakes to save you time. AI does not guarantee approval; final approval or rejection remains solely with the concerned government authority.',
                      'एआई एप्लीकेशन चेक सामान्य त्रुटियों को समय रहते रोकने में मदद करता है। यह स्वीकृति की गारंटी नहीं देता; अंतिम निर्णय अधिकृत शासकीय अधिकारी के क्षेत्राधिकार में है।'
                    )}
                  </p>
                </div>
              </div>

              {/* Data Summary Grid */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                <h4 className="font-bold text-slate-900 text-sm mb-2">
                  {t('Application Summary', 'आवेदन सारांश')}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400">{t('Applicant:', 'आवेदक:')}</span>{' '}
                    <strong className="text-slate-900">{formData.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">{t('Samagra ID:', 'समग्र आईडी:')}</span>{' '}
                    <strong className="text-slate-900 font-mono">{formData.samagraId}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">{t('Category:', 'वर्ग:')}</span>{' '}
                    <strong className="text-slate-900">{formData.category}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">{t('Annual Income:', 'वार्षिक आय:')}</span>{' '}
                    <strong className="text-slate-900">₹{formData.annualIncome}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400">{t('College:', 'कॉलेज:')}</span>{' '}
                    <strong className="text-slate-900">{formData.collegeName}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Payment & Payment Protection (Prompt Section 13 & 14) */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <span>{t('Step 5: Payment Protection & Fee Checkout', 'चरण 5: भुगतान सुरक्षा एवं पोर्टल शुल्क')}</span>
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </h3>
                <p className="text-xs text-slate-500">
                  {t(
                    'Protected transaction with instant reconciliation and double-payment prevention safeguards.',
                    'दोहरे भुगतान से सुरक्षा और त्वरित मिलान युक्त सुरक्षित भुगतान गेटवे।'
                  )}
                </p>
              </div>

              {/* Fee Breakdown Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{t('Application Processing Fee', 'आवेदन प्रक्रिया शुल्क')}</span>
                  <span className="font-bold text-slate-900">₹50.00</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{t('MP Online Portal & Treasury Charges', 'म.प्र. ऑनलाइन पोर्टल शुल्क')}</span>
                  <span className="font-bold text-slate-900">₹25.00</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-base font-bold text-slate-900">
                  <span>{t('Total Payable Amount', 'कुल देय राशि')}</span>
                  <span className="text-blue-700 text-lg">₹75.00</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  {t('Select Payment Method', 'भुगतान विधि चुनें')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-blue-700" />
                    <span>UPI (BHIM/GPay)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-indigo-700" />
                    <span>RuPay / Debit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    <span>Net Banking</span>
                  </button>
                </div>
              </div>

              {/* Payment Simulation Outcome Controls */}
              {paymentStatus === 'PROCESSING' && (
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 text-center space-y-3">
                  <RotateCw className="w-8 h-8 text-blue-700 animate-spin mx-auto" />
                  <div className="font-bold text-slate-900 text-sm">
                    {t('Securing connection with MP Treasury Payment Gateway…', 'राजकोष भुगतान गेटवे से सुरक्षित संपर्क किया जा रहा है…')}
                  </div>
                  <p className="text-xs text-slate-500">
                    {t('Please do not refresh the page or press the back button.', 'कृपया पेज रीफ्रेश न करें और बैक बटन न दबाएं।')}
                  </p>
                </div>
              )}

              {paymentStatus === 'PENDING' && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-900 text-sm">
                        {t('⏳ Payment Verification in Progress', '⏳ भुगतान सत्यापन प्रक्रियाधीन')}
                      </h4>
                      <p className="text-xs text-amber-800 font-semibold mt-1">
                        {t(
                          'IMPORTANT: Please do not make another payment while your transaction is being verified.',
                          'महत्वपूर्ण सूचना: जब तक पिछला लेन-देन सत्यापित हो रहा है, कृपया दोबारा भुगतान न करें।'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handlePay('SUCCESS')}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      {t('Recheck Payment Status (Simulate Success)', 'भुगतान स्थिति पुनः जांचें (सफल करें)')}
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        openPaymentVerify('MP-2026-11204');
                      }}
                      className="px-4 py-2 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors"
                    >
                      {t('Open Reconciliation Tool', 'सत्यापन टूल खोलें')}
                    </button>
                  </div>
                </div>
              )}

              {paymentStatus === 'FAILED' && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-300 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-900 text-sm">
                        {t('Payment Could Not Be Confirmed', 'भुगतान की पुष्टि नहीं हो सकी')}
                      </h4>
                      <p className="text-xs text-red-800 mt-1">
                        {t(
                          'If money was deducted from your bank, do NOT pay again. It will automatically reconcile within 1 hour.',
                          'यदि बैंक खाते से राशि कट चुकी है तो दोबारा भुगतान न करें। 1 घंटे में स्वतः स्थिति अद्यतन होगी।'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePay('SUCCESS')}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                    >
                      {t('Retry Verification', 'पुनः सत्यापन करें')}
                    </button>
                  </div>
                </div>
              )}

              {paymentStatus === 'IDLE' && (
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => handlePay('SUCCESS')}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>{t('Pay Application Fee ₹75.00', '₹75.00 का सुरक्षित भुगतान करें')}</span>
                  </button>

                  {/* Evaluator simulation controls */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 px-1">
                    <span>{t('Hackathon demo simulation:', 'डेमो परीक्षण विकल्प:')}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePay('PENDING')}
                        className="text-amber-700 hover:underline font-semibold"
                      >
                        {t('Simulate Pending State', 'लंबित स्थिति टेस्ट करें')}
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handlePay('FAILED')}
                        className="text-red-700 hover:underline font-semibold"
                      >
                        {t('Simulate Failed State', 'विफल स्थिति टेस्ट करें')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Final Submission Confirmation & Receipt */}
          {currentStep === 6 && (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 text-xl">
                  {t('Application Submitted Successfully!', 'आवेदन सफलतापूर्वक प्रस्तुत किया गया!')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t(
                    'Your application has been registered on MP Online portal and forwarded for scrutiny.',
                    'आपका आवेदन म.प्र. ऑनलाइन पोर्टल पर पंजीकृत होकर जांच हेतु प्रेषित कर दिया गया है।'
                  )}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">{t('Application ID:', 'आवेदन क्रमांक:')}</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{generatedAppId || 'MP-2026-92817'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">{t('Service Name:', 'सेवा का नाम:')}</span>
                  <span className="font-bold text-slate-900">{lang === 'hi' ? service.nameHi : service.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">{t('Applicant:', 'आवेदक:')}</span>
                  <span className="font-bold text-slate-900">{formData.fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">{t('Current Status:', 'वर्तमान स्थिति:')}</span>
                  <span className="font-bold text-amber-700">🟡 {t('Under Verification', 'सत्यापन प्रक्रियाधीन')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">{t('Fee Paid:', 'भुगतान शुल्क:')}</span>
                  <span className="font-bold text-emerald-700">₹75.00 (✓ Paid via UPI)</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('applications');
                  }}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>{t('Track in My Applications', 'मेरे आवेदन में ट्रैक करें')}</span>
                </button>

                <button
                  onClick={() => {
                    alert(t('Receipt PDF download simulated.', 'रसीद पीडीएफ डाउनलोड सिमुलेट की गई।'));
                  }}
                  className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('Download Official Receipt', 'आधिकारिक रसीद डाउनलोड करें')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        {currentStep < 6 && (
          <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('Back', 'पीछे')}</span>
            </button>

            <div className="text-xs text-slate-500 font-medium">
              {t(`Step ${currentStep} of 6`, `चरण ${currentStep} / 6`)}
            </div>

            <button
              onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))}
              disabled={currentStep === 5} // Step 5 requires clicking Pay button
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span>{currentStep === 4 ? t('Proceed to Payment', 'भुगतान हेतु आगे बढ़ें') : t('Continue', 'आगे बढ़ें')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
