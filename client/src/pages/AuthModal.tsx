import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { X, Sprout, ShoppingBag, Lock, User, Phone, MapPin, ArrowRight, Sparkles } from 'lucide-react';

interface AuthModalProps {
  initialRole?: 'FARMER' | 'CUSTOMER';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialRole = 'CUSTOMER',
  onClose,
  onSuccess,
}) => {
  const { login } = useAuth();
  const { success, error } = useToast();

  const [role, setRole] = useState<'FARMER' | 'CUSTOMER'>(initialRole);
  const [isSignup, setIsSignup] = useState<boolean>(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [locationOrAddress, setLocationOrAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fillDemo = (demoRole: 'FARMER' | 'CUSTOMER') => {
    setRole(demoRole);
    setIsSignup(false);
    if (demoRole === 'FARMER') {
      setUsername('gurpreet_punjab');
      setPassword('password123');
    } else {
      setUsername('rahul_v');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint =
        role === 'FARMER'
          ? isSignup
            ? '/api/auth/farmer/signup'
            : '/api/auth/farmer/login'
          : isSignup
          ? '/api/auth/customer/signup'
          : '/api/auth/customer/login';

      const payload = isSignup
        ? role === 'FARMER'
          ? {
              full_name: fullName,
              username,
              password,
              contact_number: contactNumber,
              farm_location: locationOrAddress,
            }
          : {
              customer_name: fullName,
              username,
              password,
              contact_number: contactNumber,
              address: locationOrAddress,
            }
        : { username, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.token && data.user) {
        login(data.token, data.user);
        success(
          `Welcome, ${data.user.name}! 🌾`,
          `Signed in as ${role === 'FARMER' ? 'Farmer' : 'Customer'}`
        );
        onSuccess();
        onClose();
      } else {
        error('Authentication Failed', data.message || 'Please check your credentials');
      }
    } catch {
      error('Connection Error', 'Failed to communicate with authentication service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${
                role === 'FARMER' ? 'bg-emerald-600' : 'bg-amber-600'
              }`}
            >
              {role === 'FARMER' ? <Sprout className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                {role === 'FARMER' ? 'Kisan Portal' : 'Customer Portal'}
              </h3>
              <p className="text-xs text-stone-500">
                {isSignup ? 'Create your new account' : 'Sign in to your account'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Toggle Switch */}
        <div className="p-4 bg-stone-50/70 dark:bg-stone-950/40 border-b border-stone-100 dark:border-stone-800 flex gap-2">
          <button
            type="button"
            onClick={() => setRole('FARMER')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'FARMER'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }`}
          >
            🌾 Farmer / किसान
          </button>
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'CUSTOMER'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }`}
          >
            🛒 Customer / ग्राहक
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isSignup && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-600 dark:text-stone-300">
                {role === 'FARMER' ? 'Full Name / पूरा नाम' : 'Customer Name / ग्राहक का नाम'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Gurpreet Singh"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-600 dark:text-stone-300">
              Username / उपयोगकर्ता नाम
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. gurpreet_punjab"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-600 dark:text-stone-300">
              Password / पासवर्ड
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {isSignup && (
            <>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-300">
                  Contact Phone / संपर्क नंबर
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-300">
                  {role === 'FARMER' ? 'Farm Location (e.g. Ludhiana, Punjab)' : 'Delivery Address'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={locationOrAddress}
                    onChange={(e) => setLocationOrAddress(e.target.value)}
                    placeholder={role === 'FARMER' ? 'Village, District, State' : 'Full Postal Address'}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 mt-2 ${
              role === 'FARMER'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
            }`}
          >
            <span>{isSignup ? 'Create Account' : 'Sign In Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Demo 1-Click Autofill */}
          <div className="pt-2 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
            <button
              type="button"
              onClick={() => fillDemo(role)}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-[11px] underline"
            >
              Autofill Demo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
