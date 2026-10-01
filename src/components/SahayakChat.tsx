import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { askSahayak, AssistantResponse } from '../services/sahayakBrain';
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Service } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  matchedServices?: Service[];
  suggestedActions?: AssistantResponse['suggestedActions'];
  source?: 'gemini' | 'local_verified_knowledge';
}

export const SahayakChat: React.FC = () => {
  const {
    lang,
    t,
    lowInternetMode,
    startApplication,
    setSelectedService,
    openStatusExplainer,
    openWhyExplainer,
    openPaymentVerify,
    setActiveTab,
    applications,
    initialChatPrompt,
    clearInitialChatPrompt,
  } = useApp();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text:
        lang === 'hi'
          ? `नमस्ते! मैं "एआई सहायक" हूँ — मध्य प्रदेश शासन की नागरिक सेवाओं के लिए आपका मित्रवत मार्गदर्शक।\n\nआप मुझसे किसी भी सेवा, छात्रवृत्ति, बिजली समस्या, या अपने लंबित आवेदन (जैसे MP-2026-10482) के विषय में पूछ सकते हैं। आप बोल भी सकते हैं!`
          : `Hello! I am "AI Sahayak" — your simple, citizen-centric guide to MP Online public services.\n\nTell me what you need, ask about scholarships, check electricity outages, or understand your pending application status (e.g. MP-2026-10482).`,
      timestamp: 'Just now',
      suggestedActions: [
        {
          label: 'Apply for Scholarship',
          labelHi: 'छात्रवृत्ति के लिए आवेदन',
          actionType: 'open_wizard',
          payload: 'mp-scholarship-postmatric',
        },
        {
          label: 'Why is my application pending?',
          labelHi: 'मेरा आवेदन लंबित क्यों है?',
          actionType: 'open_why',
          payload: 'MP-2026-10482',
        },
      ],
      source: 'local_verified_knowledge',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle passed initial prompt from Home
  useEffect(() => {
    if (initialChatPrompt) {
      handleSendMessage(initialChatPrompt);
      clearInitialChatPrompt();
    }
  }, [initialChatPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsgId = 'user-' + Date.now();
    const newMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await askSahayak(query, lang, undefined, lowInternetMode);

      const assistantMsg: Message = {
        id: 'assistant-' + Date.now(),
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedServices: response.matchedServices,
        suggestedActions: response.suggestedActions,
        source: response.source,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: 'assistant-' + Date.now(),
        sender: 'assistant',
        text:
          lang === 'hi'
            ? 'एआई सहायता वर्तमान में अनुपलब्ध है। आप उपलब्ध सेवा सूची में से सीधे चयन कर सकते हैं।'
            : 'AI assistance is temporarily unavailable. You can continue using the available service options.',
        timestamp: 'Just now',
        source: 'local_verified_knowledge',
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceRecord = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsRecording(true);
        recognition.onresult = (event: any) => {
          const spoken = event.results[0][0].transcript;
          setIsRecording(false);
          handleSendMessage(spoken);
        };
        recognition.onerror = () => {
          setIsRecording(false);
          const fallback = lang === 'hi' ? 'मेरा आवेदन लंबित क्यों है?' : 'Why is my application pending?';
          handleSendMessage(fallback);
        };
        recognition.onend = () => setIsRecording(false);
        recognition.start();
      } catch {
        setIsRecording(false);
        const fallback = lang === 'hi' ? 'मुझे छात्रवृत्ति चाहिए' : 'I want to apply for a scholarship';
        handleSendMessage(fallback);
      }
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const sample = lang === 'hi' ? 'मेरा आवेदन लंबित क्यों है?' : 'Why is my application pending?';
        handleSendMessage(sample);
      }, 1200);
    }
  };

  const handleActionClick = (action: NonNullable<AssistantResponse['suggestedActions']>[0]) => {
    if (action.actionType === 'open_wizard') {
      startApplication(action.payload || 'mp-scholarship-postmatric');
    } else if (action.actionType === 'open_service') {
      const s = action.payload ? { id: action.payload } : undefined;
      if (s) {
        startApplication(action.payload);
      } else {
        setActiveTab('services');
      }
    } else if (action.actionType === 'open_status') {
      const app = applications.find(a => a.id === action.payload) || applications[0];
      if (app) openStatusExplainer(app);
    } else if (action.actionType === 'open_why') {
      const app = applications.find(a => a.id === action.payload) || applications[0];
      if (app) openWhyExplainer(app);
    } else if (action.actionType === 'open_electricity') {
      setActiveTab('utilities');
    } else if (action.actionType === 'open_payment_verify') {
      openPaymentVerify(action.payload || 'MP-2026-11204');
    }
  };

  const suggestedQuestions = [
    { en: 'What documents do I need?', hi: 'मुझे कौन से दस्तावेज चाहिए?' },
    { en: 'How do I fill this form?', hi: 'यह फॉर्म कैसे भरना है?' },
    { en: 'Why is my application pending?', hi: 'मेरा आवेदन लंबित क्यों है?' },
    { en: 'Check my application', hi: 'मेरा आवेदन जांचें' },
    { en: 'What should I do next?', hi: 'मुझे आगे क्या करना चाहिए?' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 flex flex-col h-[calc(100vh-140px)] min-h-[550px]">
      {/* Assistant Header */}
      <div className="bg-white border border-slate-200 rounded-t-xl px-5 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-base">AI Sahayak Assistant</h2>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-500">
              {t('Speaks Simple English & Hindi • Voice Enabled', 'सरल हिंदी व अंग्रेजी में उपलब्ध • वॉइस सपोर्ट')}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome-' + Date.now(),
                sender: 'assistant',
                text:
                  lang === 'hi'
                    ? 'बातचीत रीसेट कर दी गई है। आप क्या पूछना चाहते हैं?'
                    : 'Chat has been reset. What would you like assistance with?',
                timestamp: 'Just now',
              },
            ])
          }
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-xs flex items-center gap-1"
          title="Reset Conversation"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">{t('Reset', 'रीसेट')}</span>
        </button>
      </div>

      {/* Suggested Questions Quick Bar */}
      <div className="bg-slate-100/90 border-x border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-500 shrink-0">
          {t('Quick Questions:', 'त्वरित प्रश्न:')}
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(lang === 'hi' ? q.hi : q.en)}
            className="text-xs shrink-0 px-3 py-1 bg-white hover:bg-blue-50 hover:text-blue-800 text-slate-700 rounded-full border border-slate-200 font-medium transition-colors"
          >
            {lang === 'hi' ? q.hi : q.en}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 border-x border-slate-200 p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                <Bot className="w-5 h-5" />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-700 text-white rounded-tr-xs'
                    : 'bg-white text-slate-900 border border-slate-200 rounded-tl-xs'
                }`}
              >
                {msg.text}
              </div>

              {/* Matched Service Card (Section 4 Example: Scholarship Application card) */}
              {msg.matchedServices && msg.matchedServices.length > 0 && (
                <div className="space-y-2 pt-1">
                  {msg.matchedServices.map(srv => (
                    <div
                      key={srv.id}
                      className="bg-white border-2 border-blue-200 rounded-xl p-3.5 shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded">
                            {srv.department}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm mt-1">
                            {lang === 'hi' ? srv.nameHi : srv.name}
                          </h4>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg space-y-1">
                        <div>
                          <span className="font-bold text-slate-700">{t('Eligibility: ', 'पात्रता: ')}</span>
                          {lang === 'hi' ? srv.eligibilityHi : srv.eligibility}
                        </div>
                        <div>
                          <span className="font-bold text-slate-700">{t('Documents: ', 'दस्तावेज: ')}</span>
                          {(lang === 'hi' ? srv.requiredDocsHi : srv.requiredDocs).join(', ')}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setSelectedService(srv)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors"
                        >
                          {t('View Service Details', 'विवरण देखें')}
                        </button>
                        <button
                          onClick={() => startApplication(srv.id)}
                          className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span>{t('Start Application', 'आवेदन शुरू करें')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contextual Action Buttons */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {msg.suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleActionClick(action)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                      <span>{lang === 'hi' ? action.labelHi : action.label}</span>
                    </button>
                  ))}
                </div>
              )}

              <div
                className={`text-[10px] text-slate-400 ${
                  msg.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-slate-500 text-xs py-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span>{t('AI Sahayak is checking official guidelines…', 'एआई सहायक अधिकृत जानकारी जांच रहा है…')}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <div className="bg-white border border-slate-200 rounded-b-xl p-3 shadow-sm">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleVoiceRecord}
            className={`p-3 rounded-xl transition-all ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Speak into microphone"
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-blue-700" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              isRecording
                ? t('Listening… speak now in Hindi or English', 'सुन रहा हूँ… बोलिए…')
                : t(
                    'Type your question (e.g. "I want to apply for a scholarship")',
                    'अपना प्रश्न लिखें (जैसे: "मुझे छात्रवृत्ति के लिए आवेदन करना है")'
                  )
            }
            className="flex-1 bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden transition-colors"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t('Send', 'भेजें')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
