import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { SahayakChat } from './components/SahayakChat';
import { MyApplicationsView } from './components/MyApplicationsView';
import { ServicesDiscoveryView } from './components/ServicesDiscoveryView';
import { UtilitiesView } from './components/UtilitiesView';
import { MoreSections } from './components/MoreSections';
import { ApplicationWizard } from './components/ApplicationWizard';
import { StatusAndWhyModals } from './components/StatusAndWhyModals';

const AppContent: React.FC = () => {
  const {
    activeTab,
    wizardOpen,
    wizardServiceId,
    resumeDraftFlag,
    closeWizard,
    t,
  } = useApp();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'sahayak' && <SahayakChat />}
        {activeTab === 'applications' && <MyApplicationsView />}
        {activeTab === 'services' && <ServicesDiscoveryView />}
        {activeTab === 'utilities' && <UtilitiesView />}
        {activeTab === 'more' && <MoreSections />}
      </main>

      {/* Interactive Application Wizard Modal */}
      {wizardOpen && wizardServiceId && (
        <ApplicationWizard
          serviceId={wizardServiceId}
          onClose={closeWizard}
          initialDraftResume={resumeDraftFlag}
        />
      )}

      {/* Shared Modals for Status Explainer, Why Explainer, Payment Verify */}
      <StatusAndWhyModals />

      {/* Simple Accessible Government Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 hidden md:block">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">AI Sahayak (म.प्र. ऑनलाइन लोक सेवा नवाचार)</span>
            <span>•</span>
            <span>{t('Hackathon Prototype for Citizen Service', 'नागरिक सेवा नवाचार प्रोटोटाइप')}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>CM Helpline: 181 (Toll-Free)</span>
            <span>MP Online Desk: 0755-6720200</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
