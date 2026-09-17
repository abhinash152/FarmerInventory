import React from 'react';
import { Order, TrackingStep } from '../types';
import {
  X,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  FileText,
  Phone,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LiveTrackingModalProps {
  order: Order;
  onClose: () => void;
}

export const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({ order, onClose }) => {
  const currentStep = order.extension?.tracking_step || (order.status === 'ACCEPTED' ? 'ACCEPTED' : 'PLACED');

  const steps: { key: TrackingStep; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'PLACED',
      title: 'Order Placed',
      desc: 'Order received and notified to the grower',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      key: 'ACCEPTED',
      title: 'Confirmed by Farmer',
      desc: 'Farmer accepted order and reserved batch inventory',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      key: 'PACKED',
      title: 'Harvested & Packed',
      desc: 'Freshly harvested from field into breathable eco-crates',
      icon: <Package className="w-4 h-4" />,
    },
    {
      key: 'OUT_FOR_DELIVERY',
      title: 'Out for Delivery',
      desc: 'Chilled transit vehicle dispatched to your location',
      icon: <Truck className="w-4 h-4" />,
    },
    {
      key: 'DELIVERED',
      title: 'Delivered Safely',
      desc: 'Harvest handed over to customer doorstep',
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
  ];

  const getStepIndex = (stepKey: TrackingStep) => {
    switch (stepKey) {
      case 'PLACED': return 0;
      case 'ACCEPTED': return 1;
      case 'PACKED': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  const activeIdx = getStepIndex(currentStep);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Order #{order.order_id}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                order.status === 'ACCEPTED' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-amber-100 text-amber-800'
              }`}>
                {order.status}
              </span>
            </div>
            <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 mt-0.5">
              Live Harvest & Delivery Journey
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Produce & Farmer Card */}
          <div className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 flex items-center gap-4">
            {order.product?.image_url ? (
              <img
                src={order.product.image_url}
                alt={order.product.product_name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-2xl">
                🌾
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm truncate">{order.product?.product_name}</h4>
              <p className="text-xs text-stone-500">
                Qty: <strong>{order.quantity} {order.product?.unit}</strong> • ₹{Number(order.product?.price_per_unit || 0) * order.quantity}
              </p>
              <div className="text-xs text-stone-600 dark:text-stone-300 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{order.farmer?.full_name} ({order.farmer?.farm_location || 'Local Farm'})</span>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
            {steps.map((st, i) => {
              const isCompleted = activeIdx >= i;
              const isCurrent = activeIdx === i;

              return (
                <div key={st.key} className="relative flex items-start gap-4">
                  {/* Indicator Dot / Icon */}
                  <div
                    className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                        : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-400'
                    } ${isCurrent ? 'ring-4 ring-emerald-100 dark:ring-emerald-900/50' : ''}`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-2 h-2 rounded-full bg-stone-300" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5
                        className={`text-sm font-bold ${
                          isCompleted
                            ? 'text-stone-900 dark:text-stone-100'
                            : 'text-stone-400 dark:text-stone-600'
                        }`}
                      >
                        {st.title}
                      </h5>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 animate-pulse">
                          Current Stage
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Details Summary */}
          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-stone-600 dark:text-stone-300">Destination Address:</span>
              <strong className="text-stone-900 dark:text-stone-100 text-right max-w-[200px] truncate">
                {order.extension?.delivery_address || order.customer?.address}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600 dark:text-stone-300">Pincode / Zone:</span>
              <strong className="font-mono">{order.extension?.delivery_pincode || '110001'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-600 dark:text-stone-300">Payment Status:</span>
              <span className="font-bold text-emerald-600">
                {order.extension?.payment_method === 'ONLINE' ? 'Paid via UPI (Digital)' : 'Cash on Delivery (COD)'}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-emerald-200 dark:border-emerald-800">
              <span className="text-stone-600 dark:text-stone-300">Estimated Delivery:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300">
                {order.extension?.estimated_delivery || '1-2 business days'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 font-bold text-xs text-stone-700 dark:text-stone-300 transition-colors"
          >
            Close Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
