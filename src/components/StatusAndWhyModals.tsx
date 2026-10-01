import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Volume2,
  HelpCircle,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';

export const StatusAndWhyModals: React.FC = () => {
  const {
    t,
    lang,
    statusExplainerApp,
    closeStatusExplainer,
    whyExplainerApp,
    closeWhyExplainer,
    paymentVerifyOpen,
    paymentVerifyAppId,
    closePaymentVerify,
    applications,
    updateApplicationPayment,
  } = useApp();

  const [verifying, setVerifying] = React.useState(false);
  const [verifySuccess, setVerifySuccess] = React.useState(false);

  // Status Explainer Modal (Prompt Section 11)
  const renderStatusExplainer = () => {
    if (!statusExplainerApp) return null;

    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded">
                  {t('AI Status Explanation', 'एआई स्थिति व्याख्या')}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-0.5">
                  {lang === 'hi' ? statusExplainerApp.serviceNameHi : statusExplainerApp.serviceName}
                </h3>
              </div>
            </div>
            <button
              onClick={closeStatusExplainer}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Status Badge */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">{t('Application ID:', 'आवेदन क्रमांक:')}</span>{' '}
              <strong className="font-mono text-slate-900">{statusExplainerApp.id}</strong>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full font-bold ${
                statusExplainerApp.status === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : statusExplainerApp.status === 'UNDER_VERIFICATION'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-red-100 text-red-900'
              }`}
            >
              {lang === 'hi' ? statusExplainerApp.statusTextHi : statusExplainerApp.statusText}
            </span>
          </div>

          {/* Plain Language AI Explanation */}
          <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-950 space-y-2 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 text-blue-900 text-sm">
              <span>🤖 {t('What this status means:', 'वर्तमान स्थिति का सरल अर्थ:')}</span>
            </div>
            <p>
              {lang === 'hi'
                ? `आपका आवेदन वर्तमान में सत्यापन प्रक्रियाधीन (Under Verification) है। उपलब्ध शासकीय स्थिति के आधार पर, वर्तमान में आपकी ओर से किसी भी कार्यवाही की आवश्यकता नहीं है।`
                : `Your application is currently under verification. Based on the available status information, there is no action required from you right now.`}
            </p>
          </div>

          {/* What should I do next? */}
          <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{t('What should I do next?', 'मुझे आगे क्या करना चाहिए?')}</span>
            </div>
            <p className="leading-relaxed">
              {lang === 'hi' ? statusExplainerApp.whatToDoNextHi : statusExplainerApp.whatToDoNext}
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={closeStatusExplainer}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
            >
              {t('Understood', 'समझ गया')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // "Why?" Explainer Modal (Prompt Section 12)
  const renderWhyExplainer = () => {
    if (!whyExplainerApp) return null;

    const hasSpecificReason = Boolean(whyExplainerApp.whyReason);

    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded">
                  {t('Status Reason Explainer', 'कारण स्पष्टीकरण')}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-0.5">
                  {t('Why is my application here?', 'आवेदन यहां क्यों रुका है?')}
                </h3>
              </div>
            </div>
            <button
              onClick={closeWhyExplainer}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <span className="text-slate-500">{t('Status:', 'वर्तमान स्थिति:')}</span>{' '}
            <strong className="text-slate-900">
              {lang === 'hi' ? whyExplainerApp.statusTextHi : whyExplainerApp.statusText}
            </strong>
          </div>

          {/* Why? Specific reason block */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-950 space-y-1.5 leading-relaxed">
            <div className="font-bold text-amber-900 text-sm">
              {t('Why?', 'कारण क्या है?')}
            </div>
            <p>
              {hasSpecificReason
                ? lang === 'hi'
                  ? whyExplainerApp.whyReasonHi
                  : whyExplainerApp.whyReason
                : t(
                    'The exact reason is not available in the current status information.',
                    'वर्तमान स्थिति विवरण में स्पष्ट कारण उपलब्ध नहीं है।'
                  )}
            </p>
          </div>

          {/* What should you do? */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1.5 leading-relaxed">
            <div className="font-bold text-slate-900 text-sm">
              {t('What should you do?', 'आपको क्या सावधानी बरतनी चाहिए?')}
            </div>
            <p>
              {lang === 'hi' ? whyExplainerApp.whatToDoNextHi : whyExplainerApp.whatToDoNext}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={closeWhyExplainer}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
            >
              {t('Close', 'बंद करें')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Payment Verification Tool Modal (Prompt Section 14)
  const renderPaymentVerifyModal = () => {
    if (!paymentVerifyOpen) return null;

    const targetApp = applications.find(a => a.id === paymentVerifyAppId) || applications[2] || applications[0];

    const handleRunVerify = () => {
      setVerifying(true);
      setTimeout(() => {
        setVerifying(false);
        setVerifySuccess(true);
        updateApplicationPayment(targetApp.id, 'SUCCESS');
      }, 1500);
    };

    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded">
                  {t('Payment Reconciliation', 'भुगतान समाधान')}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-0.5">
                  {t('Payment Verification', 'भुगतान सत्यापन')}
                </h3>
              </div>
            </div>
            <button onClick={closePaymentVerify} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">{t('Application ID:', 'आवेदन क्रमांक:')}</span>
              <strong className="font-mono text-slate-900">{targetApp.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('Transaction ID:', 'लेन-देन क्रमांक:')}</span>
              <strong className="font-mono text-slate-900">{targetApp.transactionId || 'TXN-MP-581920'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('Payment Amount:', 'भुगतान राशि:')}</span>
              <strong className="text-slate-900">₹{targetApp.feeAmount}.00</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('Application Status:', 'आवेदन स्थिति:')}</span>
              <span className="font-bold text-amber-700">{targetApp.statusText}</span>
            </div>
          </div>

          {verifySuccess ? (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-950 space-y-2">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{t('Payment Gateway: Transaction Found', 'पेमेंट गेटवे: लेन-देन सत्यापित पाया गया')}</span>
              </div>
              <p className="leading-relaxed">
                {t(
                  'System message: Your payment was detected. The application status has been synchronized without requiring another payment.',
                  'सिस्टम संदेश: आपका भुगतान सत्यापित हो चुका है। आवेदन की स्थिति बिना दोबारा भुगतान किए अद्यतन कर दी गई है।'
                )}
              </p>
            </div>
          ) : (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950">
              <p>
                {t(
                  'Please do not make another payment while your transaction is being verified.',
                  'कृपया दोबारा भुगतान न करें जब तक स्थिति स्पष्ट न हो।'
                )}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={closePaymentVerify}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              {t('Close', 'बंद करें')}
            </button>
            {!verifySuccess && (
              <button
                onClick={handleRunVerify}
                disabled={verifying}
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                {verifying && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{verifying ? t('Verifying…', 'जांच जारी…') : t('Verify Now', 'अभी सत्यापित करें')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderStatusExplainer()}
      {renderWhyExplainer()}
      {renderPaymentVerifyModal()}
    </>
  );
};
