import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sprout,
  Sun,
  Moon,
  Globe,
  Bell,
  LogOut,
  Sparkles,
  Scale,
  Menu,
  X,
  User,
  ShoppingBag,
  Package,
  CheckCircle2,
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NavbarProps {
  onOpenAI: () => void;
  onOpenMandi: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAI,
  onOpenMandi,
  activeTab,
  setActiveTab,
}) => {
  const { user, logout, isAuthenticated, token } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Poll or fetch notifications for Farmer
  useEffect(() => {
    if (!token || user?.role !== 'FARMER') return;

    const fetchNotifs = async () => {
      try {
        const res = await fetch('/api/notifications/farmer', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unread_count || 0);
        }
      } catch {
        // ignore
      }
    };

    fetchNotifs();
    const timer = setInterval(fetchNotifs, 15000);
    return () => clearInterval(timer);
  }, [token, user?.role]);

  const markAllRead = async () => {
    if (!token) return;
    try {
      await fetch('/api/notifications/farmer/mark-read', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // ignore
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tag */}
        <div
          onClick={() => setActiveTab && setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 dark:from-emerald-400 dark:via-green-300 dark:to-emerald-500 bg-clip-text text-transparent">
                {t('brand')}
              </span>
              {user && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {user.role === 'FARMER' ? t('farmer') : t('customer')}
                </span>
              )}
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 hidden sm:block">
              {t('tagline')}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (if logged in) */}
        {isAuthenticated && setActiveTab && (
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 dark:bg-stone-800/60 p-1 rounded-xl border border-stone-200/60 dark:border-stone-700/60 text-sm font-medium">
            {user?.role === 'FARMER' ? (
              <>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'inventory'
                      ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {t('nav_inventory')}
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'orders'
                      ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {t('nav_orders')}
                </button>
                <button
                  onClick={() => setActiveTab('sales')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'sales'
                      ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {t('nav_sales')}
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'reports'
                      ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {t('nav_reports')}
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'chat'
                      ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {t('nav_chat')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'marketplace'
                      ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {t('nav_marketplace')}
                </button>
                <button
                  onClick={() => setActiveTab('my_orders')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'my_orders'
                      ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {t('nav_my_orders')}
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'chat'
                      ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {t('nav_chat')}
                </button>
              </>
            )}
          </nav>
        )}

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2">
          {/* Government Mandi Calculator Button */}
          <button
            onClick={onOpenMandi}
            title={t('mandi_calc_title')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800/80 text-xs font-semibold transition-all shadow-sm"
          >
            <Scale className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="hidden sm:inline">{t('nav_mandi')}</span>
          </button>

          {/* Kisan Mitra AI Assistant Button */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs font-semibold transition-all shadow-sm shadow-emerald-600/20"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span className="hidden sm:inline">{t('nav_ai')}</span>
          </button>

          {/* Language Switcher */}
          <div className="relative group">
            <button className="flex items-center gap-1 p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              <Globe className="w-4 h-4" />
              <span className="text-xs uppercase font-bold">{language}</span>
            </button>
            <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl py-1 hidden group-hover:block z-50">
              <button
                onClick={() => setLanguage('en')}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                  language === 'en' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 font-bold' : ''
                }`}
              >
                <span>English</span>
                {language === 'en' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                  language === 'hi' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 font-bold' : ''
                }`}
              >
                <span>हिन्दी (Hindi)</span>
                {language === 'hi' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setLanguage('pa')}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                  language === 'pa' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 font-bold' : ''
                }`}
              >
                <span>ਪੰਜਾਬੀ (Punjabi)</span>
                {language === 'pa' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications for Farmer */}
          {user?.role === 'FARMER' && (
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  if (!notifDropdownOpen) markAllRead();
                }}
                className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 relative transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-stone-900 animate-pulse" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-3 z-50 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Alerts & Notifications</h4>
                    <span className="text-[10px] text-emerald-600">{notifications.length} recent</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-stone-400 text-center py-4">No notifications yet</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.notification_id}
                          className={`p-2.5 rounded-xl text-xs border ${
                            n.type === 'LOW_STOCK'
                              ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100'
                              : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          <div className="font-semibold">{n.title}</div>
                          <p className="text-[11px] opacity-85 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile / Logout */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-800">
              <div className="hidden lg:block text-right">
                <div className="text-xs font-bold leading-tight">{user?.name}</div>
                <div className="text-[10px] text-stone-400">@{user?.username}</div>
              </div>
              <button
                onClick={logout}
                title={t('nav_logout')}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab && setActiveTab('home')}
                className="px-3 py-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition-colors"
              >
                {t('nav_login')}
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          {isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && isAuthenticated && setActiveTab && (
        <div className="md:hidden p-4 border-t border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 space-y-2">
          {user?.role === 'FARMER' ? (
            <>
              <button
                onClick={() => { setActiveTab('inventory'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                🌾 {t('nav_inventory')}
              </button>
              <button
                onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                📥 {t('nav_orders')}
              </button>
              <button
                onClick={() => { setActiveTab('sales'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                💰 {t('nav_sales')}
              </button>
              <button
                onClick={() => { setActiveTab('reports'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                📊 {t('nav_reports')}
              </button>
              <button
                onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                💬 {t('nav_chat')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { setActiveTab('marketplace'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                🛒 {t('nav_marketplace')}
              </button>
              <button
                onClick={() => { setActiveTab('my_orders'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                📦 {t('nav_my_orders')}
              </button>
              <button
                onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }}
                className="w-full text-left p-2.5 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                💬 {t('nav_chat')}
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
