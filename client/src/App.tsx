import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './pages/AuthModal';
import { AIChatbotModal } from './components/AIChatbotModal';
import { MandiPriceModal } from './components/MandiPriceModal';
import { AnimatedSkyBackground } from './components/AnimatedSkyBackground';

// Farmer Pages
import { FarmerInventoryPage } from './pages/farmer/FarmerInventoryPage';
import { FarmerOrdersPage } from './pages/farmer/FarmerOrdersPage';
import { FarmerSalesPage } from './pages/farmer/FarmerSalesPage';
import { FarmerReportsPage } from './pages/farmer/FarmerReportsPage';
import { FarmerChatPage } from './pages/farmer/FarmerChatPage';

// Customer Pages
import { CustomerMarketplacePage } from './pages/customer/CustomerMarketplacePage';
import { CustomerOrdersPage } from './pages/customer/CustomerOrdersPage';

import { motion, AnimatePresence } from 'framer-motion';
import { Mic } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [authModalRole, setAuthModalRole] = useState<'FARMER' | 'CUSTOMER' | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isMandiOpen, setIsMandiOpen] = useState(false);
  const [autoListenAI, setAutoListenAI] = useState(false);

  // Set default tab when auth changes
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'FARMER' && (activeTab === 'home' || activeTab === 'marketplace' || activeTab === 'my_orders')) {
        setActiveTab('inventory');
      } else if (user.role === 'CUSTOMER' && (activeTab === 'home' || activeTab === 'inventory' || activeTab === 'orders' || activeTab === 'sales' || activeTab === 'reports')) {
        setActiveTab('marketplace');
      }
    } else {
      setActiveTab('home');
    }
  }, [isAuthenticated, user?.role]);

  const handleSelectRoleFromLanding = (role: 'FARMER' | 'CUSTOMER') => {
    if (isAuthenticated && user?.role === role) {
      setActiveTab(role === 'FARMER' ? 'inventory' : 'marketplace');
    } else {
      setAuthModalRole(role);
    }
  };

  return (
    <div
      className={`min-h-screen relative flex flex-col selection:bg-emerald-500 selection:text-white overflow-x-hidden transition-colors duration-300 ${
        activeTab === 'home'
          ? 'bg-transparent text-stone-100'
          : 'bg-slate-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100'
      }`}
    >
      {/* Video & Photo Slideshow Background ONLY on starting landing/login page */}
      {activeTab === 'home' ? (
        <AnimatedSkyBackground />
      ) : (
        /* Still & Clean Light Theme Background for Dashboard Pages */
        <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-br from-slate-50 via-sky-50/40 to-emerald-50/30 dark:from-stone-950 dark:via-slate-900 dark:to-stone-900" />
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenAI={() => setIsAIOpen(true)}
        onOpenMandi={() => setIsMandiOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Page Area with Framer Motion Page Transition */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage
                onSelectRole={handleSelectRoleFromLanding}
                onOpenMandi={() => setIsMandiOpen(true)}
                onOpenAI={() => setIsAIOpen(true)}
              />
            </motion.div>
          )}

          {/* FARMER TABS */}
          {isAuthenticated && user?.role === 'FARMER' && activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FarmerInventoryPage />
            </motion.div>
          )}

          {isAuthenticated && user?.role === 'FARMER' && activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FarmerOrdersPage />
            </motion.div>
          )}

          {isAuthenticated && user?.role === 'FARMER' && activeTab === 'sales' && (
            <motion.div
              key="sales"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FarmerSalesPage />
            </motion.div>
          )}

          {isAuthenticated && user?.role === 'FARMER' && activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FarmerReportsPage />
            </motion.div>
          )}

          {/* CUSTOMER TABS */}
          {activeTab === 'marketplace' && (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <CustomerMarketplacePage
                onOpenMandi={() => setIsMandiOpen(true)}
                onOpenAI={() => setIsAIOpen(true)}
                onRequestAuth={() => setAuthModalRole('CUSTOMER')}
              />
            </motion.div>
          )}

          {isAuthenticated && user?.role === 'CUSTOMER' && activeTab === 'my_orders' && (
            <motion.div
              key="my_orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <CustomerOrdersPage />
            </motion.div>
          )}

          {/* SHARED CHAT TAB */}
          {isAuthenticated && activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FarmerChatPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Modals */}
      {authModalRole && (
        <AuthModal
          initialRole={authModalRole}
          onClose={() => setAuthModalRole(null)}
          onSuccess={() => {
            if (authModalRole === 'FARMER') setActiveTab('inventory');
            else setActiveTab('marketplace');
          }}
        />
      )}

      {isAIOpen && (
        <AIChatbotModal
          onClose={() => {
            setIsAIOpen(false);
            setAutoListenAI(false);
          }}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onOpenMandi={() => setIsMandiOpen(true)}
          autoListen={autoListenAI}
        />
      )}
      {isMandiOpen && <MandiPriceModal onClose={() => setIsMandiOpen(false)} />}

      {/* Floating Kisan Voice AI Assistant Button */}
      <button
        onClick={() => {
          setAutoListenAI(true);
          setIsAIOpen(true);
        }}
        title="Kisan Mitra Voice AI - बोलकर पूछें या उत्पाद जोड़ें"
        className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-full shadow-2xl hover:shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/30 backdrop-blur-md"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
        </span>
        <Mic className="w-4 h-4 text-white animate-pulse" />
        <span className="font-bold text-xs sm:text-sm tracking-tight pr-1">
          बोलकर पूछें / Voice AI
        </span>
      </button>

      {/* Footer */}
      <footer className="relative z-10 border-t border-stone-200/80 dark:border-stone-800/80 bg-white/60 dark:bg-stone-900/60 backdrop-blur-md py-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
            <span>🌾 FarmerInventory</span>
            <span>• Direct Farm-to-Consumer Digital Ecosystem</span>
          </div>
          <div className="text-[11px] text-stone-400">
            Replaces old desktop prototype with animated web experience.
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <MainApp />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
