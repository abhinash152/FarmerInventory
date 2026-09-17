import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { PulsingBadge } from '../../components/PulsingBadge';
import { SkeletonCard } from '../../components/SkeletonLoaders';
import { OrderModal } from '../../components/OrderModal';
import { ChatDrawer } from '../../components/ChatDrawer';
import {
  Search,
  MapPin,
  Star,
  MessageCircle,
  Truck,
  Sparkles,
  ShoppingBag,
  Filter,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface CustomerMarketplacePageProps {
  onOpenMandi: () => void;
  onOpenAI: () => void;
  onRequestAuth: () => void;
}

export const CustomerMarketplacePage: React.FC<CustomerMarketplacePageProps> = ({
  onOpenMandi,
  onOpenAI,
  onRequestAuth,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { info } = useToast();
  const { t } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');

  // Active modals
  const [selectedProductForOrder, setSelectedProductForOrder] = useState<Product | null>(null);
  const [chatTarget, setChatTarget] = useState<{
    farmerId: number;
    name: string;
    location: string;
  } | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('q', debouncedSearch);
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (stateFilter !== 'ALL') params.append('state', stateFilter);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, categoryFilter, stateFilter]);

  const categories = [
    { id: 'ALL', label: 'All Harvests' },
    { id: 'Vegetables', label: 'Vegetables / सब्जियां' },
    { id: 'Fruits', label: 'Fruits / फल' },
    { id: 'Grains', label: 'Grains / अनाज' },
    { id: 'Dairy', label: 'Dairy / दुग्ध' },
    { id: 'Honey & Sweeteners', label: 'Honey / शहद' },
  ];

  const states = [
    { id: 'ALL', label: 'All Regions (Pan India)' },
    { id: 'Punjab', label: 'Punjab (Ludhiana / Amritsar)' },
    { id: 'Himachal', label: 'Himachal Pradesh (Shimla / Kullu)' },
    { id: 'Gujarat', label: 'Gujarat (Anand / Surat)' },
    { id: 'Haryana', label: 'Haryana' },
    { id: 'Uttar Pradesh', label: 'Uttar Pradesh' },
  ];

  const handleStartOrder = (product: Product) => {
    if (!isAuthenticated) {
      info('Sign in Required', 'Please sign in or register as a customer to place orders');
      onRequestAuth();
      return;
    }
    setSelectedProductForOrder(product);
  };

  const handleStartChat = (product: Product) => {
    if (!isAuthenticated) {
      info('Sign in Required', 'Please sign in to chat directly with farmers');
      onRequestAuth();
      return;
    }
    if (!product.farmer) return;
    setChatTarget({
      farmerId: product.farmer_id,
      name: product.farmer.full_name,
      location: product.farmer.farm_location || 'Local Farm',
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Marketplace Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/20 backdrop-blur-md uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            100% Farm-To-Table Traceability
          </span>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">
            {t('marketplace_title')}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Order fresh seasonal produce harvested on-demand directly from certified Indian farmers. Enjoy wholesale prices, zero middleman commission, and fast temperature-controlled delivery.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenMandi}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-md transition-transform active:scale-95"
            >
              📊 Check Mandi Price Savings
            </button>
            <button
              onClick={onOpenAI}
              className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-colors"
            >
              🤖 Ask Kisan Mitra AI
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          {/* Instant Search input */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* State filter dropdown */}
          <div>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === c.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-emerald-500'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Catalog Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="font-bold text-base text-stone-800 dark:text-stone-200">
            No fresh harvests found matching your criteria
          </h3>
          <p className="text-xs text-stone-400">
            Try searching for another crop or reset the region filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const isOutOfStock = p.stock_quantity <= 0;

            return (
              <div
                key={p.product_id}
                className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="relative w-full h-48 bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl bg-emerald-50 dark:bg-emerald-950">
                        🌾
                      </div>
                    )}

                    {/* Low Stock or In Stock Badge */}
                    <div className="absolute top-3 left-3">
                      {isOutOfStock ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-md">
                          Out of Stock
                        </span>
                      ) : p.is_low_stock ? (
                        <PulsingBadge
                          currentStock={p.stock_quantity}
                          threshold={p.low_stock_threshold ?? 5}
                          unit={p.unit}
                        />
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600/90 backdrop-blur-md text-white shadow-sm">
                          Freshly Harvested
                        </span>
                      )}
                    </div>

                    {/* Chat with Grower Quick Button */}
                    <button
                      onClick={() => handleStartChat(p)}
                      title="Chat with Grower"
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-stone-900/90 text-stone-700 dark:text-stone-200 shadow-md hover:bg-emerald-600 hover:text-white transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        {p.category || 'Farm Produce'}
                      </span>
                      {p.average_rating && p.average_rating > 0 ? (
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{p.average_rating}</span>
                          <span className="text-[10px] text-stone-400 font-normal">
                            ({p.reviews_count})
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {p.product_name}
                    </h3>

                    {/* Farmer details */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        <strong>{p.farmer?.full_name}</strong> ({p.farmer?.farm_location || 'Local Farm'})
                      </span>
                    </div>

                    <div className="text-xs text-stone-500 flex items-center justify-between pt-1">
                      <span>Stock Available:</span>
                      <strong className="text-stone-800 dark:text-stone-200 font-bold">
                        {p.stock_quantity} {p.unit}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Price & Order Action */}
                <div className="p-5 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2 bg-stone-50/40 dark:bg-stone-900/40">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Direct Price</span>
                    <div className="text-lg font-black text-stone-900 dark:text-stone-100">
                      ₹{Number(p.price_per_unit).toFixed(2)}
                      <span className="text-xs font-normal text-stone-500">/{p.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStartOrder(p)}
                      disabled={isOutOfStock}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-40"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t('order_now')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Modal */}
      {selectedProductForOrder && (
        <OrderModal
          product={selectedProductForOrder}
          onClose={() => setSelectedProductForOrder(null)}
          onOrderSuccess={() => fetchProducts()}
        />
      )}

      {/* Direct Chat Drawer */}
      {chatTarget && user && (
        <ChatDrawer
          farmerId={chatTarget.farmerId}
          customerId={user.id}
          recipientName={chatTarget.name}
          recipientLocation={chatTarget.location}
          onClose={() => setChatTarget(null)}
        />
      )}
    </div>
  );
};
