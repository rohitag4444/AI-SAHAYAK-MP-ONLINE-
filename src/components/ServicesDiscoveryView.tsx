import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Service, ServiceCategory } from '../types';
import {
  Search,
  Grid,
  FileText,
  GraduationCap,
  Award,
  Zap,
  Briefcase,
  HeartPulse,
  Tractor,
  Bus,
  Shield,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-react';

export const ServicesDiscoveryView: React.FC = () => {
  const {
    t,
    lang,
    services,
    startApplication,
    selectedService,
    setSelectedService,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: string; labelEn: string; labelHi: string }[] = [
    { id: 'all', labelEn: 'All Services', labelHi: 'सभी सेवाएं' },
    { id: 'scholarships', labelEn: 'Scholarships', labelHi: 'छात्रवृत्तियां' },
    { id: 'certificates', labelEn: 'Certificates', labelHi: 'प्रमाण पत्र' },
    { id: 'schemes', labelEn: 'Govt Schemes', labelHi: 'शासकीय योजनाएं' },
    { id: 'electricity', labelEn: 'Electricity', labelHi: 'बिजली सेवा' },
    { id: 'agriculture', labelEn: 'Agriculture / Bhulekh', labelHi: 'कृषि व भूलेख' },
    { id: 'citizen', labelEn: 'Citizen & e-KYC', labelHi: 'नागरिक व ई-केवाईसी' },
    { id: 'grievance', labelEn: 'Grievance / 181', labelHi: 'सीएम हेल्पलाइन' },
  ];

  const filteredServices = services.filter(s => {
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(term) ||
      s.nameHi.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term) ||
      s.department.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {t('Public Service Discovery & Catalog', 'नागरिक सेवा संदर्शिका')}
        </h1>
        <p className="text-xs text-slate-500">
          {t(
            'Explore official services with transparent document lists and eligibility rules.',
            'आवश्यक दस्तावेज, पात्रता और चरण-दर-चरण प्रक्रिया के साथ अधिकृत सेवाएं।'
          )}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-300 rounded-xl p-3 flex items-center gap-2 shadow-2xs">
        <Search className="w-5 h-5 text-slate-400 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t(
            'Search by service name, certificate, scheme, or department…',
            'सेवा का नाम, प्रमाण पत्र, छात्रवृत्ति अथवा विभाग के नाम से खोजें…'
          )}
          className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-600 p-1">
            ✕
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-colors ${
              activeCategory === cat.id
                ? 'bg-blue-700 text-white shadow-2xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {lang === 'hi' ? cat.labelHi : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {service.department}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {service.officialFee}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base mt-2">
                {lang === 'hi' ? service.nameHi : service.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                {lang === 'hi' ? service.descriptionHi : service.description}
              </p>

              <div className="mt-4 bg-slate-50 p-3 rounded-lg text-xs space-y-1.5">
                <div>
                  <span className="font-bold text-slate-700">{t('Who it is for: ', 'यह किसके लिए है: ')}</span>
                  <span className="text-slate-600 line-clamp-1">{lang === 'hi' ? service.whoIsItForHi : service.whoIsItFor}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">{t('Required Documents: ', 'आवश्यक दस्तावेज: ')}</span>
                  <span className="text-slate-600 line-clamp-1">
                    {(lang === 'hi' ? service.requiredDocsHi : service.requiredDocs).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedService(service)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2 py-1"
              >
                {t('View Service Details', 'विवरण देखें')}
              </button>

              <button
                onClick={() => startApplication(service.id)}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
              >
                <span>{t('Start Application', 'आवेदन शुरू करें')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 space-y-2">
          <p className="text-sm font-semibold">{t('No services found matching your search.', 'आपकी खोज के अनुसार कोई सेवा नहीं मिली।')}</p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="text-xs text-blue-700 font-bold hover:underline"
          >
            {t('Clear Filters', 'फ़िल्टर हटाएं')}
          </button>
        </div>
      )}

      {/* Detailed Service Modal (Prompt Section 5) */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
                  {selectedService.department}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {lang === 'hi' ? selectedService.nameHi : selectedService.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'hi' ? selectedService.descriptionHi : selectedService.description}
            </p>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-xs">
              <div>
                <div className="font-bold text-slate-800">{t('Who it is for', 'लक्षित नागरिक')}</div>
                <div className="text-slate-600 mt-0.5">{lang === 'hi' ? selectedService.whoIsItForHi : selectedService.whoIsItFor}</div>
              </div>

              <div>
                <div className="font-bold text-slate-800">{t('Basic Eligibility', 'मूल पात्रता नियम')}</div>
                <div className="text-slate-600 mt-0.5">{lang === 'hi' ? selectedService.eligibilityHi : selectedService.eligibility}</div>
              </div>

              <div>
                <div className="font-bold text-slate-800">{t('Required Documents Checklist', 'आवश्यक दस्तावेजों की सूची')}</div>
                <ul className="mt-1 space-y-1 text-slate-600">
                  {(lang === 'hi' ? selectedService.requiredDocsHi : selectedService.requiredDocs).map((d, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500">{t('Estimated Steps:', 'अनुमानित चरण:')}</span>{' '}
                  <strong className="text-slate-800">{selectedService.estimatedSteps} {t('Steps', 'चरण')}</strong>
                </div>
                <div>
                  <span className="text-slate-500">{t('Official Fee:', 'शासकीय शुल्क:')}</span>{' '}
                  <strong className="text-slate-800">{selectedService.officialFee}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50"
              >
                {t('Close', 'बंद करें')}
              </button>
              <button
                onClick={() => {
                  const id = selectedService.id;
                  setSelectedService(null);
                  startApplication(id);
                }}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>{t('Start Application', 'आवेदन शुरू करें')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
