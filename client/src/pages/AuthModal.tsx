import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  X,
  Sprout,
  ShoppingBag,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Film,
} from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="glossy-box border border-white/35 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl animate-scale-up grid grid-cols-1 md:grid-cols-12 max-h-[92vh] text-white">
        
        {/* Left Side: Glossy Branding & Highlights (Hidden on xs, visible on md+) */}
        <div className="hidden md:flex md:col-span-5 relative overflow-hidden flex-col justify-between p-6 text-white border-b md:border-b-0 md:border-r border-white/20 bg-white/5 backdrop-blur-md">
          {/* Top Logo & Tagline */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 bg-white shadow-lg shrink-0">
              <img
                src="/assets/logo.jpg"
                alt="FarmerInventory Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="font-black text-lg text-white drop-shadow">FarmerInventory</div>
              <div className="text-[11px] font-bold text-amber-300 drop-shadow">
                किसान से सीधा ग्राहक तक
              </div>
            </div>
          </div>

          {/* Middle Slogan & Highlight */}
          <div className="relative z-10 space-y-3.5 my-auto py-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-black uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Fasal wahi, raasta naya</span>
            </div>
            <h2 className="text-2xl font-black leading-tight text-white drop-shadow-md">
              Direct Connections. Fresh Produce, Zero Middlemen.
            </h2>
            <p className="text-xs text-stone-200 leading-relaxed drop-shadow font-medium">
              Experience transparent agricultural trade with live Mandi price recommendations, direct customer chats, and guaranteed payouts.
            </p>
          </div>

          {/* Bottom Demo Accounts Quick Switch */}
          <div className="relative z-10 p-3.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/20 text-xs space-y-2">
            <div className="text-[11px] font-bold text-amber-300">1-Click Demo Accounts:</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo('FARMER')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow border border-emerald-400/40"
              >
                👨‍🌾 Demo Farmer
              </button>
              <button
                type="button"
                onClick={() => fillDemo('CUSTOMER')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-amber-600/80 hover:bg-amber-500 text-white text-[11px] font-bold transition-all shadow border border-amber-400/40"
              >
                🛒 Demo Customer
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Form & Controls */}
        <div className="md:col-span-7 flex flex-col max-h-[92vh] overflow-y-auto bg-black/25">
          {/* Header */}
          <div className="p-5 border-b border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${
                  role === 'FARMER' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              >
                {role === 'FARMER' ? <Sprout className="w-5 h-5 text-white" /> : <ShoppingBag className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h3 className="font-black text-base text-white drop-shadow">
                  {role === 'FARMER' ? 'Kisan Portal / किसान पोर्टल' : 'Customer Portal / ग्राहक पोर्टल'}
                </h3>
                <p className="text-xs text-stone-300">
                  {isSignup ? 'Create your new direct account' : 'Sign in to your account'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Toggle Switch */}
          <div className="p-3.5 bg-black/35 border-b border-white/15 flex gap-2">
            <button
              type="button"
              onClick={() => setRole('FARMER')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'FARMER'
                  ? 'bg-emerald-600 text-white shadow-lg border border-emerald-400/50'
                  : 'bg-white/10 text-stone-300 hover:text-white hover:bg-white/15 border border-white/15'
              }`}
            >
              🌾 Farmer / किसान
            </button>
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'CUSTOMER'
                  ? 'bg-amber-600 text-white shadow-lg border border-amber-400/50'
                  : 'bg-white/10 text-stone-300 hover:text-white hover:bg-white/15 border border-white/15'
              }`}
            >
              🛒 Customer / ग्राहक
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-3.5">
              {isSignup && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-200">
                    {role === 'FARMER' ? 'Full Name / पूरा नाम' : 'Customer Name / ग्राहक का नाम'} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-300 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Gurpreet Singh"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs glossy-input placeholder-white/50 focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-200">
                  Username / उपयोगकर्ता नाम *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-300 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. gurpreet_punjab"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs glossy-input placeholder-white/50 focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-200">
                  Password / पासवर्ड *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-300 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs glossy-input placeholder-white/50 focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {isSignup && (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-200">
                      Contact Phone / संपर्क नंबर
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-300 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs glossy-input placeholder-white/50 focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-200">
                      {role === 'FARMER' ? 'Farm Location (e.g. Ludhiana, Punjab)' : 'Delivery Address'}
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-300 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={locationOrAddress}
                        onChange={(e) => setLocationOrAddress(e.target.value)}
                        placeholder={role === 'FARMER' ? 'Village, District, State' : 'Full Postal Address'}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs glossy-input placeholder-white/50 focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 disabled:opacity-50 cursor-pointer ${
                  role === 'FARMER'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-emerald-600/30'
                    : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-600/30'
                }`}
              >
                <span>{isSignup ? 'Create Account' : 'Sign In Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-emerald-300 hover:text-emerald-200 font-bold hover:underline cursor-pointer"
                >
                  {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo(role)}
                  className="text-amber-300 hover:text-amber-200 text-[11px] underline md:hidden cursor-pointer"
                >
                  Autofill Demo
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
