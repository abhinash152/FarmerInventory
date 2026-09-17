import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { Order, TrackingStep } from '../../types';
import { KanbanBoard } from '../../components/KanbanBoard';
import { SkeletonCard } from '../../components/SkeletonLoaders';
import { RefreshCw, Inbox, AlertCircle } from 'lucide-react';

export const FarmerOrdersPage: React.FC = () => {
  const { token } = useAuth();
  const { success, error } = useToast();
  const { t } = useLanguage();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingId, setIsProcessingId] = useState<number | null>(null);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/orders/farmer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch {
      error('Orders Error', 'Failed to retrieve order inbox');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Polling for new orders
    return () => clearInterval(interval);
  }, [token]);

  const handleRespond = async (orderId: number, action: 'ACCEPTED' | 'REJECTED') => {
    if (!token) return;
    setIsProcessingId(orderId);

    try {
      const res = await fetch(`/api/orders/${orderId}/respond`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (data.success) {
        if (action === 'ACCEPTED') {
          success(
            'Order Accepted! 🌾',
            `Inventory atomically decremented. Sale recorded.`
          );
        } else {
          success('Order Rejected', `Order #${orderId} has been marked rejected.`);
        }
        await fetchOrders();
      } else {
        error('Action Failed', data.message || 'Could not update order');
      }
    } catch (err: any) {
      error('Network Error', 'Failed to respond to order');
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleUpdateTracking = async (orderId: number, step: TrackingStep) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/tracking`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tracking_step: step }),
      });

      const data = await res.json();
      if (data.success) {
        success('Tracking Updated 🚚', `Delivery status moved to ${step}.`);
        await fetchOrders();
      } else {
        error('Update Error', data.message || 'Failed to update tracking');
      }
    } catch {
      error('Network Error', 'Failed to update tracking stage');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t('orders_title')}
          </h1>
          <p className="text-xs text-stone-500">
            Kanban board: Accept or reject customer requests, trigger automatic stock decrement, and advance delivery stages
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <KanbanBoard
          orders={orders}
          onRespond={handleRespond}
          onUpdateTracking={handleUpdateTracking}
          isProcessingId={isProcessingId}
        />
      )}
    </div>
  );
};
