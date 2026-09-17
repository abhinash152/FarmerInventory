import React, { useState, useEffect } from 'react';
import { Product, PaymentMethod } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  X,
  Plus,
  Minus,
  Truck,
  CreditCard,
  Banknote,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderModalProps {
  product: Product;
  onClose: () => void;
  onOrderSuccess: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  product,
  onClose,
  onOrderSuccess,
}) => {
  const { token, user } = useAuth();
  const { success, error } = useToast();

  const [quantity, setQuantity] = useState<number>(1);
  const [deliveryPincode, setDeliveryPincode] = useState<string>('110001');
  const [deliveryAddress, setDeliveryAddress] = useState<string>(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [deliveryFee, setDeliveryFee] = useState<number>(30);
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('1-2 days');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnlinePaying, setIsOnlinePaying] = useState(false);
  const [onlinePaidSuccess, setOnlinePaidSuccess] = useState(false);

  const price = Number(product.price_per_unit);
  const subtotal = price * quantity;
  const isFreeDelivery = subtotal >= 500;
  const finalDeliveryFee = isFreeDelivery ? 0 : deliveryFee;
  const grandTotal = subtotal + finalDeliveryFee;

  // Calculate delivery fee on pincode change
  useEffect(() => {
    if (!deliveryPincode || deliveryPincode.length < 3) return;

    const calc = async () => {
      try {
        const res = await fetch('/api/tools/pincode-delivery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pincode: deliveryPincode, subtotal }),
        });
        const data = await res.json();
        if (data.success) {
          setDeliveryFee(data.base_fee);
          setEstimatedDelivery(data.estimated_delivery);
        }
      } catch {
        // ignore
      }
    };

    const timer = setTimeout(calc, 400);
    return () => clearTimeout(timer);
  }, [deliveryPincode, subtotal]);

  const handleSimulateUPI = () => {
    setIsOnlinePaying(true);
    setTimeout(() => {
      setIsOnlinePaying(false);
      setOnlinePaidSuccess(true);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    }, 1800);
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      error('Authentication required', 'Please sign in as a customer to place orders');
      return;
    }

    if (quantity > product.stock_quantity) {
      error('Stock limit reached', `Only ${product.stock_quantity} ${product.unit} available in farm inventory`);
      return;
    }

    if (paymentMethod === 'ONLINE' && !onlinePaidSuccess) {
      error('Payment pending', 'Please tap "Simulate UPI Payment" to complete the payment authorization');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.product_id,
          quantity,
          payment_method: paymentMethod,
          delivery_pincode: deliveryPincode,
          delivery_address: deliveryAddress || 'Registered delivery address',
        }),
      });

      const data = await res.json();
      if (data.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        success(
          'Order Placed Successfully! 🌾',
          `Order #${data.order.order_id} has been submitted to ${product.farmer?.full_name || 'the farmer'}.`
        );
        onOrderSuccess();
        onClose();
      } else {
        error('Order failed', data.message || 'Could not place order');
      }
    } catch (err: any) {
      error('Error', 'Network error placing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
              Direct Farm Checkout
            </span>
            <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100">
              {product.product_name}
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
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Product Glance */}
          <div className="flex items-center gap-4 bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.product_name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-2xl">
                🌾
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm truncate">{product.product_name}</h4>
              <p className="text-xs text-stone-500">
                Farmer: <strong>{product.farmer?.full_name}</strong> • {product.farmer?.farm_location}
              </p>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                ₹{price.toFixed(2)} per {product.unit}
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Select Quantity ({product.unit})
            </label>
            <div className="flex items-center justify-between bg-stone-100 dark:bg-stone-800 p-2 rounded-2xl border border-stone-200 dark:border-stone-700">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-xl bg-white dark:bg-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-200 shadow-sm disabled:opacity-40"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-center">
                <span className="text-xl font-black">{quantity}</span>
                <span className="text-xs text-stone-500 ml-1.5">{product.unit}</span>
              </div>
              <button
                onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                disabled={quantity >= product.stock_quantity}
                className="w-10 h-10 rounded-xl bg-white dark:bg-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-200 shadow-sm disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between text-[11px] text-stone-500 mt-1.5 px-1">
              <span>Current Stock: {product.stock_quantity} {product.unit}</span>
              <span>Subtotal: <strong>₹{subtotal.toFixed(2)}</strong></span>
            </div>
          </div>

          {/* Delivery Details & Pincode */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
              Delivery Address & Pincode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <input
                  type="text"
                  value={deliveryPincode}
                  onChange={(e) => setDeliveryPincode(e.target.value)}
                  placeholder="Pincode"
                  maxLength={6}
                  className="w-full px-3 py-2 rounded-xl text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Street / Colony / Flat"
                  className="w-full px-3 py-2 rounded-xl text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800">
              <span className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Est. Time: <strong>{estimatedDelivery}</strong></span>
              </span>
              <span className="font-bold">
                {isFreeDelivery ? (
                  <span className="text-emerald-600">FREE Delivery</span>
                ) : (
                  <span>₹{finalDeliveryFee.toFixed(2)}</span>
                )}
              </span>
            </div>
            {isFreeDelivery && (
              <p className="text-[11px] text-emerald-600 font-semibold text-right">
                🎉 Free delivery applied (orders above ₹500)!
              </p>
            )}
          </div>

          {/* Payment Method Choice */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
              Payment Choice
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setPaymentMethod('COD'); setOnlinePaidSuccess(false); }}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  {paymentMethod === 'COD' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className="font-bold text-xs mt-1">Cash on Delivery</span>
                <span className="text-[10px] text-stone-500">Pay cash upon harvest arrival</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('ONLINE')}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all ${
                  paymentMethod === 'ONLINE'
                    ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  {paymentMethod === 'ONLINE' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <span className="font-bold text-xs mt-1">Online UPI / Card</span>
                <span className="text-[10px] text-stone-500">Instant digital checkout</span>
              </button>
            </div>

            {/* Online Payment Interactive Simulator */}
            {paymentMethod === 'ONLINE' && (
              <div className="mt-3 p-4 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    Instant UPI QR & Gateway Simulator
                  </span>
                  <span>Amount: ₹{grandTotal.toFixed(2)}</span>
                </div>
                {onlinePaidSuccess ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>UPI Payment Verified Successfully!</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSimulateUPI}
                    disabled={isOnlinePaying}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isOnlinePaying ? 'Simulating UPI Payment...' : 'Authorize Demo Payment (₹' + grandTotal.toFixed(2) + ')'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600 dark:text-stone-300">
              <span>Items Total ({quantity} {product.unit}):</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600 dark:text-stone-300">
              <span>Estimated Delivery Fee:</span>
              <span>{isFreeDelivery ? '₹0.00 (FREE)' : `₹${finalDeliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-100 dark:border-stone-800">
              <span>Grand Total:</span>
              <span className="text-emerald-600 dark:text-emerald-400">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || (paymentMethod === 'ONLINE' && !onlinePaidSuccess)}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            {isSubmitting ? 'Submitting Order...' : 'Confirm & Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};
