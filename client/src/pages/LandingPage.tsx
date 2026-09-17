import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HandshakeAnimation } from '../components/HandshakeAnimation';
import {
  Sprout,
  Users,
  ShieldCheck,
  TrendingUp,
  Truck,
  ArrowRight,
  Scale,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onSelectRole: (role: 'FARMER' | 'CUSTOMER') => void;
  onOpenMandi: () => void;
  onOpenAI: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onOpenMandi,
  onOpenAI,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 py-6 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-50/90 via-emerald-50/40 to-transparent dark:from-emerald-950/30 dark:via-stone-900/40 dark:to-transparent border border-emerald-100 dark:border-emerald-900/30 p-8 sm:p-12 lg:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-extrabold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t('landing_badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 dark:text-stone-100 leading-[1.1] tracking-tight">
              {t('landing_title_1')}{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 dark:from-emerald-400 dark:via-green-300 dark:to-emerald-500 bg-clip-text text-transparent">
                {t('landing_title_2')}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl">
              {t('landing_subtitle')}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-200/60 dark:border-emerald-900/40 text-center sm:text-left">
              <div>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">500+</div>
                <div className="text-[11px] font-semibold text-stone-500 uppercase">{t('stat_farmers')}</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">100%</div>
                <div className="text-[11px] font-semibold text-stone-500 uppercase">{t('stat_crops')}</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">25-35%</div>
                <div className="text-[11px] font-semibold text-stone-500 uppercase">{t('stat_savings')}</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">₹0</div>
                <div className="text-[11px] font-semibold text-stone-500 uppercase">{t('stat_middlemen')}</div>
              </div>
            </div>
          </div>

          {/* Hero Right: Handshake Visual */}
          <div className="flex flex-col items-center justify-center relative">
            <HandshakeAnimation className="w-80 h-80 sm:w-96 sm:h-96" />
            <div className="text-center mt-2">
              <span className="text-xs font-bold text-stone-500 tracking-wider uppercase">
                Farmer & Customer Trust Protocol
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Entry Cards */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Get Started
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t('choose_role')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Farmer Card */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => onSelectRole('FARMER')}
            className="group cursor-pointer bg-white dark:bg-stone-900 border-2 border-emerald-200 dark:border-emerald-800/80 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:border-emerald-500 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-3xl shadow-sm group-hover:scale-110 transition-transform">
                🌾
              </div>
              <div>
                <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100">
                  {t('farmer')} / किसान
                </h3>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Growers, Producers & Agro-Entrepreneurs
                </span>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {t('role_farmer_desc')}
              </p>
              <ul className="space-y-1.5 text-xs text-stone-500 dark:text-stone-400 pt-2">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> Smart Inventory & Low-stock Alerts
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> Animated Kanban Order Fulfillment
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> Sales Analytics & Revenue Forecasting
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700">
              <span>{t('enter_as_farmer')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </motion.div>

          {/* Customer Card */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => onSelectRole('CUSTOMER')}
            className="group cursor-pointer bg-white dark:bg-stone-900 border-2 border-emerald-200 dark:border-emerald-800/80 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:border-emerald-500 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400 text-3xl shadow-sm group-hover:scale-110 transition-transform">
                🛒
              </div>
              <div>
                <h3 className="text-2xl font-black text-stone-900 dark:text-stone-100">
                  {t('customer')} / ग्राहक
                </h3>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  Families, Chefs & Health-Conscious Consumers
                </span>
              </div>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {t('role_customer_desc')}
              </p>
              <ul className="space-y-1.5 text-xs text-stone-500 dark:text-stone-400 pt-2">
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span> Direct Farm Freshness & Traceability
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span> Live Delivery Journey & Pincode Lookup
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span> Online UPI Simulator & Cash on Delivery
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between font-bold text-amber-600 dark:text-amber-400 group-hover:text-amber-700">
              <span>{t('enter_as_customer')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </motion.div>
        </div>

        {/* Demo Credentials Quick Hint */}
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-center text-stone-600 dark:text-stone-300">
          <span className="font-bold text-emerald-700 dark:text-emerald-300">Quick Demo Accounts:</span>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span>👨‍🌾 Farmer: <code className="font-mono bg-white dark:bg-stone-800 px-1 py-0.5 rounded">gurpreet_punjab</code> / <code className="font-mono">password123</code></span>
            <span>🛒 Customer: <code className="font-mono bg-white dark:bg-stone-800 px-1 py-0.5 rounded">rahul_v</code> / <code className="font-mono">password123</code></span>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
            Live Order Tracking
          </h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Follow your harvest from field packing to doorstep delivery with interactive status checkpoints and instant pincode rate estimation.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
            Govt Mandi Benchmarking
          </h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Compare farmer prices directly against official APMC Mandi rates and retail supermarket costs to verify fair trade pricing.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-950 text-green-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
            Kisan Mitra AI
          </h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Multilingual agricultural assistant in English and Hindi offering pest control advice, storage guidance, and customer support.
          </p>
        </div>
      </section>
    </div>
  );
};
