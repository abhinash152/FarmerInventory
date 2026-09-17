import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChatDrawer } from '../../components/ChatDrawer';
import { MessageCircle, User, Clock, ArrowRight, RefreshCw } from 'lucide-react';

interface ConversationSummary {
  other_user_id: number;
  other_user_name: string;
  other_user_location?: string;
  other_user_contact?: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export const FarmerChatPage: React.FC = () => {
  const { token, user } = useAuth();
  const { t } = useLanguage();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<ConversationSummary | null>(null);

  const fetchConversations = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 8000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t('nav_chat')}
          </h1>
          <p className="text-xs text-stone-500">
            {user?.role === 'FARMER'
              ? 'Direct inquiries and conversations from customers regarding your harvest produce'
              : 'Direct messaging with growers and farmers regarding crop orders and availability'}
          </p>
        </div>
        <button
          onClick={fetchConversations}
          className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Threads</span>
        </button>
      </div>

      {/* Conversations List */}
      {isLoading ? (
        <div className="text-center py-16 text-xs text-stone-400">Loading conversation threads...</div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 p-8 space-y-2">
          <MessageCircle className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="font-bold text-base text-stone-800 dark:text-stone-200">
            No active conversation threads
          </h3>
          <p className="text-xs text-stone-400">
            When {user?.role === 'FARMER' ? 'customers message you about products' : 'you chat with a farmer on any product card'}, conversations will show up here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conversations.map((c) => (
            <div
              key={c.other_user_id}
              onClick={() => setSelectedConversation(c)}
              className="cursor-pointer bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-emerald-500 transition-all flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                  {c.other_user_name[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {c.other_user_name}
                    </h4>
                    {c.unread_count > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500 text-white">
                        {c.unread_count} new
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                    {c.last_message || 'Start chatting...'}
                  </p>
                  <span className="text-[10px] text-stone-400">
                    {c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      {selectedConversation && user && (
        <ChatDrawer
          farmerId={user.role === 'FARMER' ? user.id : selectedConversation.other_user_id}
          customerId={user.role === 'CUSTOMER' ? user.id : selectedConversation.other_user_id}
          recipientName={selectedConversation.other_user_name}
          recipientLocation={selectedConversation.other_user_location}
          onClose={() => {
            setSelectedConversation(null);
            fetchConversations();
          }}
        />
      )}
    </div>
  );
};
