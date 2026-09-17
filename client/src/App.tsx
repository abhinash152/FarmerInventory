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

const MainApp: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [authModalRole, setAuthModalRole] = useState<'FARMER' | 'CUSTOMER' | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isMandiOpen, setIsMandiOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenAI={() => setIsAIOpen(true)}
        onOpenMandi={() => setIsMandiOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Page Area with Framer Motion Page Transition */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {isAIOpen && <AIChatbotModal onClose={() => setIsAIOpen(false)} />}
      {isMandiOpen && <MandiPriceModal onClose={() => setIsMandiOpen(false)} />}

      {/* Footer */}
      <footer className="border-t border-stone-200/80 dark:border-stone-800/80 bg-white/50 dark:bg-stone-900/50 backdrop-blur-md py-6 text-center text-xs text-stone-500">
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
