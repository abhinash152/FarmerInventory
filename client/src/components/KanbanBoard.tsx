import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, TrackingStep } from '../types';
import {
  Check,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  AlertCircle,
  MapPin,
  CreditCard,
  Banknote,
  User,
  Sparkles,
} from 'lucide-react';
import { PulsingBadge } from './PulsingBadge';
import confetti from 'canvas-confetti';

interface KanbanBoardProps {
  orders: Order[];
  onRespond: (orderId: number, action: 'ACCEPTED' | 'REJECTED') => Promise<void>;
  onUpdateTracking: (orderId: number, step: TrackingStep) => Promise<void>;
  isProcessingId: number | null;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  orders,
  onRespond,
  onUpdateTracking,
  isProcessingId,
}) => {
  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const acceptedOrders = orders.filter((o) => o.status === 'ACCEPTED');
  const rejectedOrders = orders.filter((o) => o.status === 'REJECTED');

  const handleAccept = async (orderId: number) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#22c55e', '#16a34a', '#86efac', '#facc15'],
    });
    await onRespond(orderId, 'ACCEPTED');
  };

  const getTrackingStepIndex = (step?: TrackingStep): number => {
    switch (step) {
      case 'PLACED': return 0;
      case 'ACCEPTED': return 1;
      case 'PACKED': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 1;
    }
  };

  const trackingStepsList: { step: TrackingStep; label: string }[] = [
    { step: 'ACCEPTED', label: 'Accepted' },
    { step: 'PACKED', label: 'Packed' },
    { step: 'OUT_FOR_DELIVERY', label: 'Dispatched' },
    { step: 'DELIVERED', label: 'Delivered' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* COLUMN 1: PENDING ORDERS */}
      <div className="bg-stone-100/70 dark:bg-stone-900/60 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col min-h-[500px]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="font-bold text-stone-800 dark:text-stone-100 text-sm">
              Pending Requests
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
            {pendingOrders.length}
          </span>
        </div>

        <div className="space-y-3 flex-1">
          <AnimatePresence mode="popLayout">
            {pendingOrders.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center p-4 border border-dashed border-stone-300 dark:border-stone-800 rounded-xl text-stone-400 text-xs">
                <Clock className="w-8 h-8 mb-2 opacity-40 text-amber-500" />
                No pending orders right now.
              </div>
            ) : (
              pendingOrders.map((order) => {
                const stock = order.product?.stock_quantity ?? 0;
                const isInsufficient = stock < order.quantity;

                return (
                  <motion.div
                    key={order.order_id}
                    layoutId={`order-card-${order.order_id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.25 } }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="bg-white dark:bg-stone-800/90 border border-stone-200/90 dark:border-stone-700/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          #{order.order_id}
                        </span>
                        <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 leading-snug">
                          {order.product?.product_name}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        ₹{(Number(order.product?.price_per_unit || 0) * order.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Customer & Location */}
                    <div className="text-xs text-stone-600 dark:text-stone-300 space-y-1 my-2 bg-stone-50 dark:bg-stone-900/50 p-2.5 rounded-lg border border-stone-100 dark:border-stone-800">
                      <div className="flex items-center gap-1.5 font-medium">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        <span>{order.customer?.customer_name}</span>
                        {order.customer?.contact_number && (
                          <span className="text-[10px] text-stone-400">({order.customer.contact_number})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">{order.extension?.delivery_address || order.customer?.address || 'Standard Address'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 text-stone-500">
                        <span className="flex items-center gap-1">
                          {order.extension?.payment_method === 'ONLINE' ? (
                            <>
                              <CreditCard className="w-3 h-3 text-emerald-500" />
                              <strong className="text-emerald-600 dark:text-emerald-400">Paid Online</strong>
                            </>
                          ) : (
                            <>
                              <Banknote className="w-3 h-3 text-amber-500" />
                              <span>Cash on Delivery</span>
                            </>
                          )}
                        </span>
                        <span>PIN: {order.extension?.delivery_pincode || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Stock Status Check */}
                    <div className="flex items-center justify-between my-2 text-xs">
                      <span className="text-stone-500">
                        Requested: <strong className="text-stone-800 dark:text-stone-200 font-bold">{order.quantity} {order.product?.unit}</strong>
                      </span>
                      <span className={`text-[11px] font-semibold ${isInsufficient ? 'text-rose-600' : 'text-emerald-600'}`}>
                        Available: {stock} {order.product?.unit}
                      </span>
                    </div>

                    {isInsufficient && (
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs mb-3">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Insufficient stock to fulfill order!</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-700/60">
                      <button
                        onClick={() => handleAccept(order.order_id)}
                        disabled={isProcessingId === order.order_id || isInsufficient}
                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                          isInsufficient
                            ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 active:scale-95'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        {isProcessingId === order.order_id ? 'Processing...' : 'Accept & Decrement'}
                      </button>
                      <button
                        onClick={() => onRespond(order.order_id, 'REJECTED')}
                        disabled={isProcessingId === order.order_id}
                        className="py-2 px-3 rounded-xl font-semibold text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center gap-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* COLUMN 2: ACCEPTED ORDERS & LIVE FULFILLMENT */}
      <div className="bg-stone-100/70 dark:bg-stone-900/60 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col min-h-[500px]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="font-bold text-stone-800 dark:text-stone-100 text-sm">
              Accepted & In Transit
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
            {acceptedOrders.length}
          </span>
        </div>

        <div className="space-y-3 flex-1">
          <AnimatePresence mode="popLayout">
            {acceptedOrders.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center p-4 border border-dashed border-stone-300 dark:border-stone-800 rounded-xl text-stone-400 text-xs">
                <CheckCircle className="w-8 h-8 mb-2 opacity-40 text-emerald-500" />
                No active accepted orders.
              </div>
            ) : (
              acceptedOrders.map((order) => {
                const currentStep = order.extension?.tracking_step || 'ACCEPTED';
                const stepIdx = getTrackingStepIndex(currentStep);

                return (
                  <motion.div
                    key={order.order_id}
                    layoutId={`order-card-${order.order_id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.25 } }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className="bg-white dark:bg-stone-800/90 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          #{order.order_id}
                        </span>
                        <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                          {order.product?.product_name}
                        </h4>
                        <span className="text-xs text-stone-500">
                          Qty: {order.quantity} {order.product?.unit}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Accepted
                      </span>
                    </div>

                    {/* Customer info */}
                    <div className="text-xs text-stone-600 dark:text-stone-300 my-2">
                      To: <strong>{order.customer?.customer_name}</strong> • {order.extension?.delivery_address || order.customer?.address}
                    </div>

                    {/* Live Delivery Stepper Control */}
                    <div className="my-3 pt-2 border-t border-stone-100 dark:border-stone-700/60">
                      <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>Delivery Stage</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{currentStep}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1 text-center">
                        {trackingStepsList.map((st, i) => {
                          const isDone = stepIdx >= i + 1;
                          const isCurrent = currentStep === st.step;

                          return (
                            <button
                              key={st.step}
                              onClick={() => onUpdateTracking(order.order_id, st.step)}
                              className={`p-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                                isCurrent
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                  : isDone
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                  : 'bg-stone-50 dark:bg-stone-900 text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                              }`}
                            >
                              {st.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Review Feedback if present */}
                    {order.feedback && (
                      <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs">
                        <div className="flex items-center gap-1 font-bold text-amber-800 dark:text-amber-200">
                          {'★'.repeat(order.feedback.rating)}
                          <span className="text-[10px] text-stone-500">({order.feedback.rating}/5)</span>
                        </div>
                        {order.feedback.comment && (
                          <p className="text-stone-700 dark:text-stone-300 text-[11px] italic mt-0.5">
                            "{order.feedback.comment}"
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* COLUMN 3: REJECTED / CANCELLED */}
      <div className="bg-stone-100/70 dark:bg-stone-900/60 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col min-h-[500px]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <h3 className="font-bold text-stone-800 dark:text-stone-100 text-sm">
              Rejected Orders
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800">
            {rejectedOrders.length}
          </span>
        </div>

        <div className="space-y-3 flex-1">
          <AnimatePresence mode="popLayout">
            {rejectedOrders.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center p-4 border border-dashed border-stone-300 dark:border-stone-800 rounded-xl text-stone-400 text-xs">
                <XCircle className="w-8 h-8 mb-2 opacity-40 text-rose-400" />
                No rejected orders.
              </div>
            ) : (
              rejectedOrders.map((order) => (
                <motion.div
                  key={order.order_id}
                  layoutId={`order-card-${order.order_id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 0.75, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="bg-white dark:bg-stone-800/80 border border-rose-200 dark:border-rose-900/60 rounded-xl p-3 shadow-sm text-xs opacity-80"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-stone-400">#{order.order_id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      REJECTED
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-800 dark:text-stone-200">
                    {order.product?.product_name}
                  </h4>
                  <div className="text-stone-500 mt-1">
                    Customer: {order.customer?.customer_name} • Requested: {order.quantity} {order.product?.unit}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-2">
                    Responded: {order.responded_at ? new Date(order.responded_at).toLocaleDateString() : 'N/A'}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
