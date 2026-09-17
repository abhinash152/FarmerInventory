import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ChatMessage } from '../types';
import { X, Send, User, Sprout, MessageCircle, Clock } from 'lucide-react';

interface ChatDrawerProps {
  farmerId: number;
  customerId: number;
  recipientName?: string;
  recipientLocation?: string;
  onClose: () => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  farmerId,
  customerId,
  recipientName,
  recipientLocation,
  onClose,
}) => {
  const { user, token } = useAuth();
  const { error } = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const fetchMessages = async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/chat/messages/${farmerId}/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [farmerId, customerId, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const msg = textToSend || inputText;
    if (!msg || !msg.trim() || !token) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          farmer_id: farmerId,
          customer_id: customerId,
          message_text: msg.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setInputText('');
      } else {
        error('Chat error', data.message || 'Failed to send message');
      }
    } catch {
      error('Chat error', 'Network error sending message');
    } finally {
      setIsSending(false);
    }
  };

  const quickChips =
    user?.role === 'CUSTOMER'
      ? [
          'Is this 100% naturally grown?',
          'When was the harvest picked?',
          'Do you provide bulk ordering discounts?',
        ]
      : [
          'Yes, picked fresh this morning!',
          'We use only natural cow manure compost.',
          'Your order is being carefully packed now.',
        ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 animate-slide-left">
        {/* Top Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-emerald-50/70 dark:bg-emerald-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
              {recipientName ? recipientName[0].toUpperCase() : '🌾'}
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 leading-tight">
                {recipientName || (user?.role === 'FARMER' ? 'Customer' : 'Farmer')}
              </h3>
              <p className="text-[11px] text-stone-500">
                {recipientLocation || (user?.role === 'FARMER' ? 'Customer Chat' : 'Direct Farm Contact')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/50 dark:bg-stone-950/40">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <MessageCircle className="w-10 h-10 mb-2 opacity-30 text-emerald-600" />
              <p className="text-xs font-semibold">No messages yet.</p>
              <p className="text-[11px] mt-1">Start a conversation directly with {recipientName || 'the grower'}!</p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.sender_role === user?.role;

              return (
                <div
                  key={m.message_id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-br-none shadow-sm shadow-emerald-600/20'
                        : 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-bl-none border border-stone-200/80 dark:border-stone-700 shadow-sm'
                    }`}
                  >
                    {m.message_text}
                  </div>
                  <span className="text-[9px] text-stone-400 mt-1 px-1">
                    {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-stone-100 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="shrink-0 px-2.5 py-1 bg-white dark:bg-stone-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-full text-[10px] font-medium border border-stone-200 dark:border-stone-600 text-stone-700 dark:text-stone-200 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3.5 py-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isSending || !inputText.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
