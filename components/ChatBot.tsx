import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, chatData } from '../data/translations';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].chatbot;
  const faqs = chatData[language];

  const [isOpen, setIsOpen] = useState(false);
  // Reset messages when language changes
  const [messages, setMessages] = useState<Message[]>([]);

  // Initialize greeting on mount or language change
  useEffect(() => {
    setMessages([{ role: 'model', text: t.greeting }]);
  }, [language, t.greeting]);

  const [isTyping, setIsTyping] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleQuestionClick = (questionId: string) => {
    const qna = faqs.find(f => f.id === questionId);
    if (!qna) return;

    // Add User Message
    setMessages(prev => [...prev, { role: 'user', text: qna.question }]);
    setIsTyping(true);

    // Simulate Network/Thinking Delay
    setTimeout(() => {
        setMessages(prev => [...prev, { role: 'model', text: qna.answer }]);
        setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Fixed Launcher Button - Bottom Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
        aria-label="Open Chat Assistant"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        
        {/* Tooltip on Hover (Desktop only) */}
        {!isOpen && (
           <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block">
             {t.title}
          </span>
        )}
      </button>

      {/* Chat Window - Fixed Position above button */}
      {isOpen && (
        <div 
            className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[70vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col z-[9999] animate-pop-in overflow-hidden"
        >
          {/* Header */}
          <div className="bg-indigo-600 p-4 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                    🤖
                </div>
                <div>
                    <h3 className="font-bold text-sm">{t.title}</h3>
                    <p className="text-[10px] text-indigo-200">{t.status}</p>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div 
            ref={chatWindowRef}
            className="flex-grow p-4 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950 space-y-4"
          >
             {messages.map((msg, idx) => (
                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div 
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-indigo-600 text-white rounded-br-none' 
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                        }`}
                     >
                         {msg.text}
                     </div>
                 </div>
             ))}
             
             {isTyping && (
                 <div className="flex justify-start">
                     <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm flex items-center space-x-2">
                         <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                         </div>
                         <span className="text-xs text-slate-400">{t.typing}</span>
                     </div>
                 </div>
             )}
          </div>

          {/* Question Chips Area (Footer) */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wider ml-1">{t.suggested}</p>
              
              <div className="flex flex-col gap-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                  {faqs.map((faq) => (
                      <button
                        key={faq.id}
                        onClick={() => !isTyping && handleQuestionClick(faq.id)}
                        disabled={isTyping}
                        className="text-left text-xs bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {faq.question}
                      </button>
                  ))}
              </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;