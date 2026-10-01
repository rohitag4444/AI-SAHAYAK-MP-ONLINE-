import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  ApplicationItem,
  ApplicationDraft,
  Service,
  AlertItem,
  GrievanceTicket,
} from '../types';
import {
  MOCK_APPLICATIONS,
  MOCK_SAVED_DRAFTS,
  MOCK_ALERTS,
  MOCK_SERVICES,
} from '../data/mockData';

export type NavTab = 'home' | 'sahayak' | 'applications' | 'services' | 'utilities' | 'more';

interface AppContextType {
  // Localization & Accessibility
  lang: Language;
  setLang: (l: Language) => void;
  toggleLang: () => void;
  t: (en: string, hi: string) => string;
  largeText: boolean;
  toggleLargeText: () => void;

  // System Modes (Pillar 4: Smart Access & Section 17: Low Internet)
  lowInternetMode: boolean;
  toggleLowInternetMode: () => void;
  rushMode: boolean;
  toggleRushMode: () => void;
  virtualToken: string;
  estimatedWaitMinutes: number;

  // Navigation
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Services
  services: Service[];
  selectedService: Service | null;
  setSelectedService: (s: Service | null) => void;

  // Application Wizard
  wizardOpen: boolean;
  wizardServiceId: string | null;
  resumeDraftFlag: boolean;
  startApplication: (serviceId: string, resume?: boolean) => void;
  closeWizard: () => void;

  // Applications & Persistence (Pillar 2 & Save/Resume)
  applications: ApplicationItem[];
  savedDrafts: ApplicationDraft[];
  saveDraft: (draft: ApplicationDraft) => void;
  submitApplication: (app: ApplicationItem) => void;
  updateApplicationPayment: (appId: string, status: 'SUCCESS' | 'PENDING' | 'FAILED') => void;

  // Status & Explainer Modals (Pillar 2 & Why? Explainer)
  statusExplainerApp: ApplicationItem | null;
  openStatusExplainer: (app: ApplicationItem) => void;
  closeStatusExplainer: () => void;

  whyExplainerApp: ApplicationItem | null;
  openWhyExplainer: (app: ApplicationItem) => void;
  closeWhyExplainer: () => void;

  // Payment Verification Tool (Pillar 3: Payment Protection)
  paymentVerifyOpen: boolean;
  paymentVerifyAppId: string | null;
  openPaymentVerify: (appId?: string) => void;
  closePaymentVerify: () => void;

  // Alerts
  alerts: AlertItem[];
  markAlertRead: (id: string) => void;
  unreadAlertsCount: number;

  // Grievance / Help
  grievances: GrievanceTicket[];
  addGrievance: (ticket: GrievanceTicket) => void;

  // Sahayak direct prompt trigger
  initialChatPrompt: string | null;
  triggerChatWithPrompt: (prompt: string) => void;
  clearInitialChatPrompt: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');
  const [largeText, setLargeText] = useState<boolean>(false);
  const [lowInternetMode, setLowInternetMode] = useState<boolean>(false);
  const [rushMode, setRushMode] = useState<boolean>(false);
  const [virtualToken] = useState<string>('A-1842');
  const [estimatedWaitMinutes] = useState<number>(14);

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [services] = useState<Service[]>(MOCK_SERVICES);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [wizardOpen, setWizardOpen] = useState<boolean>(false);
  const [wizardServiceId, setWizardServiceId] = useState<string | null>(null);
  const [resumeDraftFlag, setResumeDraftFlag] = useState<boolean>(false);

  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    const saved = localStorage.getItem('ai_sahayak_applications');
    return saved ? JSON.parse(saved) : MOCK_APPLICATIONS;
  });

  const [savedDrafts, setSavedDrafts] = useState<ApplicationDraft[]>(() => {
    const saved = localStorage.getItem('ai_sahayak_saved_drafts');
    return saved ? JSON.parse(saved) : MOCK_SAVED_DRAFTS;
  });

  const [statusExplainerApp, setStatusExplainerApp] = useState<ApplicationItem | null>(null);
  const [whyExplainerApp, setWhyExplainerApp] = useState<ApplicationItem | null>(null);

  const [paymentVerifyOpen, setPaymentVerifyOpen] = useState<boolean>(false);
  const [paymentVerifyAppId, setPaymentVerifyAppId] = useState<string | null>(null);

  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);

  const [grievances, setGrievances] = useState<GrievanceTicket[]>([
    {
      id: 'GRV-2026-4821',
      category: 'Scholarship / Payment',
      subject: 'Portal debit recorded but acknowledgment pending',
      description: 'Fee of ₹75 deducted from UPI ID rohit@oksbi on 24 Sep. System status showed pending.',
      status: 'Under Investigation',
      createdAt: '24 Sep 2026',
      resolutionNote: 'Reconciliation batch scheduled; will sync automatically.',
    },
  ]);

  const [initialChatPrompt, setInitialChatPrompt] = useState<string | null>(null);

  // Sync state to localStorage for genuine persistence
  useEffect(() => {
    localStorage.setItem('ai_sahayak_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('ai_sahayak_saved_drafts', JSON.stringify(savedDrafts));
  }, [savedDrafts]);

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (en: string, hi: string) => {
    return lang === 'hi' ? hi : en;
  };

  const toggleLargeText = () => setLargeText(prev => !prev);
  const toggleLowInternetMode = () => setLowInternetMode(prev => !prev);
  const toggleRushMode = () => setRushMode(prev => !prev);

  const startApplication = (serviceId: string, resume: boolean = false) => {
    setWizardServiceId(serviceId);
    setResumeDraftFlag(resume);
    setWizardOpen(true);
  };

  const closeWizard = () => {
    setWizardOpen(false);
    setWizardServiceId(null);
    setResumeDraftFlag(false);
  };

  const saveDraft = (draft: ApplicationDraft) => {
    setSavedDrafts(prev => {
      const filtered = prev.filter(d => d.serviceId !== draft.serviceId);
      return [draft, ...filtered];
    });
  };

  const submitApplication = (newApp: ApplicationItem) => {
    setApplications(prev => [newApp, ...prev.filter(a => a.id !== newApp.id)]);
    // Remove completed draft if exists
    setSavedDrafts(prev => prev.filter(d => d.serviceId !== newApp.serviceId));
  };

  const updateApplicationPayment = (appId: string, status: 'SUCCESS' | 'PENDING' | 'FAILED') => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          const updatedStatus = status === 'SUCCESS' ? 'UNDER_VERIFICATION' : 'PAYMENT_PENDING';
          const updatedTimeline = [...app.timeline];
          if (status === 'SUCCESS') {
            const payStepIndex = updatedTimeline.findIndex(s => s.title.toLowerCase().includes('payment'));
            if (payStepIndex >= 0) {
              updatedTimeline[payStepIndex].status = 'completed';
              updatedTimeline[payStepIndex].desc = 'Payment confirmed and reconciled with treasury gateway.';
            }
          }
          return {
            ...app,
            paymentStatus: status,
            status: updatedStatus,
            statusText: status === 'SUCCESS' ? 'Under Verification' : 'Payment Pending',
            statusTextHi: status === 'SUCCESS' ? 'सत्यापन प्रक्रियाधीन' : 'भुगतान प्रतीक्षित',
            lastUpdated: 'Just now',
            timeline: updatedTimeline,
            whyReason: status === 'SUCCESS'
              ? 'Payment verified. Application moved to Tehsildar / Nodal officer verification desk.'
              : 'Payment verification still pending from bank aggregator.',
            whyReasonHi: status === 'SUCCESS'
              ? 'भुगतान सत्यापित हो चुका है। आवेदन अग्रिम जांच हेतु प्रेषित कर दिया गया है।'
              : 'बैंक गेटवे से भुगतान सत्यापन अभी प्रतीक्षित है।',
          };
        }
        return app;
      })
    );
  };

  const openStatusExplainer = (app: ApplicationItem) => {
    setStatusExplainerApp(app);
  };

  const closeStatusExplainer = () => {
    setStatusExplainerApp(null);
  };

  const openWhyExplainer = (app: ApplicationItem) => {
    setWhyExplainerApp(app);
  };

  const closeWhyExplainer = () => {
    setWhyExplainerApp(null);
  };

  const openPaymentVerify = (appId?: string) => {
    setPaymentVerifyAppId(appId || applications.find(a => a.paymentStatus === 'PENDING')?.id || 'MP-2026-11204');
    setPaymentVerifyOpen(true);
  };

  const closePaymentVerify = () => {
    setPaymentVerifyOpen(false);
    setPaymentVerifyAppId(null);
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));
  };

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  const addGrievance = (ticket: GrievanceTicket) => {
    setGrievances(prev => [ticket, ...prev]);
  };

  const triggerChatWithPrompt = (prompt: string) => {
    setInitialChatPrompt(prompt);
    setActiveTab('sahayak');
  };

  const clearInitialChatPrompt = () => {
    setInitialChatPrompt(null);
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        largeText,
        toggleLargeText,
        lowInternetMode,
        toggleLowInternetMode,
        rushMode,
        toggleRushMode,
        virtualToken,
        estimatedWaitMinutes,
        activeTab,
        setActiveTab,
        services,
        selectedService,
        setSelectedService,
        wizardOpen,
        wizardServiceId,
        resumeDraftFlag,
        startApplication,
        closeWizard,
        applications,
        savedDrafts,
        saveDraft,
        submitApplication,
        updateApplicationPayment,
        statusExplainerApp,
        openStatusExplainer,
        closeStatusExplainer,
        whyExplainerApp,
        openWhyExplainer,
        closeWhyExplainer,
        paymentVerifyOpen,
        paymentVerifyAppId,
        openPaymentVerify,
        closePaymentVerify,
        alerts,
        markAlertRead,
        unreadAlertsCount,
        grievances,
        addGrievance,
        initialChatPrompt,
        triggerChatWithPrompt,
        clearInitialChatPrompt,
      }}
    >
      <div className={`${largeText ? 'text-lg' : 'text-base'} min-h-screen flex flex-col font-sans transition-colors duration-200`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
