import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { HandshakeAnimation } from '../components/HandshakeAnimation';
import {
  Truck,
  ArrowRight,
  Scale,
  Sparkles,
  HeartHandshake,
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

  const farmerStories = [
    {
      img: '/assets/farmer_woman_harvest.jpg',
      name: 'Kamala Devi',
      role: 'Wheat & Grain Cultivator',
      location: 'Karnal, Haryana',
      quote: '“Direct selling gives us fair MSP prices within 24 hours of harvest.”',
    },
    {
      img: '/assets/farmer_capsicum.jpg',
      name: 'Rameshwar Patel',
      role: 'Organic Capsicum & Pepper Grower',
      location: 'Anand, Gujarat',
      quote: '“Zero middleman commission means 30% higher savings for my family.”',
    },
    {
      img: '/assets/farmer_papaya_basket.jpg',
      name: 'Rajesh Kushwaha',
      role: 'Fruit Orchard & Papaya Producer',
      location: 'Varanasi, Uttar Pradesh',
      quote: '“Customers receive our fruit fresh from the tree, not aged in cold storage.”',
    },
    {
      img: '/assets/farmer_wheat_sunrise.jpg',
      name: 'Gurpreet Singh',
      role: 'Basmati & Golden Wheat Farmer',
      location: 'Ludhiana, Punjab',
      quote: '“Live Mandi price comparison helps us price our harvest fairly and proudly.”',
    },
    {
      img: '/assets/farmer_smiling_harvest.jpg',
      name: 'Harishankar Verma',
      role: 'Seasonal Vegetables & Herbs',
      location: 'Kurukshetra, Haryana',
      quote: '“Transparent orders with live tracking make farming feel modern and respected.”',
    },
    {
      img: '/assets/farmer_female_field.jpg',
      name: 'Sunita Sharma',
      role: 'Himalayan Mountain Produce',
      location: 'Solan, Himachal Pradesh',
      quote: '“Digital marketplace connects our remote hillside farm to city kitchens.”',
    },
  ];

  return (
    <div className="space-y-16 py-6 pb-20">
      {/* Big Hero Title Box - >60% Transparent Glossy Glass Window */}
      <section className="relative overflow-hidden rounded-3xl glossy-box border border-white/30 shadow-2xl p-6 sm:p-10 lg:p-12 text-white group transition-all duration-300">
        {/* Foreground Content Container - Transparent Frosted Glass */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Hero Left Content (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Project Official Logo & Tagline Header */}
            <div className="flex items-center gap-3.5 pb-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-lg shadow-amber-500/30 bg-white shrink-0">
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
                  <span className="font-black text-xl sm:text-2xl text-white tracking-tight drop-shadow-md">
                    FarmerInventory
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-stone-950 border border-emerald-300 shadow-sm">
                    Official
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-amber-300 drop-shadow">
                  किसान से सीधा ग्राहक तक — कम लोग, बेहतर दाम
                </p>
              </div>
            </div>

            {/* Slogan Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md text-amber-300 border border-amber-400/50 text-xs font-black tracking-wide uppercase shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>“Fasal wahi, raasta naya”</span>
              <span className="hidden sm:inline text-[10px] opacity-80 font-semibold">• फसल वही, रास्ता नया</span>
            </div>

            {/* Main Hero Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight drop-shadow-lg">
              {t('landing_title_1')}{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-amber-300 bg-clip-text text-transparent">
                {t('landing_title_2')}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-xl drop-shadow font-medium">
              Connecting rural farmers directly with households and commercial buyers. Eliminating exploitative commission agents, ensuring fair Mandi rates for growers, and delivering fresher produce to families.
            </p>

            {/* Slogan Banner Pill - Frosted Glass */}
            <div className="p-3.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                🌾
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-emerald-300">
                  “Fasal wahi, raasta naya” (The harvest you love, a revolutionary direct route)
                </div>
                <div className="text-stone-300 text-[11px]">
                  Direct farmer payouts, zero middlemen commission, verified Mandi benchmark prices.
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-white/15 text-center sm:text-left">
              <div>
                <div className="text-2xl font-black text-emerald-400 drop-shadow">500+</div>
                <div className="text-[11px] font-semibold text-stone-300 uppercase">{t('stat_farmers')}</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400 drop-shadow">100%</div>
                <div className="text-[11px] font-semibold text-stone-300 uppercase">{t('stat_crops')}</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400 drop-shadow">25-35%</div>
                <div className="text-[11px] font-semibold text-stone-300 uppercase">{t('stat_savings')}</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400 drop-shadow">₹0</div>
                <div className="text-[11px] font-semibold text-stone-300 uppercase">{t('stat_middlemen')}</div>
              </div>
            </div>
          </div>

          {/* Hero Right: Handshake Component */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <HandshakeAnimation className="w-full" />
            <div className="text-center mt-3">
              <span className="text-[11px] font-bold text-stone-300 tracking-wider uppercase flex items-center justify-center gap-1.5 drop-shadow">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                Direct Trust Handshake: Farmer to Consumer
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Entry Cards - >60% Transparent Glossy Cards */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-400 drop-shadow">
            Get Started / शुरुआत करें
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
            {t('choose_role')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Farmer Card - Ultra-transparent Glossy Glass */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => onSelectRole('FARMER')}
            className="group cursor-pointer glossy-box rounded-3xl p-8 border border-emerald-400/40 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all flex flex-col justify-between text-white"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/25 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-3xl shadow-lg group-hover:scale-110 transition-transform">
                🌾
              </div>
              <div>
                <h3 className="text-2xl font-black text-white drop-shadow">
                  {t('farmer')} / किसान
                </h3>
                <span className="text-xs font-bold text-emerald-300">
                  Growers, Producers & Agro-Entrepreneurs
                </span>
              </div>
              <p className="text-sm text-stone-200 leading-relaxed font-medium">
                {t('role_farmer_desc')}
              </p>
              <ul className="space-y-2 text-xs text-stone-200 pt-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Statewise Mandi Rates & Instant Price Recommendation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Animated Kanban Order Fulfillment & Customer Chat
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Sales Analytics & Revenue Forecasting
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/20 flex items-center justify-between font-bold text-emerald-300 group-hover:text-emerald-200">
              <span>{t('enter_as_farmer')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </motion.div>

          {/* Customer Card - Ultra-transparent Glossy Glass */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => onSelectRole('CUSTOMER')}
            className="group cursor-pointer glossy-box rounded-3xl p-8 border border-amber-400/40 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20 transition-all flex flex-col justify-between text-white"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/25 border border-amber-400/40 flex items-center justify-center text-amber-300 text-3xl shadow-lg group-hover:scale-110 transition-transform">
                🛒
              </div>
              <div>
                <h3 className="text-2xl font-black text-white drop-shadow">
                  {t('customer')} / ग्राहक
                </h3>
                <span className="text-xs font-bold text-amber-300">
                  Families, Chefs & Health-Conscious Consumers
                </span>
              </div>
              <p className="text-sm text-stone-200 leading-relaxed font-medium">
                {t('role_customer_desc')}
              </p>
              <ul className="space-y-2 text-xs text-stone-200 pt-2 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">✓</span> Direct Farm Freshness & Grower Verification
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">✓</span> Transparent Quality Reports & Damage Protection
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">✓</span> Online UPI Simulator & Cash on Delivery
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/20 flex items-center justify-between font-bold text-amber-300 group-hover:text-amber-200">
              <span>{t('enter_as_customer')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </div>
          </motion.div>
        </div>

        {/* Demo Credentials Quick Hint - Glossy Glass */}
        <div className="max-w-xl mx-auto p-4 rounded-2xl glossy-box border border-white/25 text-xs text-center text-stone-200">
          <span className="font-bold text-amber-300">Quick Demo Accounts:</span>
          <div className="mt-1.5 flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span>👨‍🌾 Farmer: <code className="font-mono bg-black/45 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/40">gurpreet_punjab</code> / <code className="font-mono bg-black/45 text-white px-2 py-0.5 rounded border border-white/20">password123</code></span>
            <span>🛒 Customer: <code className="font-mono bg-black/45 text-amber-300 px-2 py-0.5 rounded border border-amber-400/40">rahul_v</code> / <code className="font-mono bg-black/45 text-white px-2 py-0.5 rounded border border-white/20">password123</code></span>
          </div>
        </div>
      </section>

      {/* Real Farmer Voices & Harvest Gallery Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-sm">
            Real Indian Farmers • सच्ची कहानियां
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
            Faces Behind India’s Fresh Harvests
          </h2>
          <p className="text-xs sm:text-sm text-stone-200">
            Meet the hardworking growers across Punjab, Haryana, Himachal, and UP who harvest with pride and sell directly to you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmerStories.map((farmer) => (
            <motion.div
              key={farmer.name}
              whileHover={{ y: -5 }}
              className="rounded-3xl overflow-hidden glossy-box border border-white/25 shadow-xl group flex flex-col text-white"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={farmer.img}
                  alt={farmer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="font-extrabold text-base drop-shadow">{farmer.name}</div>
                  <div className="text-xs text-amber-300 font-bold">{farmer.role}</div>
                  <div className="text-[11px] text-stone-300">{farmer.location}</div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-stone-200 italic font-medium">
                  {farmer.quote}
                </p>
                <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-300 font-bold">
                  <span>✓ Verified Direct Producer</span>
                  <span>100% Traceable</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Real Agricultural Photography Showcase Section */}
      <section className="glossy-box rounded-3xl border border-white/25 p-6 sm:p-10 shadow-2xl space-y-8 text-white">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 backdrop-blur-md shadow-sm">
            Field to Market Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md">
            Real Agriculture, Fair Contracts & Modern Technology
          </h2>
          <p className="text-xs sm:text-sm text-stone-200">
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
            <div className="p-4 rounded-2xl bg-emerald-950/40 backdrop-blur-md border border-emerald-400/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-stone-950 flex items-center justify-center font-black shrink-0 text-sm shadow">
                1
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  Modern Field Mechanization & Harvesting
                </h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  Tractors, laser levelers, and automated combines allow farmers to harvest at peak ripeness with minimal post-harvest losses.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/40 backdrop-blur-md border border-amber-400/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shrink-0 text-sm shadow">
                2
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  Direct Verified Farmer-Customer Contracts
                </h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  Transparent digital order receipts and payment terms protect both parties, eliminating unfair cuts by traditional middle-tier cartels.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-950/40 backdrop-blur-md border border-sky-400/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-stone-950 flex items-center justify-center font-black shrink-0 text-sm shadow">
                3
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  State APMC Mandi Price Intelligence
                </h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  State-specific wholesale benchmarks enable farmers to set competitive direct rates above MSP while saving customers 25-35%.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/40 backdrop-blur-md border border-purple-400/30 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500 text-stone-950 flex items-center justify-center font-black shrink-0 text-sm shadow">
                4
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">
                  Complete Quality Transparency & Customer Protection
                </h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  Customers can submit photographic proof of damaged produce with clear dispute resolution, keeping the marketplace accountable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glossy-box border border-white/25 shadow-xl space-y-3 text-white">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shadow">
            <Truck className="w-6 h-6" />
          </div>
          <h4 className="font-black text-base text-white">
            Live Order Tracking
          </h4>
          <p className="text-xs text-stone-200 leading-relaxed font-medium">
            Follow your harvest from field packing to doorstep delivery with interactive status checkpoints and instant pincode rate estimation.
          </p>
        </div>

        <div className="p-6 rounded-3xl glossy-box border border-white/25 shadow-xl space-y-3 text-white">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/25 border border-amber-400/40 text-amber-300 flex items-center justify-center shadow">
            <Scale className="w-6 h-6" />
          </div>
          <h4 className="font-black text-base text-white">
            State Mandi Price Intelligence
          </h4>
          <p className="text-xs text-stone-200 leading-relaxed font-medium">
            Compare prices directly against official APMC wholesale rates and retail supermarkets across Punjab, Haryana, Himachal, and Maharashtra.
          </p>
        </div>

        <div className="p-6 rounded-3xl glossy-box border border-white/25 shadow-xl space-y-3 text-white">
          <div className="w-12 h-12 rounded-2xl bg-green-500/25 border border-green-400/40 text-green-300 flex items-center justify-center shadow">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="font-black text-base text-white">
            Kisan Mitra AI
          </h4>
          <p className="text-xs text-stone-200 leading-relaxed font-medium">
            Multilingual agricultural assistant in English and Hindi offering pest control advice, storage guidance, and customer support.
          </p>
        </div>
      </section>
    </div>
  );
};
