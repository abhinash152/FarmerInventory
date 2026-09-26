import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Package,
  Scale,
  CheckCircle2,
  ArrowRight,
  Loader2,
  PlusCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

interface VoiceActionData {
  product_name: string;
  category: string;
  stock_quantity: number;
  unit: string;
  price_per_unit: number;
  low_stock_threshold?: number;
  storage_condition?: string;
  harvest_date?: string;
}

interface ChatTurn {
  sender: 'ai' | 'user';
  text: string;
  action?: {
    type: 'ADD_PRODUCT' | 'NAVIGATE' | 'OPEN_MANDI';
    data?: VoiceActionData;
    target?: string;
    message?: Record<string, string>;
  };
  isActionExecuted?: boolean;
}

interface AIChatbotModalProps {
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
  onOpenMandi?: () => void;
  autoListen?: boolean;
}

export const AIChatbotModal: React.FC<AIChatbotModalProps> = ({
  onClose,
  onNavigateTab,
  onOpenMandi,
  autoListen = false,
}) => {
  const { user, token } = useAuth();
  const { language } = useLanguage();

  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [executingActionIdx, setExecutingActionIdx] = useState<number | null>(null);

  // Default voice recognition language
  const [voiceLang, setVoiceLang] = useState<'hi-IN' | 'en-IN' | 'pa-IN'>(
    language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-IN'
  );

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      sender: 'ai',
      text:
        user?.role === 'FARMER'
          ? language === 'hi'
            ? 'नमस्ते किसान भाई! मैं किसान मित्र Voice AI हूँ। आप मुझसे बोलकर फसल सुरक्षा, मंडी भाव या वेबसाइट चलाने के तरीके पूछ सकते हैं। आप बोलकर नया उत्पाद भी जोड़ सकते हैं (जैसे: "50 किलो आलू 25 रुपये में जोड़ो")!'
            : 'Hello Farmer friend! I am Kisan Mitra Voice AI. You can speak to ask about crop protection, Mandi prices, website guidance, or add crops using voice commands (e.g., "Add 50 kg Potatoes at ₹25")!'
          : language === 'hi'
          ? 'नमस्ते! मैं किसान इन्वेंटरी का Voice AI सहायक हूँ। आप मुझसे बोलकर ताज़ी उपज, खेत से सीधी डिलीवरी या वेबसाइट उपयोग के बारे में कुछ भी पूछ सकते हैं!'
          : 'Welcome! I am FarmAssist Voice AI. Speak to ask about seasonal vegetables, direct delivery, or website navigation!',
    },
  ]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, interimTranscript]);

  // Clean text and speak using Web Speech Synthesis (TTS)
  const speakText = (text: string) => {
    if (!isSpeechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const cleanText = text.replace(/[*_#`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = voiceLang;
    utterance.rate = 0.95; // comfortable pace for Indian context
    window.speechSynthesis.speak(utterance);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Initialize Speech Recognition
  const isSpeechSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = () => {
    if (!isSpeechSupported) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = voiceLang;

    recognition.onstart = () => {
      setIsListening(true);
      setInterimTranscript('');
    };

    recognition.onresult = (event: any) => {
      let currentInterim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalTranscript = event.results[i][0].transcript;
          setIsListening(false);
          setInterimTranscript('');
          handleSend(finalTranscript);
          return;
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      setInterimTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Auto-listen if triggered by floating button
  useEffect(() => {
    if (autoListen && isSpeechSupported) {
      const timer = setTimeout(() => {
        startListening();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [autoListen]);

  // Send message to AI endpoint
  const handleSend = async (customPrompt?: string) => {
    const text = customPrompt || prompt;
    if (!text || !text.trim()) return;

    if (isListening) stopListening();

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
          language: voiceLang.startsWith('hi') ? 'hi' : voiceLang.startsWith('pa') ? 'pa' : 'en',
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const aiTurn: ChatTurn = {
          sender: 'ai',
          text: data.reply,
          action: data.action,
        };
        setMessages((prev) => [...prev, aiTurn]);
        speakText(data.reply);
      } else {
        const fallbackText =
          language === 'hi'
            ? 'माफ़ कीजिए, मैं अभी इस अनुरोध को संसाधित नहीं कर सका। कृपया पुनः प्रयास करें।'
            : 'Sorry, I could not process your request at this moment. Please try again.';
        setMessages((prev) => [...prev, { sender: 'ai', text: fallbackText }]);
        speakText(fallbackText);
      }
    } catch {
      const errorText =
        language === 'hi'
          ? 'सर्वर से कनेक्ट करने में समस्या आई है। कृपया नेटवर्क जांचें।'
          : 'Network connection issue with AI service.';
      setMessages((prev) => [...prev, { sender: 'ai', text: errorText }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Execute Voice Action: Add Product to Database
  const handleConfirmAddProduct = async (data: VoiceActionData, turnIndex: number) => {
    if (!token || user?.role !== 'FARMER') {
      alert(
        language === 'hi'
          ? 'उत्पाद जोड़ने के लिए कृपया पहले किसान (Farmer) के रूप में लॉगिन करें!'
          : 'Please login as a Farmer to add products to your catalog!'
      );
      return;
    }

    setExecutingActionIdx(turnIndex);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_name: data.product_name,
          category: data.category,
          stock_quantity: data.stock_quantity,
          unit: data.unit,
          price_per_unit: data.price_per_unit,
          low_stock_threshold: data.low_stock_threshold || 5,
          storage_condition: data.storage_condition || 'FIELD_FRESH',
          harvest_date: data.harvest_date || new Date().toISOString().split('T')[0],
        }),
      });

      const result = await res.json();
      if (result.success) {
        // Mark action executed
        setMessages((prev) =>
          prev.map((m, idx) => (idx === turnIndex ? { ...m, isActionExecuted: true } : m))
        );

        const confirmMsg =
          language === 'hi'
            ? `✅ बधाई! **${data.product_name}** (${data.stock_quantity} ${data.unit}) आपकी इन्वेंटरी में सफलतापूर्वक जोड़ दिया गया है!`
            : `✅ Success! **${data.product_name}** (${data.stock_quantity} ${data.unit}) has been added to your live catalog!`;

        setMessages((prev) => [...prev, { sender: 'ai', text: confirmMsg }]);
        speakText(confirmMsg);
      } else {
        alert(result.message || 'Failed to add product');
      }
    } catch (err) {
      console.error('Error adding product via voice action:', err);
      alert('Network error while adding product.');
    } finally {
      setExecutingActionIdx(null);
    }
  };

  // Sample prompt chips tailored for voice and operations
  const samplePrompts =
    user?.role === 'FARMER'
      ? [
          '🎙️ 50 किलो आलू 25 रुपये में जोड़ो',
          '🎙️ मंडी भाव दिखाओ',
          '🎙️ यह वेबसाइट कैसे काम करती है?',
          '🎙️ मेरे ऑर्डर दिखाओ',
          'जैविक कीट नियंत्रण के उपाय',
        ]
      : [
          '🎙️ यह वेबसाइट कैसे काम करती है?',
          'ताजगी स्कोर (Freshness Meter) क्या है?',
          '🎙️ मार्केटप्लेस दिखाओ',
          'डिलीवरी और पेमेंट कैसे काम करती है?',
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-xl w-full h-[620px] shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        {/* Top Header */}
        <div className="p-4 border-b border-emerald-700/30 flex items-center justify-between bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 text-white shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base leading-tight tracking-tight">
                  Kisan Mitra Voice AI (किसान मित्र)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/25 uppercase border border-white/30 tracking-wider">
                  {voiceLang.split('-')[0]}
                </span>
              </div>
              <p className="text-[11px] opacity-90 font-medium">
                {language === 'hi'
                  ? 'आवाज़ पहचान और वेबसाइट सहायक'
                  : 'Voice Recognition & Agricultural Assistant'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <select
              value={voiceLang}
              onChange={(e) => setVoiceLang(e.target.value as any)}
              className="px-2 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-semibold border border-white/30 focus:outline-none cursor-pointer"
              title="Voice Recognition Language"
            >
              <option value="hi-IN" className="text-stone-900">हिंदी (Hindi)</option>
              <option value="en-IN" className="text-stone-900">English (India)</option>
              <option value="pa-IN" className="text-stone-900">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>

            {/* Audio Speech Toggle */}
            <button
              onClick={() => {
                if (isSpeechEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setIsSpeechEnabled(!isSpeechEnabled);
              }}
              title={isSpeechEnabled ? 'Mute AI voice' : 'Enable AI voice output'}
              className={`p-2 rounded-xl border transition-all ${
                isSpeechEnabled
                  ? 'bg-white/25 text-white border-white/40'
                  : 'bg-black/20 text-white/50 border-white/10'
              }`}
            >
              {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat turns view */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50/60 dark:bg-stone-950/40">
          {messages.map((m, idx) => {
            const isAI = m.sender === 'ai';

            return (
              <div
                key={idx}
                className={`flex gap-2.5 ${isAI ? 'items-start' : 'items-end flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                    isAI
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {isAI ? <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> : <User className="w-3.5 h-3.5" />}
                </div>

                <div className="flex flex-col gap-2 max-w-[85%]">
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed whitespace-pre-line ${
                      isAI
                        ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 shadow-sm'
                        : 'bg-emerald-600 text-white rounded-br-none shadow-sm shadow-emerald-600/20'
                    }`}
                  >
                    {m.text}

                    {/* Speak this response button */}
                    {isAI && isSpeechEnabled && (
                      <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-end">
                        <button
                          onClick={() => speakText(m.text)}
                          className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
                          title="Listen again"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>सुनें / Listen</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Interactive Action Card: Add Product */}
                  {isAI && m.action && m.action.type === 'ADD_PRODUCT' && m.action.data && (
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-stone-900 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-3.5 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                          <Package className="w-4 h-4 text-emerald-600" />
                          <span>🎙️ Voice Action: Add to Farm Catalog</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                          {m.action.data.category}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-white dark:bg-stone-800/90 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                        <div>
                          <span className="text-stone-400 text-[10px] block">Product Name / फसल</span>
                          <span className="font-semibold text-stone-800 dark:text-stone-200">
                            {m.action.data.product_name}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 text-[10px] block">Quantity / मात्रा</span>
                          <span className="font-semibold text-stone-800 dark:text-stone-200">
                            {m.action.data.stock_quantity} {m.action.data.unit}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 text-[10px] block">Price per Unit / भाव</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            ₹{m.action.data.price_per_unit} / {m.action.data.unit}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 text-[10px] block">Total Value / कुल मूल्य</span>
                          <span className="font-semibold text-stone-800 dark:text-stone-200">
                            ₹{m.action.data.stock_quantity * m.action.data.price_per_unit}
                          </span>
                        </div>
                      </div>

                      {m.isActionExecuted ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 py-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>✅ Successfully Added to Inventory! (इन्वेंटरी में जोड़ दिया गया)</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleConfirmAddProduct(m.action!.data!, idx)}
                          disabled={executingActionIdx === idx}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                          {executingActionIdx === idx ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Adding to Catalog...</span>
                            </>
                          ) : (
                            <>
                              <PlusCircle className="w-4 h-4" />
                              <span>✅ Confirm & Add to Inventory (स्वीकार करें)</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Interactive Action Card: Navigation */}
                  {isAI && m.action && m.action.type === 'NAVIGATE' && onNavigateTab && (
                    <button
                      onClick={() => {
                        onNavigateTab(m.action!.target!);
                        onClose();
                      }}
                      className="self-start flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-800 transition-all shadow-sm"
                    >
                      <span>Go to {m.action.target?.toUpperCase()} Section</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Interactive Action Card: Open Mandi */}
                  {isAI && m.action && m.action.type === 'OPEN_MANDI' && onOpenMandi && (
                    <button
                      onClick={() => {
                        onOpenMandi();
                        onClose();
                      }}
                      className="self-start flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-800 dark:text-amber-200 rounded-xl text-xs font-semibold border border-amber-200 dark:border-amber-800 transition-all shadow-sm"
                    >
                      <Scale className="w-3.5 h-3.5 text-amber-600" />
                      <span>Open Mandi Price Calculator (मंडी भाव खोलें)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-stone-400 text-xs p-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>किसान मित्र सोच रहा है... (Kisan Mitra is thinking...)</span>
            </div>
          )}

          {/* Live Voice Recording Visualizer */}
          {isListening && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center animate-ping">
                <Mic className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <span>🎙️ सुनने के लिए तैयार... बोलिए (Listening...)</span>
                  <span className="text-[10px] text-red-500 font-extrabold uppercase">LIVE REC</span>
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-300 italic">
                  {interimTranscript || 'जैसे: "50 किलो आलू 25 रुपये में जोड़ो" या "मंडी भाव दिखाओ"'}
                </div>
              </div>
              <button
                onClick={stopListening}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
              >
                Stop
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-3 py-2 bg-stone-100 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {samplePrompts.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s.replace('🎙️ ', ''))}
              className="shrink-0 px-2.5 py-1 bg-white dark:bg-stone-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-full text-[11px] font-medium border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-200 transition-colors shadow-2xs flex items-center gap-1"
            >
              <span>{s}</span>
            </button>
          ))}
        </div>

        {/* Input Bar with Voice Control Microphone */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-2">
          {/* Microphone button */}
          <button
            onClick={isListening ? stopListening : startListening}
            title={isListening ? 'Stop listening' : 'Speak your question or voice command'}
            className={`p-3 rounded-2xl transition-all relative ${
              isListening
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 ring-4 ring-red-400/40 animate-pulse'
                : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 active:scale-95'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              language === 'hi'
                ? 'बोलकर पूछें या टाइप करें (उदा: 50 किलो आलू 25 रुपये में जोड़ो)...'
                : 'Speak or type (e.g., "Add 50 kg Potatoes at ₹25")...'
            }
            className="flex-1 px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={isTyping || !prompt.trim()}
            className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white disabled:opacity-40 transition-all active:scale-95 shadow-md shadow-emerald-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
