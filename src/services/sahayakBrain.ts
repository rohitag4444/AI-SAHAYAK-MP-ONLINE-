import { Language, Service } from '../types';
import { MOCK_SERVICES } from '../data/mockData';

export interface AssistantResponse {
  text: string;
  suggestedActions?: {
    label: string;
    labelHi: string;
    actionType: 'open_service' | 'open_status' | 'open_why' | 'open_electricity' | 'open_payment_verify' | 'open_wizard';
    payload?: any;
  }[];
  matchedServices?: Service[];
  source: 'gemini' | 'local_verified_knowledge';
}

export async function askSahayak(
  userPrompt: string,
  lang: Language = 'en',
  context?: string,
  isLowInternet: boolean = false
): Promise<AssistantResponse> {
  const cleanPrompt = userPrompt.trim();
  const lower = cleanPrompt.toLowerCase();

  // If in low internet mode, skip external network call to save data and ensure instant response
  if (!isLowInternet) {
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: cleanPrompt,
          language: lang,
          context: context || 'User is interacting with AI Sahayak on MP Online portal.',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply && !data.fallback) {
          // Detect relevant matched services from prompt
          const matched = findRelevantServices(lower);
          return {
            text: data.reply,
            source: 'gemini',
            matchedServices: matched.length > 0 ? matched : undefined,
            suggestedActions: generateContextualActions(lower),
          };
        }
      }
    } catch {
      // Fall through smoothly to verified local intent engine
    }
  }

  // Local Intent Engine (Rule-grounded, zero hallucinations, bilingual)
  return resolveLocalKnowledge(cleanPrompt, lower, lang);
}

function findRelevantServices(query: string): Service[] {
  return MOCK_SERVICES.filter(service => {
    const textToSearch = `${service.name} ${service.nameHi} ${service.description} ${service.descriptionHi} ${service.category}`.toLowerCase();
    const words = query.split(/\s+/).filter(w => w.length > 2);
    return words.some(w => textToSearch.includes(w));
  }).slice(0, 3);
}

function generateContextualActions(query: string) {
  const actions: AssistantResponse['suggestedActions'] = [];

  if (query.includes('scholarship') || query.includes('छात्रवृत्ति') || query.includes('post matric') || query.includes('matric')) {
    actions.push({
      label: 'View Scholarship Service',
      labelHi: 'छात्रवृत्ति सेवा देखें',
      actionType: 'open_service',
      payload: 'mp-scholarship-postmatric',
    });
    actions.push({
      label: 'Start Application',
      labelHi: 'आवेदन शुरू करें',
      actionType: 'open_wizard',
      payload: 'mp-scholarship-postmatric',
    });
  } else if (query.includes('pending') || query.includes('status') || query.includes('लंबित') || query.includes('स्थिति') || query.includes('10482')) {
    actions.push({
      label: 'Explain Application MP-2026-10482',
      labelHi: 'आवेदन MP-2026-10482 समझें',
      actionType: 'open_status',
      payload: 'MP-2026-10482',
    });
    actions.push({
      label: 'Why is it pending?',
      labelHi: 'यह लंबित क्यों है?',
      actionType: 'open_why',
      payload: 'MP-2026-10482',
    });
  } else if (query.includes('electricity') || query.includes('bijli') || query.includes('बिजली') || query.includes('light') || query.includes('cut')) {
    actions.push({
      label: 'Check Electricity Outage',
      labelHi: 'बिजली कटौती की स्थिति देखें',
      actionType: 'open_electricity',
    });
  } else if (query.includes('payment') || query.includes('paisa') || query.includes('पैसा') || query.includes('रुपये') || query.includes('fee')) {
    actions.push({
      label: 'Verify Payment Status',
      labelHi: 'भुगतान स्थिति सत्यापित करें',
      actionType: 'open_payment_verify',
    });
  }

  return actions.length > 0 ? actions : undefined;
}

function resolveLocalKnowledge(raw: string, query: string, lang: Language): AssistantResponse {
  // Scenario 1: Scholarship Application intent
  if (
    query.includes('scholarship') ||
    query.includes('छात्रवृत्ति') ||
    query.includes('padhai') ||
    query.includes('college fee') ||
    query.includes('post-matric') ||
    query.includes('post matric')
  ) {
    const isHi = lang === 'hi' || query.includes('छात्रवृत्ति') || query.includes('चाहिए');
    const text = isHi
      ? `मैं आपकी सहायता कर सकता हूँ। आइए आपकी आवश्यकता के अनुसार उचित छात्रवृत्ति सेवा देखते हैं।\n\n• म.प्र. पोस्ट-मैट्रिक छात्रवृत्ति योजना के अंतर्गत कॉलेज विद्यार्थियों को ट्यूशन फीस व निर्वाह भत्ता मिलता है।\n• आवश्यक दस्तावेज: आधार कार्ड, समग्र आईडी, आय प्रमाण पत्र, गत वर्ष की अंकसूची और बैंक पासबुक।\n• पात्रता: म.प्र. का मूल निवासी, एससी/एसटी/ओबीसी वर्ग, एवं परिवार की वार्षिक आय ₹3,00,000 से कम।`
      : `I can help you with that. Let’s find the scholarship service that matches your requirement.\n\n• The MP Post-Matric Scholarship Scheme provides course fee support and maintenance allowance for college students.\n• Required Documents: Aadhaar Card, Samagra ID, Income Certificate, Previous Marksheet, and Bank Account Details.\n• Basic Eligibility: MP Domicile, SC/ST/OBC category, family annual income under ₹3,00,000.`;

    const scholarshipService = MOCK_SERVICES.find(s => s.id === 'mp-scholarship-postmatric');

    return {
      text,
      source: 'local_verified_knowledge',
      matchedServices: scholarshipService ? [scholarshipService] : undefined,
      suggestedActions: [
        {
          label: 'Start Scholarship Application',
          labelHi: 'छात्रवृत्ति आवेदन शुरू करें',
          actionType: 'open_wizard',
          payload: 'mp-scholarship-postmatric',
        },
        {
          label: 'View Detailed Service Card',
          labelHi: 'विस्तृत सेवा कार्ड देखें',
          actionType: 'open_service',
          payload: 'mp-scholarship-postmatric',
        },
      ],
    };
  }

  // Scenario 2: Pending Application / Status explanation intent (e.g., "Mera application pending hai, iska kya matlab hai?")
  if (
    query.includes('pending') ||
    query.includes('लंबित') ||
    query.includes('matlab') ||
    query.includes('status') ||
    query.includes('ruka') ||
    query.includes('verification') ||
    query.includes('10482')
  ) {
    const isHi = lang === 'hi' || query.includes('मेरा') || query.includes('लंबित') || query.includes('मतलब');
    const text = isHi
      ? `आपके आवेदन (MP-2026-10482) की स्थिति वर्तमान में "सत्यापन प्रक्रियाधीन (Under Verification)" है।\n\n• इसका अर्थ: आपके द्वारा अपलोड किए गए दस्तावेजों की कॉलेज नोडल अधिकारी द्वारा जांच की जा रही है।\n• आपके लिए निर्देश: वर्तमान में आपकी ओर से किसी भी कार्यवाही की आवश्यकता नहीं है।\n• अगला कदम: जांच पूर्ण होने पर आपको अधिकृत एसएमएस संदेश प्राप्त होगा।`
      : `Your application (MP-2026-10482) is currently under verification.\n\n• What this means: Your application and uploaded documents are being cross-verified by the College Nodal Officer.\n• Action required: Based on official status records, no immediate action is required from your side right now.\n• What happens next: You will receive an official SMS update once the nodal authority confirms the documents.`;

    return {
      text,
      source: 'local_verified_knowledge',
      suggestedActions: [
        {
          label: 'View Application Timeline',
          labelHi: 'आवेदन टाइमलाइन देखें',
          actionType: 'open_status',
          payload: 'MP-2026-10482',
        },
        {
          label: 'Why is it in verification?',
          labelHi: 'सत्यापन में क्यों रुका है?',
          actionType: 'open_why',
          payload: 'MP-2026-10482',
        },
      ],
    };
  }

  // Scenario 3: Electricity issue / Bijli chali gayi
  if (
    query.includes('electricity') ||
    query.includes('bijli') ||
    query.includes('बिजली') ||
    query.includes('light') ||
    query.includes('power cut') ||
    query.includes('outage')
  ) {
    const isHi = lang === 'hi' || query.includes('बिजली') || query.includes('चली गई') || query.includes('कटौती');
    const text = isHi
      ? `बिजली कटौती की स्थिति जानने के लिए कृपया अपने जिले और इलाके का चयन करें।\n\n• आधिकारिक प्रणाली द्वारा क्षेत्रीय सबस्टेशन की वास्तविक स्थिति जांची जा सकती है।\n• यदि आधिकारिक बहाली समय (ETA) उपलब्ध होगा, केवल तभी समय दर्शाया जाएगा। हम कोई भी अनुमानित समय स्वयं नहीं बनाते।\n• आप सीधे 1-क्लिक में बिजली शिकायत भी दर्ज कर सकते हैं।`
      : `To check power outage status, please select your city and locality in the Electricity Utility.\n\n• The system checks live feeder and substation logs from the discom.\n• If an official restoration ETA exists in the utility records, it will be shown clearly. We never invent restoration estimates.\n• You can also register a 1-click power complaint immediately.`;

    return {
      text,
      source: 'local_verified_knowledge',
      suggestedActions: [
        {
          label: 'Open Electricity Outage Utility',
          labelHi: 'बिजली कटौती समाधान खोलें',
          actionType: 'open_electricity',
        },
      ],
    };
  }

  // Scenario 4: Payment debited / Pending / Payment protection
  if (
    query.includes('payment') ||
    query.includes('paisa') ||
    query.includes('kat gaya') ||
    query.includes('पैसा') ||
    query.includes('कट गया') ||
    query.includes('debit') ||
    query.includes('failed') ||
    query.includes('rupay')
  ) {
    const isHi = lang === 'hi' || query.includes('पैसा') || query.includes('कट गया');
    const text = isHi
      ? `महत्वपूर्ण सुरक्षा सूचना: यदि आपके बैंक खाते से राशि कट गई है लेकिन आवेदन पर स्थिति 'Payment Pending' दिख रही है, तो कृपया दोबारा भुगतान न करें!\n\n• बैंक गेटवे और पोर्टल के मध्य समाधान में कभी-कभी 15–30 मिनट का समय लगता है।\n• आप "भुगतान सत्यापन (Verify Payment)" टूल से बैंक ट्रांजेक्शन आईडी दर्ज कर सीधे स्थिति का मिलान कर सकते हैं।`
      : `Important Safety Advisory: If money has been debited from your account but the portal shows 'Payment Pending', please do NOT make another payment!\n\n• Bank gateway reconciliations can occasionally take 15–30 minutes to synchronize with government servers.\n• Use the "Verify Payment" reconciliation tool to check the gateway transaction and update your application status safely.`;

    return {
      text,
      source: 'local_verified_knowledge',
      suggestedActions: [
        {
          label: 'Verify Payment Now',
          labelHi: 'भुगतान अभी सत्यापित करें',
          actionType: 'open_payment_verify',
        },
      ],
    };
  }

  // Scenario 5: Document requirements / mismatch
  if (
    query.includes('document') ||
    query.includes('dastawez') ||
    query.includes('दस्तावेज') ||
    query.includes('kagaz') ||
    query.includes('aadhaar') ||
    query.includes('income certificate') ||
    query.includes('mismatch')
  ) {
    const isHi = lang === 'hi' || query.includes('दस्तावेज') || query.includes('कागजात');
    const text = isHi
      ? `अधिकांश शासकीय सेवाओं (छात्रवृत्ति, प्रमाण पत्र, लाड़ली बहना) के लिए मुख्य रूप से निम्न दस्तावेजों की आवश्यकता होती है:\n\n1. आधार कार्ड (मोबाइल नंबर व बैंक से लिंक)\n2. 9 अंकों की सदस्य समग्र आईडी (e-KYC पूर्ण)\n3. नवीन आय प्रमाण पत्र (वित्तीय वर्ष 2025-26)\n4. मूल निवास प्रमाण पत्र\n5. बैंक पासबुक जिसमें डीबीटी सक्रिय हो\n\nस्मार्ट टिप: फॉर्म भरते समय हमारा "स्मार्ट डॉक्यूमेंट चेकर" नाम और स्पष्टता की स्वतः जांच करता है ताकि आवेदन निरस्त न हो।`
      : `For most public services (scholarships, certificates, welfare schemes), the standard essential documents are:\n\n1. Aadhaar Card (linked to active mobile number and bank account)\n2. 9-digit Samagra Member ID (e-KYC verified)\n3. Current Income Certificate (issued for current financial year)\n4. MP Domicile Certificate (Mool Niwas)\n5. Bank Passbook / DBT enabled account\n\nSmart Tip: Our Smart Document Checker inspects document readability and verifies spelling matches before final submission to avoid rejection.`;

    return {
      text,
      source: 'local_verified_knowledge',
      suggestedActions: [
        {
          label: 'Apply for Income Certificate',
          labelHi: 'आय प्रमाण पत्र हेतु आवेदन',
          actionType: 'open_service',
          payload: 'mp-income-certificate',
        },
        {
          label: 'Apply for Domicile Certificate',
          labelHi: 'मूल निवास प्रमाण पत्र हेतु आवेदन',
          actionType: 'open_service',
          payload: 'mp-domicile-certificate',
        },
      ],
    };
  }

  // Scenario 6: Ladli Behna or Women Welfare
  if (query.includes('ladli') || query.includes('behna') || query.includes('लाड़ली') || query.includes('बहना') || query.includes('women')) {
    const isHi = lang === 'hi' || query.includes('लाड़ली') || query.includes('बहना');
    const text = isHi
      ? `मुख्यमंत्री लाड़ली बहना योजना के अंतर्गत पात्र महिलाओं को प्रतिमाह ₹1,250 की आर्थिक सहायता सीधे बैंक खाते में दी जाती है।\n\n• पात्रता: 21 से 60 वर्ष की विवाहित महिलाएं, म.प्र. की मूल निवासी, परिवार की आय ₹2.5 लाख से कम।\n• आवश्यक: समग्र ई-केवाईसी पूर्ण होना अनिवार्य है और बैंक खाता आधार डीबीटी सक्षम होना चाहिए।`
      : `Under Mukhyamantri Ladli Behna Yojana, eligible women receive ₹1,250 monthly via Direct Benefit Transfer.\n\n• Eligibility: Married women aged 21–60, resident of MP, family annual income under ₹2.5 Lakhs.\n• Requirements: Samagra e-KYC must be completed and bank account must have Aadhaar DBT enabled.`;

    const s = MOCK_SERVICES.find(srv => srv.id === 'mp-ladli-behna');
    return {
      text,
      source: 'local_verified_knowledge',
      matchedServices: s ? [s] : undefined,
      suggestedActions: [
        {
          label: 'View Ladli Behna Details',
          labelHi: 'लाड़ली बहना विवरण देखें',
          actionType: 'open_service',
          payload: 'mp-ladli-behna',
        },
      ],
    };
  }

  // Default fallback if unverified query:
  const isHi = lang === 'hi';
  const text = isHi
    ? `मैंने आपके प्रश्न को समझा। मैं इस उपलब्ध आधिकारिक डेटा से इसकी सीधी पुष्टि नहीं कर सका। कृपया अधिकृत सेवा विवरण अथवा सहायता विकल्पों की सूची देखें।\n\nआप मुझसे छात्रवृत्ति, बिजली समस्या, आवेदन स्थिति (जैसे MP-2026-10482) या भुगतान के विषय में सीधे पूछ सकते हैं।`
    : `I could not verify this information from the available official data. Please check the official service information or choose from the suggested services below.\n\nYou can ask me directly about scholarships, electricity outages, application status (e.g. MP-2026-10482), or payment reconciliation.`;

  return {
    text,
    source: 'local_verified_knowledge',
    matchedServices: MOCK_SERVICES.slice(0, 2),
    suggestedActions: [
      {
        label: 'View All Available Services',
        labelHi: 'सभी उपलब्ध सेवाएं देखें',
        actionType: 'open_service',
      },
      {
        label: 'Check My Applications',
        labelHi: 'मेरे आवेदन जांचें',
        actionType: 'open_status',
      },
    ],
  };
}
