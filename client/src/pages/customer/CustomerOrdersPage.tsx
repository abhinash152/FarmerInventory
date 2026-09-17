import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { Order } from '../../types';
import { SkeletonCard } from '../../components/SkeletonLoaders';
import { LiveTrackingModal } from '../../components/LiveTrackingModal';
import { FeedbackModal } from '../../components/FeedbackModal';
import { ChatDrawer } from '../../components/ChatDrawer';
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  Star,
  MessageCircle,
  CreditCard,
  Banknote,
  MapPin,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CustomerOrdersPage: React.FC = () => {
  const { token, user } = useAuth();
  const { success, error } = useToast();
  const { t } = useLanguage();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReorderingId, setIsReorderingId] = useState<number | null>(null);

  // Modals
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [feedbackOrder, setFeedbackOrder] = useState<Order | null>(null);
  const [chatTarget, setChatTarget] = useState<{
    farmerId: number;
    name: string;
    location: string;
  } | null>(null);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/orders/customer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch {
      error('Orders Error', 'Failed to retrieve your order history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [token]);

  // Quick Reorder feature: re-places an order with same item & quantity
  const handleQuickReorder = async (order: Order) => {
    if (!token) return;
    setIsReorderingId(order.order_id);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: order.product_id,
          quantity: order.quantity,
          payment_method: order.extension?.payment_method || 'COD',
          delivery_pincode: order.extension?.delivery_pincode || '110001',
          delivery_address: order.extension?.delivery_address || order.customer?.address,
        }),
      });

      const data = await res.json();
      if (data.success) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
        success(
          'Quick Reorder Placed! 🌾',
          `Order #${data.order.order_id} for ${order.quantity} ${order.product?.unit} of ${order.product?.product_name} has been sent to the farmer.`
        );
        fetchOrders();
      } else {
        error('Reorder Failed', data.message || 'Product may be out of stock');
      }
    } catch {
      error('Network Error', 'Could not process quick reorder');
    } finally {
      setIsReorderingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t('nav_my_orders')}
          </h1>
          <p className="text-xs text-stone-500">
            Track live delivery milestones, communicate with growers, and submit ratings for accepted harvests
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 p-8 space-y-3">
          <Package className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="font-bold text-base text-stone-800 dark:text-stone-200">
            You haven't placed any orders yet
          </h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Browse our fresh farm catalog in the Marketplace and connect directly with local growers!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isAccepted = order.status === 'ACCEPTED';
            const isPending = order.status === 'PENDING';
            const isRejected = order.status === 'REJECTED';
            const currentStep = order.extension?.tracking_step || (isAccepted ? 'ACCEPTED' : 'PLACED');

            return (
              <div
                key={order.order_id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                {/* Produce & Order Details */}
                <div className="flex items-start gap-4">
                  {order.product?.image_url ? (
                    <img
                      src={order.product.image_url}
                      alt={order.product.product_name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-2xl">
                      🌾
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        #{order.order_id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                          isAccepted
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                            : isPending
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                        }`}
                      >
                        {isAccepted && <CheckCircle2 className="w-3 h-3" />}
                        {isPending && <Clock className="w-3 h-3" />}
                        {isRejected && <XCircle className="w-3 h-3" />}
                        <span>{order.status}</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                      {order.product?.product_name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                      <span>
                        Qty: <strong>{order.quantity} {order.product?.unit}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Total: <strong className="text-stone-900 dark:text-stone-100">₹{(Number(order.product?.price_per_unit || 0) * order.quantity).toFixed(2)}</strong>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{order.farmer?.full_name} ({order.farmer?.farm_location || 'Local Farm'})</span>
                      </span>
                    </div>

                    {/* Delivery & Payment note */}
                    <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-1">
                      <span>
                        Payment:{' '}
                        <strong className="text-stone-600 dark:text-stone-300">
                          {order.extension?.payment_method === 'ONLINE' ? 'UPI Online' : 'Cash on Delivery'}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Status Stage:{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {currentStep}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Track, Reorder, Feedback, Chat */}
                <div className="w-full md:w-auto flex flex-wrap md:flex-col items-center md:items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100 dark:border-stone-800">
                  {/* Live Tracking Journey Button */}
                  <button
                    onClick={() => setTrackingOrder(order)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Live Tracking ({currentStep})</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {/* Direct Chat with Farmer */}
                    <button
                      onClick={() =>
                        setChatTarget({
                          farmerId: order.farmer_id,
                          name: order.farmer?.full_name || 'Farmer',
                          location: order.farmer?.farm_location || 'Local Farm',
                        })
                      }
                      title="Chat with Farmer"
                      className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    {/* Quick Reorder */}
                    <button
                      onClick={() => handleQuickReorder(order)}
                      disabled={isReorderingId === order.order_id}
                      className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isReorderingId === order.order_id ? 'Ordering...' : t('reorder_quick')}</span>
                    </button>

                    {/* Rating / Review Button if Accepted */}
                    {isAccepted && !order.feedback && (
                      <button
                        onClick={() => setFeedbackOrder(order)}
                        className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Rate Order</span>
                      </button>
                    )}

                    {order.feedback && (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>Rated {order.feedback.rating}/5</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Live Tracking Modal */}
      {trackingOrder && (
        <LiveTrackingModal
          order={trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}

      {/* Feedback & Review Modal */}
      {feedbackOrder && (
        <FeedbackModal
          order={feedbackOrder}
          onClose={() => setFeedbackOrder(null)}
          onFeedbackSuccess={() => fetchOrders()}
        />
      )}

      {/* Chat Drawer */}
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
