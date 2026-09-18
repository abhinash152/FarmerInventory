import React, { useState, useEffect } from 'react';
import { MandiBenchmark } from '../types';
import { useAuth } from '../context/AuthContext';
import { X, Scale, TrendingUp, DollarSign, ShieldCheck, Search, MapPin, Sparkles } from 'lucide-react';

interface MandiPriceModalProps {
  onClose: () => void;
}

export const MandiPriceModal: React.FC<MandiPriceModalProps> = ({ onClose }) => {
  const { user } = useAuth();

  // Detect state from logged in farmer's farm location
  const detectFarmerState = (): string => {
    if (!user || !user.farm_location) return 'All India';
    const loc = user.farm_location.toLowerCase();
    if (loc.includes('punjab')) return 'Punjab';
    if (loc.includes('haryana')) return 'Haryana';
    if (loc.includes('himachal')) return 'Himachal Pradesh';
    if (loc.includes('uttar pradesh') || loc.includes('up') || loc.includes('varanasi') || loc.includes('lucknow')) return 'Uttar Pradesh';
    if (loc.includes('maharashtra') || loc.includes('nashik') || loc.includes('pune') || loc.includes('nagpur')) return 'Maharashtra';
    if (loc.includes('gujarat') || loc.includes('anand') || loc.includes('surat') || loc.includes('rajkot')) return 'Gujarat';
    return 'All India';
  };

  const [selectedState, setSelectedState] = useState<string>(detectFarmerState());
  const [benchmarks, setBenchmarks] = useState<MandiBenchmark[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([
    'All India',
    'Punjab',
    'Haryana',
    'Himachal Pradesh',
    'Uttar Pradesh',
    'Maharashtra',
    'Gujarat',
  ]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMandi = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedState && selectedState !== 'All India') {
          params.append('state', selectedState);
        }
        if (search.trim()) {
          params.append('crop', search.trim());
        }

        const res = await fetch(`/api/tools/mandi-benchmarks?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setBenchmarks(data.benchmarks || []);
          if (data.available_states) {
            setAvailableStates(data.available_states);
          }
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };

    fetchMandi();
  }, [selectedState, search]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-amber-50/70 dark:bg-amber-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                  Statewise Govt Mandi & MSP Price Feed
                </h3>
                {user?.role === 'FARMER' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                    Farmer Detected
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                Official Department of Agriculture & Farmers Welfare APMC wholesale rates
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

        {/* State Selector & Search Bar */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 space-y-3">
          {/* State filter buttons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-stone-500 uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                Select State / Region:
              </label>
              {user?.farm_location && (
                <span className="text-[10px] text-emerald-600 font-semibold">
                  Farm Location: {user.farm_location}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableStates.map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedState(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedState === st
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search crop in ${selectedState} (Wheat, Apples, Tomatoes, Onions, Honey...)`}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Content Table / Cards */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="text-center py-10 text-xs text-stone-400">
              Fetching state Mandi rates...
            </div>
          ) : benchmarks.length === 0 ? (
            <div className="text-center py-10 text-xs text-stone-400">
              No crops found for {selectedState}. Try another state or search query.
            </div>
          ) : (
            benchmarks.map((b) => {
              const farmerGainPercent = Math.round(
                ((b.farmer_direct_benchmark - b.apmc_mandi_price) / b.apmc_mandi_price) * 100
              );
              const customerSavingsPercent = Math.round(
                ((b.retail_supermarket_price - b.farmer_direct_benchmark) / b.retail_supermarket_price) * 100
              );

              return (
                <div
                  key={`${b.crop_name}-${b.state}`}
                  className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-700/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {b.crop_name}
                      </span>
                      <span className="text-xs text-stone-400 font-medium">({b.hindi_name})</span>
                    </div>

                    {/* Mandi & State Tag */}
                    {b.mandi_name && (
                      <div className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{b.mandi_name}</span>
                      </div>
                    )}

                    <div className="text-[11px] text-stone-500">
                      Category: <strong>{b.category}</strong> • Per {b.unit}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      {b.govt_msp && (
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800 text-[10px] font-bold">
                          Govt MSP: ₹{b.govt_msp.toFixed(2)}
                        </span>
                      )}
                      <span className="text-stone-500 text-[11px]">
                        APMC Wholesale: <strong>₹{b.apmc_mandi_price.toFixed(2)}</strong>
                      </span>
                      <span className="text-stone-400 text-[11px]">
                        City Supermarket: <span className="line-through">₹{b.retail_supermarket_price.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right: Suggested Direct Benchmark */}
                  <div className="shrink-0 bg-white dark:bg-stone-900 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-right w-full md:w-auto">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">
                      Recommended Direct Price
                    </span>
                    <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      ₹{b.farmer_direct_benchmark.toFixed(2)}
                      <span className="text-xs font-normal text-stone-500">/{b.unit}</span>
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      +{farmerGainPercent}% Farmer Gain • -{customerSavingsPercent}% Buyer Saving
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="p-3 bg-stone-100/60 dark:bg-stone-800/60 border-t border-stone-200 dark:border-stone-800 text-center text-[11px] text-stone-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Rates updated daily from APMC e-NAM wholesale market terminals.</span>
        </div>
      </div>
    </div>
  );
};
