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
  CheckCircle2,
  HeartHandshake,
  Compass,
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
      {/* Hero Section with Official Logo & Slogan */}
      <section className="relative overflow-hidden rounded-3xl backdrop-blur-md bg-white/85 dark:bg-stone-900/85 border border-emerald-200/80 dark:border-emerald-900/40 p-6 sm:p-10 lg:p-12 shadow-xl shadow-emerald-900/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Hero Left Content (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Project Official Logo & Tagline Header */}
            <div className="flex items-center gap-3.5 pb-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md shadow-emerald-600/30 bg-white shrink-0">
                <img
                  src="/assets/logo.jpg"
                  alt="FarmerInventory Official Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xl sm:text-2xl text-stone-900 dark:text-stone-100 tracking-tight">
                    FarmerInventory
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                    Official
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  किसान से सीधा ग्राहक तक — कम लोग, बेहतर दाम
                </p>
              </div>
            </div>

            {/* Slogan Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-200 dark:from-amber-950 dark:via-yellow-950 dark:to-amber-900 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-xs font-black tracking-wide uppercase shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>“Fasal wahi, raasta naya”</span>
              <span className="hidden sm:inline text-[10px] opacity-75 font-semibold">• फसल वही, रास्ता नया</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-stone-100 leading-[1.15] tracking-tight">
              {t('landing_title_1')}{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 dark:from-emerald-400 dark:via-green-300 dark:to-emerald-500 bg-clip-text text-transparent">
                {t('landing_title_2')}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl">
              Connecting rural farmers directly with households and commercial buyers. Eliminating exploitative commission agents, ensuring fair Mandi rates for growers, and delivering fresher produce to families.
            </p>

            {/* Slogan Banner Pill */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 dark:from-emerald-950/60 dark:via-teal-950/40 dark:to-emerald-900/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                🌾
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-emerald-900 dark:text-emerald-200">
                  “Fasal wahi, raasta naya” (The harvest you love, a revolutionary direct route)
                </div>
                <div className="text-stone-500 dark:text-stone-400 text-[11px]">
                  Direct farmer payouts, zero middlemen commission, verified Mandi benchmark prices.
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-stone-200/80 dark:border-stone-800/80 text-center sm:text-left">
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

          {/* Hero Right: Upgraded Sunset Handshake Component (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <HandshakeAnimation className="w-full" />
            <div className="text-center mt-3">
              <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 tracking-wider uppercase flex items-center justify-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-500" />
                Direct Trust Handshake: Farmer to Consumer
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Entry Cards */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Get Started / शुरुआत करें
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
            className="group cursor-pointer backdrop-blur-md bg-white/90 dark:bg-stone-900/90 border-2 border-emerald-200 dark:border-emerald-800/80 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:border-emerald-500 transition-all flex flex-col justify-between"
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
                  <span className="text-emerald-500 font-bold">✓</span> Statewise Mandi Rates & Instant Price Recommendation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span> Animated Kanban Order Fulfillment & Customer Chat
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
            className="group cursor-pointer backdrop-blur-md bg-white/90 dark:bg-stone-900/90 border-2 border-amber-200 dark:border-amber-800/80 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:border-amber-500 transition-all flex flex-col justify-between"
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
                  <span className="text-amber-500 font-bold">✓</span> Direct Farm Freshness & Grower Verification
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span> Transparent Quality Reports & Damage Protection
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
        <div className="max-w-xl mx-auto p-4 rounded-2xl backdrop-blur-md bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-center text-stone-600 dark:text-stone-300">
          <span className="font-bold text-emerald-700 dark:text-emerald-300">Quick Demo Accounts:</span>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span>👨‍🌾 Farmer: <code className="font-mono bg-white dark:bg-stone-800 px-1.5 py-0.5 rounded border border-emerald-200">gurpreet_punjab</code> / <code className="font-mono">password123</code></span>
            <span>🛒 Customer: <code className="font-mono bg-white dark:bg-stone-800 px-1.5 py-0.5 rounded border border-amber-200">rahul_v</code> / <code className="font-mono">password123</code></span>
          </div>
        </div>
      </section>

      {/* Real Agricultural Photography Showcase Section */}
      <section className="backdrop-blur-md bg-white/80 dark:bg-stone-900/80 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-10 shadow-lg space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
            Field to Market Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            Real Agriculture, Fair Contracts & Modern Technology
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            See how direct trade transforms agricultural supply chains across India with modern mechanized harvesting and transparent farmer partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Real Agricultural Collage Photo */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border-2 border-emerald-400/50 shadow-xl group">
            <img
              src="/assets/farm_collage.jpg"
              alt="Agricultural Machinery, Harvest, Business Handshake, and Farm Contract"
              className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          {/* 4 Pillars of Direct Trade */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-sm">
                1
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  Modern Field Mechanization & Harvesting
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Tractors, laser levelers, and automated combines allow farmers to harvest at peak ripeness with minimal post-harvest losses.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shrink-0 text-sm">
                2
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  Direct Verified Farmer-Customer Contracts
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Transparent digital order receipts and payment terms protect both parties, eliminating unfair cuts by traditional middle-tier cartels.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0 text-sm">
                3
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  State APMC Mandi Price Intelligence
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  State-specific wholesale benchmarks enable farmers to set competitive direct rates above MSP while saving customers 25-35%.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 text-sm">
                4
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  Complete Quality Transparency & Customer Protection
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Customers can submit photographic proof of damaged produce with clear dispute resolution, keeping the marketplace accountable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl backdrop-blur-md bg-white/85 dark:bg-stone-900/85 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
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

        <div className="p-6 rounded-3xl backdrop-blur-md bg-white/85 dark:bg-stone-900/85 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
            State Mandi Price Intelligence
          </h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            Compare prices directly against official APMC wholesale rates and retail supermarkets across Punjab, Haryana, Himachal, and Maharashtra.
          </p>
        </div>

        <div className="p-6 rounded-3xl backdrop-blur-md bg-white/85 dark:bg-stone-900/85 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
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
