import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  CreditCard,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCw,
  Search,
  ShieldCheck,
  Building,
  TrendingUp,
} from 'lucide-react';
import { MOCK_ELECTRICITY_REGIONS } from '../data/mockData';

export const UtilitiesView: React.FC = () => {
  const {
    t,
    lang,
    rushMode,
    toggleRushMode,
    virtualToken,
    estimatedWaitMinutes,
    applications,
    updateApplicationPayment,
  } = useApp();

  // Electricity Outage State
  const [selectedCity, setSelectedCity] = useState('Bhopal');
  const [selectedLocality, setSelectedLocality] = useState(MOCK_ELECTRICITY_REGIONS[0].localities[0].name);
  const [complaintRegistered, setComplaintRegistered] = useState<string | null>(null);
  const [complaintSearchId, setComplaintSearchId] = useState('');
  const [searchedComplaintResult, setSearchedComplaintResult] = useState<any>(null);

  // Payment Reconciliation State
  const [reconAppId, setReconAppId] = useState('MP-2026-11204');
  const [reconTxnId, setReconTxnId] = useState('TXN-MP-8419201');
  const [reconState, setReconState] = useState<'IDLE' | 'CHECKING' | 'FOUND' | 'SYNCED'>('IDLE');

  // Find selected city data
  const currentCityData = MOCK_ELECTRICITY_REGIONS.find(c => c.city === selectedCity) || MOCK_ELECTRICITY_REGIONS[0];
  const currentLocalityData = currentCityData.localities.find(l => l.name === selectedLocality) || currentCityData.localities[0];

  const handleRegisterComplaint = () => {
    const ticketId = 'ELEC-MP-' + Math.floor(1000 + Math.random() * 9000);
    setComplaintRegistered(ticketId);
  };

  const handleSearchComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintSearchId.trim()) return;
    setSearchedComplaintResult({
      id: complaintSearchId.trim().toUpperCase(),
      substation: currentLocalityData.substation,
      status: 'Assigned to Lineman Crew #4',
      eta: currentLocalityData.eta || 'Restoration estimate currently unavailable',
    });
  };

  const handleRunReconciliation = () => {
    setReconState('CHECKING');
    setTimeout(() => {
      setReconState('FOUND');
      setTimeout(() => {
        setReconState('SYNCED');
        updateApplicationPayment(reconAppId, 'SUCCESS');
      }, 1600);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-10 pb-24 md:pb-12">
      {/* 1. Electricity Outage & Complaint Utility (Prompt Section 18) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded">
                {t('Power Utility & Outage Alert', 'विद्युत मंडल कटौती व शिकायत समाधान')}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {t('Electricity Discom Utility (MPPKVVCL)', 'म.प्र. विद्युत वितरण कंपनी')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Instantly select an outage locality to demo
                setSelectedCity('Bhopal');
                setSelectedLocality('Kolar Road / Bairagarh Chichali');
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>⚡ {t('Electricity is not available', 'बिजली नहीं आ रही है')}</span>
            </button>
          </div>
        </div>

        {/* City and Locality Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('Select City / District', 'जिला / शहर चुनें')}
            </label>
            <select
              value={selectedCity}
              onChange={e => {
                setSelectedCity(e.target.value);
                const city = MOCK_ELECTRICITY_REGIONS.find(c => c.city === e.target.value);
                if (city) setSelectedLocality(city.localities[0].name);
              }}
              className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-hidden"
            >
              {MOCK_ELECTRICITY_REGIONS.map(c => (
                <option key={c.city} value={c.city}>
                  {c.city} ({c.district})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('Select Locality / Feeder Area', 'इलाका / फीडर क्षेत्र चुनें')}
            </label>
            <select
              value={selectedLocality}
              onChange={e => setSelectedLocality(e.target.value)}
              className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-hidden"
            >
              {currentCityData.localities.map(l => (
                <option key={l.name} value={l.name}>
                  {l.name} {l.hasOutage ? '⚠️ (Outage Reported)' : '✓ (Normal)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Outage Status Card */}
        <div
          className={`p-5 rounded-xl border ${
            currentLocalityData.hasOutage
              ? 'bg-amber-50/70 border-amber-300 text-amber-950'
              : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">
                  {currentLocalityData.hasOutage ? '🔴 Outage Reported' : '🟢 Normal Power Supply'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 font-mono">
                  {currentLocalityData.substation}
                </span>
              </div>

              <p className="text-xs mt-2 text-slate-700">
                <strong>{t('Area:', 'क्षेत्र:')}</strong> {currentLocalityData.name}, {selectedCity}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                <strong>{t('Feeder Log:', 'फीडर विवरण:')}</strong> {currentLocalityData.reason}
              </p>

              {/* Strict Requirement: If ETA exists, show it. If no ETA, say unavailable. NEVER invent. */}
              <div className="mt-3">
                {currentLocalityData.hasOutage ? (
                  currentLocalityData.eta ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-200 text-amber-950 text-xs font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t('Estimated Restoration:', 'अनुमानित बहाली समय:')} {currentLocalityData.eta}</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-200 text-slate-800 text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-slate-600" />
                      <span>{t('Official restoration estimate is currently unavailable.', 'अधिकृत बहाली का समय वर्तमान में अनुपलब्ध है।')}</span>
                    </div>
                  )
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t('All 11kV lines operating within standard voltage parameters.', 'सभी 11kV लाइनें सामान्य वोल्टेज पर संचालित हैं।')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={handleRegisterComplaint}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{t('Register Complaint', 'शिकायत दर्ज करें')}</span>
              </button>
            </div>
          </div>

          {complaintRegistered && (
            <div className="mt-4 pt-3 border-t border-amber-300 text-xs bg-white/90 p-3 rounded-lg flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-800">✓ {t('Complaint Registered Successfully!', 'शिकायत सफलतापूर्वक दर्ज!')}</span>
                <p className="text-slate-600 mt-0.5">
                  {t('Ticket ID:', 'शिकायत क्रमांक:')} <strong className="font-mono text-slate-900">{complaintRegistered}</strong> • {t('Sent to area lineman team.', 'क्षेत्रीय लाइनमैन को प्रेषित।')}
                </p>
              </div>
              <span className="text-[10px] text-slate-400">Demo Prototype</span>
            </div>
          )}
        </div>

        {/* Check Complaint Status Search */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {t('Check Power Complaint Status', 'विद्युत शिकायत की स्थिति जांचें')}
          </h3>
          <form onSubmit={handleSearchComplaint} className="flex gap-2">
            <input
              type="text"
              value={complaintSearchId}
              onChange={e => setComplaintSearchId(e.target.value)}
              placeholder={t('Enter Complaint / Ticket ID (e.g. ELEC-MP-8491)', 'शिकायत क्रमांक दर्ज करें (जैसे ELEC-MP-8491)')}
              className="flex-1 text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
            >
              {t('Check Status', 'स्थिति देखें')}
            </button>
          </form>

          {searchedComplaintResult && (
            <div className="bg-white border border-slate-200 p-3 rounded-lg text-xs space-y-1">
              <div className="font-bold text-slate-900 flex justify-between">
                <span>Ticket: {searchedComplaintResult.id}</span>
                <span className="text-blue-700">{searchedComplaintResult.status}</span>
              </div>
              <p className="text-slate-600">Substation: {searchedComplaintResult.substation}</p>
              <p className="text-slate-500">ETA: {searchedComplaintResult.eta}</p>
            </div>
          )}
        </div>
      </section>

      {/* 2. Payment Protection & Reconciliation Hub (Prompt Section 13 & 14) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded">
                {t('Transaction Safety & Reconciliation', 'लेन-देन सुरक्षा व मिलान')}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {t('Payment Verification & Double-Pay Prevention', 'भुगतान सत्यापन व दोहरे भुगतान से सुरक्षा')}
              </h2>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {t(
            'In government portals, bank confirmations can lag behind debit messages. Our reconciliation system checks the payment aggregator logs directly so citizens never pay twice for the same application.',
            'शासकीय पोर्टलों पर कभी-कभी बैंक सर्वर से पुष्टि आने में विलंब होता है। यह टूल सीधे बैंक गेटवे रिकॉर्ड्स से मिलान करता है ताकि नागरिक से दोबारा शुल्क न कटे।'
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('Search Pending Transaction', 'लंबित लेन-देन की जांच')}
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('Application ID', 'आवेदन क्रमांक')}</label>
              <input
                type="text"
                value={reconAppId}
                onChange={e => setReconAppId(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('Bank Transaction ID / UTR', 'बैंक लेन-देन क्रमांक / यूटीआर')}</label>
              <input
                type="text"
                value={reconTxnId}
                onChange={e => setReconTxnId(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white font-mono"
              />
            </div>

            <button
              onClick={handleRunReconciliation}
              disabled={reconState === 'CHECKING'}
              className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              {reconState === 'CHECKING' ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t('Querying Treasury Gateway…', 'ट्रेजरी गेटवे से मिलान किया जा रहा है…')}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('Verify Payment with Gateway', 'गेटवे से भुगतान सत्यापित करें')}</span>
                </>
              )}
            </button>
          </div>

          {/* Reconciliation Output Console */}
          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 font-mono text-xs flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400 text-[10px]">GATEWAY LOGS</span>
                <span className="text-emerald-400 text-[10px]">SECURE TLS 1.3</span>
              </div>

              <div>
                <span className="text-slate-500">App ID:</span> {reconAppId}
              </div>
              <div>
                <span className="text-slate-500">Txn Ref:</span> {reconTxnId}
              </div>

              {reconState === 'IDLE' && (
                <p className="text-slate-400 italic text-[11px] pt-4">
                  {t('Click "Verify Payment with Gateway" to check transaction state.', 'लेन-देन की स्थिति जांचने के लिए बटन दबाएं।')}
                </p>
              )}

              {reconState === 'CHECKING' && (
                <div className="text-amber-400 animate-pulse pt-2">
                  ⏳ Connecting to SBI ePay / MP Online Treasury Aggregator…
                </div>
              )}

              {(reconState === 'FOUND' || reconState === 'SYNCED') && (
                <div className="space-y-1.5 pt-2 text-emerald-400">
                  <div>✓ Payment Gateway: Transaction Found (₹40.00 confirmed)</div>
                  <div>
                    {reconState === 'SYNCED' ? (
                      <span className="text-emerald-300 font-bold">✓ Application: Status Synchronized to "Under Verification"</span>
                    ) : (
                      <span className="text-amber-300">⏳ Application: Status Updating in Database…</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {reconState === 'SYNCED' && (
              <div className="bg-emerald-950/70 border border-emerald-500/40 p-2.5 rounded text-emerald-200 text-[11px]">
                {t(
                  'System Message: Your payment was detected. Application status has been synchronized without double charge.',
                  'सिस्टम संदेश: आपका भुगतान सत्यापित हो चुका है। आवेदन की स्थिति बिना अतिरिक्त शुल्क के अद्यतन कर दी गई है।'
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Smart Access & Rush Mode Simulator (Prompt Section 15 & 16) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Gauge className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded">
                {t('Smart Access & Rush Prevention', 'स्मार्ट एक्सेस व सर्वर लोड प्रबंधन')}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                {t('High Traffic / Rush Mode Demonstration', 'उच्च ट्रैफिक / रश मोड अनुकरण')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">{t('Traffic State:', 'ट्रैफिक स्थिति:')}</span>
            <button
              onClick={toggleRushMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                rushMode
                  ? 'bg-amber-500 text-slate-950 shadow-2xs font-extrabold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {rushMode ? t('High Traffic (Active)', 'उच्च ट्रैफिक (चालू)') : t('Normal Traffic (Click to simulate)', 'सामान्य ट्रैफिक (सिमुलेट करें)')}
            </button>
          </div>
        </div>

        {rushMode ? (
          <div className="p-6 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🚦</span>
              <div>
                <h3 className="font-extrabold text-amber-950 text-base">
                  {t('High Traffic Detected — Virtual Queue Activated', 'उच्च ट्रैफिक का पता चला — वर्चुअल कतार सक्रिय')}
                </h3>
                <p className="text-xs text-amber-900 mt-1">
                  {t(
                    'Many users are currently accessing MP Online services for scholarship and recruitment deadlines.',
                    'छात्रवृत्ति और भर्ती की अंतिम तिथि के कारण वर्तमान में अत्यधिक नागरिक पोर्टल का उपयोग कर रहे हैं।'
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/90 p-4 rounded-xl border border-amber-200 text-xs">
              <div>
                <span className="text-slate-500">{t('Your Virtual Token Number:', 'आपका वर्चुअल टोकन क्रमांक:')}</span>
                <div className="font-mono text-2xl font-extrabold text-blue-900 mt-0.5">{virtualToken}</div>
              </div>
              <div>
                <span className="text-slate-500">{t('Estimated Waiting Time:', 'अनुमानित प्रतीक्षा समय:')}</span>
                <div className="text-2xl font-extrabold text-amber-700 mt-0.5">12–15 {t('minutes', 'मिनट')}</div>
              </div>
            </div>

            {/* Queue Progress Simulation Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-600 font-semibold">
                <span>{t('Queue Position: 32 of 140', 'कतार में स्थान: 32 / 140')}</span>
                <span>{t('Please do not refresh the page', 'कृपया पेज रीफ्रेश न करें')}</span>
              </div>
              <div className="w-full bg-amber-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>

            <div className="bg-amber-100/70 p-3 rounded-lg text-xs text-amber-950 space-y-1">
              <div className="font-bold">{t('Why is this happening?', 'यह कतार क्यों लगाई गई है?')}</div>
              <p className="text-[11px] text-amber-900">
                {t(
                  'High demand occurs during university scholarship deadlines and state board counseling. The virtual queue protects server stability and guarantees your session won’t crash midway through payment or form submission.',
                  'अंतिम तिथियों पर सर्वर क्रैश होने से बचाने और फॉर्म व भुगतान को सुरक्षित रखने हेतु वर्चुअल कतार प्रणाली निष्पक्ष प्रवेश सुनिश्चित करती है।'
                )}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={toggleRushMode}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-colors"
              >
                {t('Simulate Queue Clearance (Bypass)', 'कतार पूर्णता सिमुलेट करें')}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>{t('Current Server Status: Green / Normal Access', 'वर्तमान सर्वर स्थिति: सामान्य निर्बाध एक्सेस')}</span>
              </span>
              <p className="text-slate-500">
                {t(
                  'Average response latency: 45ms. No virtual queue required right now.',
                  'औसत प्रतिक्रिया समय: 45ms। वर्तमान में किसी कतार की आवश्यकता नहीं है।'
                )}
              </p>
            </div>

            <button
              onClick={toggleRushMode}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-colors text-xs"
            >
              {t('Test Rush Hour Mode', 'रश आवर मोड टेस्ट करें')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
