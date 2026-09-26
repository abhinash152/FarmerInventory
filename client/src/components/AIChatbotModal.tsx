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
  AlertCircle,
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
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Default to Hindi ('hi-IN') so Kisan Mitra naturally talks in Hindi!
  const [voiceLang, setVoiceLang] = useState<'hi-IN' | 'en-IN' | 'pa-IN'>('hi-IN');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const silenceTimerRef = useRef<any>(null);
  const speechAccumulatorRef = useRef<string>('');
  const consecutiveRestartsRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load available speech synthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setAvailableVoices(v);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      sender: 'ai',
      text:
        user?.role === 'FARMER'
          ? 'नमस्ते किसान भाई! मैं किसान मित्र Voice AI हूँ। आप मुझसे बोलकर फसल सुरक्षा, मंडी भाव या वेबसाइट चलाने के तरीके पूछ सकते हैं। आप बोलकर नया उत्पाद भी जोड़ सकते हैं (जैसे: "50 किलो आलू 25 रुपये में जोड़ो")!'
          : 'नमस्ते! मैं किसान इन्वेंटरी का Voice AI सहायक हूँ। आप मुझसे बोलकर ताज़ी उपज, खेत से सीधी डिलीवरी या वेबसाइट उपयोग के बारे में कुछ भी पूछ सकते हैं!',
    },
  ]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, interimTranscript]);

  // Clean text and speak using Web Speech Synthesis (TTS) in Hindi or English
  const speakText = (text: string, forcedLang?: 'hi-IN' | 'en-IN' | 'pa-IN') => {
    if (!isSpeechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const cleanText = text.replace(/[*_#`]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Detect language: check for Hindi characters or active voiceLang
    const hasHindiChars = /[\u0900-\u097F]/.test(cleanText);
    const hasHindiWords = /(नमस्ते|किसान|आलू|टमाटर|मंडी|रुपये|जोड़ो|फसल|बिक्री|ऑर्डर|ताजगी|सब्जियां|उपज)/i.test(cleanText);
    const hasPunjabiChars = /[\u0A00-\u0A7F]/.test(cleanText);

    const targetLang =
      forcedLang ||
      (hasHindiChars || hasHindiWords || voiceLang === 'hi-IN'
        ? 'hi-IN'
        : hasPunjabiChars || voiceLang === 'pa-IN'
        ? 'pa-IN'
        : 'en-IN');

    utterance.lang = targetLang;

    // Pick best matching voice from browser
    const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();

    if (targetLang === 'hi-IN') {
      // Find dedicated Hindi voice (e.g., Google हिन्दी, Microsoft Kalpana, Microsoft Hemant)
      const hiVoice =
        voices.find((v) => v.lang === 'hi-IN' || v.lang === 'hi_IN' || v.lang.startsWith('hi')) ||
        voices.find(
          (v) =>
            v.name.toLowerCase().includes('hindi') ||
            v.name.toLowerCase().includes('kalpana') ||
            v.name.toLowerCase().includes('hemant')
        );

      if (hiVoice) {
        utterance.voice = hiVoice;
      }
      utterance.rate = 0.9; // Clear, comfortable Hindi cadence
      utterance.pitch = 1.0;
    } else if (targetLang === 'pa-IN') {
      const paVoice =
        voices.find((v) => v.lang.startsWith('pa') || v.name.toLowerCase().includes('punjabi')) ||
        voices.find((v) => v.lang.startsWith('hi'));
      if (paVoice) utterance.voice = paVoice;
      utterance.rate = 0.9;
    } else {
      const inVoice =
        voices.find((v) => v.lang === 'en-IN' || v.lang === 'en_IN') ||
        voices.find(
          (v) =>
            v.name.toLowerCase().includes('india') ||
            v.name.toLowerCase().includes('neerja') ||
            v.name.toLowerCase().includes('prabhat')
        );
      if (inVoice) {
        utterance.voice = inVoice;
      }
      utterance.rate = 0.95;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Initialize Speech Recognition
  const isSpeechSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = async () => {
    if (!isSpeechSupported) {
      setPermissionError(
        voiceLang === 'hi-IN'
          ? 'आपके ब्राउज़र में आवाज़ पहचान समर्थित नहीं है। कृपया Google Chrome या Microsoft Edge का उपयोग करें।'
          : 'Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.'
      );
      return;
    }

    // 1. Immediately cancel any speech synthesis to prevent audio hardware conflict
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setPermissionError(null);

    // 2. Warm up and verify microphone permission via getUserMedia
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately release media tracks so SpeechRecognition has exclusive audio hardware control
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: any) {
        console.warn('Microphone permission check failed:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionError(
            voiceLang === 'hi-IN'
              ? 'माइक्रोफ़ोन की अनुमति अस्वीकृत (Denied) है। कृपया ब्राउज़र एड्रेस बार में 🔒 या माइक्रोफ़ोन आइकन पर क्लिक करके अनुमति (Allow) दें।'
              : 'Microphone permission blocked. Please allow mic access in your browser address bar settings.'
          );
          setIsListening(false);
          isListeningRef.current = false;
          return;
        }
      }
    }

    // 3. Clean up any existing recognition instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    speechAccumulatorRef.current = '';
    consecutiveRestartsRef.current = 0;
    isListeningRef.current = true;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = voiceLang; // 'hi-IN', 'en-IN', or 'pa-IN'

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
        setPermissionError(null);
      };

      recognition.onresult = (event: any) => {
        consecutiveRestartsRef.current = 0;
        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcript + ' ';
          } else {
            interim += transcript;
          }
        }

        if (finalChunk) {
          speechAccumulatorRef.current = (speechAccumulatorRef.current + ' ' + finalChunk).trim();
        }

        const combined = (speechAccumulatorRef.current + (interim ? ' ' + interim : '')).trim();
        setInterimTranscript(combined);
        setPrompt(combined);

        // Reset silence timer on speech
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // Auto-send after 2 seconds of silence once speech has been captured
        if (combined.length > 0) {
          silenceTimerRef.current = setTimeout(() => {
            if (isListeningRef.current) {
              const textToSend = (speechAccumulatorRef.current + (interim ? ' ' + interim : '')).trim();
              if (textToSend) {
                stopListening(false);
                handleSend(textToSend);
              }
            }
          }, 2000);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);

        // 'no-speech' is a benign pause event in Chrome - do NOT cancel listening!
        if (event.error === 'no-speech') {
          return;
        }

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          isListeningRef.current = false;
          setIsListening(false);
          setPermissionError(
            voiceLang === 'hi-IN'
              ? 'माइक्रोफ़ोन अनुमति अवरोधित है। कृपया ब्राउज़र एड्रेस बार में 🔒 या माइक आइकन पर क्लिक करके अनुमति दें।'
              : 'Microphone permission blocked. Please enable microphone access in your browser address bar.'
          );
          return;
        }

        if (event.error === 'aborted') {
          // Normal abort when user stops or switches
          return;
        }
      };

      recognition.onend = () => {
        // If the user did not manually stop listening:
        if (isListeningRef.current) {
          const textToSend = (speechAccumulatorRef.current + ' ' + interimTranscript).trim();
          if (textToSend.length > 2) {
            // Speech was spoken and ended; submit query!
            isListeningRef.current = false;
            setIsListening(false);
            setInterimTranscript('');
            handleSend(textToSend);
          } else if (consecutiveRestartsRef.current < 4) {
            // Restart seamlessly to prevent premature cancellation during natural silence
            consecutiveRestartsRef.current += 1;
            try {
              recognition.start();
            } catch (err) {
              console.warn('Could not auto-restart recognition:', err);
              setIsListening(false);
              isListeningRef.current = false;
            }
          } else {
            // Max silence reached without speech; gracefully end listening
            setIsListening(false);
            isListeningRef.current = false;
            setInterimTranscript('');
          }
        } else {
          setIsListening(false);
          setInterimTranscript('');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to initialize SpeechRecognition:', err);
      setIsListening(false);
      isListeningRef.current = false;
    }
  };

  const stopListening = (shouldSend = true) => {
    isListeningRef.current = false;
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      recognitionRef.current = null;
    }

    setIsListening(false);

    const textToSend = (speechAccumulatorRef.current + ' ' + interimTranscript).trim();
    speechAccumulatorRef.current = '';
    setInterimTranscript('');

    if (shouldSend && textToSend.length > 0) {
      handleSend(textToSend);
    }
  };

  // Auto-listen if triggered by floating button
  useEffect(() => {
    if (autoListen && isSpeechSupported) {
      const timer = setTimeout(() => {
        startListening();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoListen]);

  // Handle switching language in modal
  const handleLanguageChange = (lang: 'hi-IN' | 'en-IN' | 'pa-IN') => {
    setVoiceLang(lang);
    if (isListening) {
      stopListening(false);
    }

    const welcome =
      lang === 'hi-IN'
        ? user?.role === 'FARMER'
          ? 'नमस्ते किसान भाई! मैं अब हिंदी में बात करूँगा। आप बोलकर नया उत्पाद जोड़ सकते हैं या मंडी भाव पूछ सकते हैं।'
          : 'नमस्ते! मैं अब हिंदी में आपकी सहायता करूँगा। ताज़ी मौसमी उपज या डिलीवरी के बारे में कुछ भी पूछें!'
        : lang === 'pa-IN'
        ? 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਹੁਣ ਪੰਜਾਬੀ ਵਿੱਚ ਗੱਲ ਕਰਾਂਗਾ।'
        : user?.role === 'FARMER'
        ? 'Hello! Switched to English. Ask about crop pricing, pest control, or speak to add crops.'
        : 'Welcome! Switched to English. Ask about farm-fresh produce or order delivery.';

    setMessages((prev) => [...prev, { sender: 'ai', text: welcome }]);
    speakText(welcome, lang);
  };

  // Send message to AI endpoint
  const handleSend = async (customPrompt?: string) => {
    const text = customPrompt || prompt;
    if (!text || !text.trim()) return;

    if (isListening) stopListening();

    const userTurn: ChatTurn = { sender: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userTurn]);
    if (!customPrompt) setPrompt('');
    setIsTyping(true);

    // Auto-detect Hindi from text or active voiceLang
    const hasHindiChars = /[\u0900-\u097F]/.test(text);
    const hasHindiWords = /(karo|aalu|tamatar|kaise|batao|kya|dikhaye|jodo|bhav|mandi|kisan|khet)/i.test(text);
    const isHindi = voiceLang === 'hi-IN' || hasHindiChars || hasHindiWords;
    const isPunjabi = voiceLang === 'pa-IN' || /[\u0A00-\u0A7F]/.test(text);

    const targetLangKey = isHindi ? 'hi' : isPunjabi ? 'pa' : 'en';

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text.trim(),
          role: user?.role || 'CUSTOMER',
          language: targetLangKey,
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
        speakText(data.reply, isHindi ? 'hi-IN' : isPunjabi ? 'pa-IN' : 'en-IN');
      } else {
        const fallbackText =
          isHindi
            ? 'माफ़ कीजिए, मैं अभी इस अनुरोध को संसाधित नहीं कर सका। कृपया पुनः प्रयास करें।'
            : 'Sorry, I could not process your request at this moment. Please try again.';
        setMessages((prev) => [...prev, { sender: 'ai', text: fallbackText }]);
        speakText(fallbackText, isHindi ? 'hi-IN' : 'en-IN');
      }
    } catch {
      const errorText =
        isHindi
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
      alert('उत्पाद जोड़ने के लिए कृपया पहले किसान (Farmer) के रूप में लॉगिन करें!');
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
        setMessages((prev) =>
          prev.map((m, idx) => (idx === turnIndex ? { ...m, isActionExecuted: true } : m))
        );

        const confirmMsg = `✅ बधाई! **${data.product_name}** (${data.stock_quantity} ${data.unit}) आपकी इन्वेंटरी में सफलतापूर्वक जोड़ दिया गया है!`;
        setMessages((prev) => [...prev, { sender: 'ai', text: confirmMsg }]);
        speakText(confirmMsg, 'hi-IN');
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
              </div>
              <p className="text-[11px] opacity-90 font-medium">
                {voiceLang === 'hi-IN'
                  ? '🇮🇳 हिंदी आवाज़ पहचान और सहायक सक्रिय'
                  : 'Voice Recognition & Agricultural Assistant'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Language Switch Buttons */}
            <div className="flex items-center bg-black/25 p-1 rounded-xl border border-white/20">
              <button
                onClick={() => handleLanguageChange('hi-IN')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  voiceLang === 'hi-IN'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title="Switch to Hindi voice"
              >
                🇮🇳 हिंदी
              </button>
              <button
                onClick={() => handleLanguageChange('en-IN')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  voiceLang === 'en-IN'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title="Switch to English voice"
              >
                🌐 Eng
              </button>
              <button
                onClick={() => handleLanguageChange('pa-IN')}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  voiceLang === 'pa-IN'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title="Switch to Punjabi voice"
              >
                ਪੰ
              </button>
            </div>

            {/* Audio Speech Toggle */}
            <button
              onClick={() => {
                if (isSpeechEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setIsSpeechEnabled(!isSpeechEnabled);
              }}
              title={isSpeechEnabled ? 'Mute AI voice (आवाज़ बंद)' : 'Enable AI voice (आवाज़ चालू)'}
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

        {/* Permission Error Banner */}
        {permissionError && (
          <div className="mx-4 mt-3 p-3 bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 rounded-2xl text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">माइक्रोफ़ोन अनुमति सूचना (Microphone Notice)</span>
              <span className="mt-0.5 block leading-relaxed">{permissionError}</span>
            </div>
            <button
              onClick={() => setPermissionError(null)}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-500 hover:text-red-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

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
                          className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                          title="Listen in voice"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>🔊 आवाज़ में सुनें (Speak)</span>
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
                          <span>🎙️ वॉइस एक्शन: इन्वेंटरी में जोड़ें</span>
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
                              <span>जोड़ा जा रहा है...</span>
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
                      <span>{m.action.target?.toUpperCase()} अनुभाग खोलें</span>
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
                      <span>मंडी भाव कैलकुलेटर खोलें</span>
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
              <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center animate-ping shrink-0">
                <Mic className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <span>
                    {voiceLang === 'hi-IN'
                      ? '🎙️ हिंदी में बोलिए (Listening in Hindi...)'
                      : voiceLang === 'pa-IN'
                      ? '🎙️ ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲੋ (Listening in Punjabi...)'
                      : '🎙️ Listening in English...'}
                  </span>
                  <span className="text-[10px] text-red-500 font-extrabold uppercase shrink-0">LIVE REC</span>
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-300 italic truncate">
                  {interimTranscript ||
                    (voiceLang === 'hi-IN'
                      ? 'जैसे: "50 किलो आलू 25 रुपये में जोड़ो" या "मंडी भाव दिखाओ"'
                      : 'e.g. "Add 50 kg potatoes at 25 rupees" or "Show mandi rates"')}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {interimTranscript.trim() && (
                  <button
                    onClick={() => stopListening(true)}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    भेजें / Send
                  </button>
                )}
                <button
                  onClick={() => stopListening(false)}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  रद्द करें / Stop
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips in Hindi */}
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
            onClick={() => {
              if (isListening) {
                stopListening(true);
              } else {
                startListening();
              }
            }}
            title={isListening ? 'Stop listening (सुनना बंद करें)' : 'हिंदी या इंग्लिश में बोलकर पूछें (Click to Speak)'}
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
              voiceLang === 'hi-IN'
                ? 'हिंदी में बोलकर पूछें (उदा: 50 किलो आलू 25 रुपये में जोड़ो)...'
                : 'Speak or type in English...'
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
