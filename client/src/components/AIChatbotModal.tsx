import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { X, Sparkles, Send, Bot, User, Sprout, Globe } from 'lucide-react';

interface AIChatbotModalProps {
  onClose: () => void;
}

interface ChatTurn {
  sender: 'ai' | 'user';
  text: string;
}

export const AIChatbotModal: React.FC<AIChatbotModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      sender: 'ai',
      text:
        user?.role === 'FARMER'
          ? language === 'hi'
            ? 'नमस्ते किसान भाई! मैं किसान मित्र AI हूँ। फसल सुरक्षा, जैविक खाद, भंडारण, सरकारी MSP योजनाओं और बेहतर कीमत पाने में मैं आपकी क्या सहायता कर सकता हूँ?'
            : 'Hello Farmer friend! I am Kisan Mitra AI. How can I help you today with pest control, organic composting, crop pricing, or storage tips?'
          : language === 'hi'
          ? 'नमस्ते! मैं किसान इन्वेंटरी का AI सहायक हूँ। ताज़ी मौसमी उपज, खेत से सीधी डिलीवरी, रेसिपी या ऑर्डर सहायता के लिए आप मुझसे कुछ भी पूछ सकते हैं!'
          : 'Welcome! I am FarmAssist AI. Ask me about fresh seasonal vegetables, cooking ideas, delivery details, or direct farm benefits!',
    },
  ]);

  const handleSend = async (customPrompt?: string) => {
    const text = customPrompt || prompt;
    if (!text || !text.trim()) return;

    const userTurn: ChatTurn = { sender: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userTurn]);
    if (!customPrompt) setPrompt('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text.trim(),
          role: user?.role || 'CUSTOMER',
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: 'Sorry, I could not process your request at this moment. Please try again.' },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Network connection issue with AI service.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const samplePrompts =
    user?.role === 'FARMER'
      ? [
          'Organic pest control for tomatoes',
          'How to prevent onion post-harvest rotting?',
          'What is the government MSP for wheat?',
        ]
      : [
          'How does direct farm delivery work?',
          'What payment methods are supported?',
          'Can I chat directly with the grower?',
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full h-[600px] shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        {/* Top Header */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-green-600 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm leading-tight">
                  Kisan Mitra AI (किसान मित्र)
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/30 uppercase">
                  {language}
                </span>
              </div>
              <p className="text-[10px] opacity-90">Powered by Agricultural Knowledge Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat turns */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/50 dark:bg-stone-950/40">
          {messages.map((m, idx) => {
            const isAI = m.sender === 'ai';

            return (
              <div
                key={idx}
                className={`flex gap-2.5 ${isAI ? 'items-start' : 'items-end flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                    isAI
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isAI ? <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> : <User className="w-3.5 h-3.5" />}
                </div>
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    isAI
                      ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200/80 dark:border-stone-700 shadow-sm'
                      : 'bg-emerald-600 text-white rounded-br-none shadow-sm shadow-emerald-600/20'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-stone-400 text-xs p-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Kisan Mitra is thinking...</span>
            </div>
          )}
        </div>

        {/* Suggestion Chips */}
        <div className="px-3 py-2 bg-stone-100 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {samplePrompts.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="shrink-0 px-2.5 py-1 bg-white dark:bg-stone-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-full text-[10px] font-medium border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-200 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Kisan Mitra AI in English or Hindi..."
            className="flex-1 px-3.5 py-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !prompt.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
