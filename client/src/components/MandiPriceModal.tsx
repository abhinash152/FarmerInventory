import React, { useState, useEffect } from 'react';
import { MandiBenchmark } from '../types';
import { X, Scale, TrendingUp, DollarSign, ShieldCheck, Search } from 'lucide-react';

interface MandiPriceModalProps {
  onClose: () => void;
}

export const MandiPriceModal: React.FC<MandiPriceModalProps> = ({ onClose }) => {
  const [benchmarks, setBenchmarks] = useState<MandiBenchmark[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMandi = async () => {
      try {
        const res = await fetch('/api/tools/mandi-benchmarks');
        const data = await res.json();
        if (data.success) {
          setBenchmarks(data.benchmarks || []);
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    fetchMandi();
  }, []);

  const filtered = benchmarks.filter(
    (b) =>
      b.crop_name.toLowerCase().includes(search.toLowerCase()) ||
      b.hindi_name.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-amber-50/60 dark:bg-amber-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                Official Govt Mandi & MSP Price Benchmark
              </h3>
              <p className="text-xs text-stone-500">
                Ministry of Agriculture & Farmers Welfare Reference Rates
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

        {/* Search Bar */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search crop name (Wheat, Tomatoes, Basmati, Honey...)"
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Content Table / Cards */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="text-center py-10 text-xs text-stone-400">
              Loading official market rates...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-xs text-stone-400">
              No crops matching "{search}" found.
            </div>
          ) : (
            filtered.map((b) => {
              const farmerGainPercent = Math.round(
                ((b.farmer_direct_benchmark - b.apmc_mandi_price) / b.apmc_mandi_price) * 100
              );
              const customerSavingsPercent = Math.round(
                ((b.retail_supermarket_price - b.farmer_direct_benchmark) / b.retail_supermarket_price) * 100
              );

              return (
                <div
                  key={b.crop_name}
                  className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-700/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                        {b.crop_name}
                      </span>
                      <span className="text-xs text-stone-400 font-medium">({b.hindi_name})</span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Category: <strong>{b.category}</strong> • Per {b.unit}
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs">
                      {b.govt_msp && (
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800 text-[10px] font-bold">
                          Govt MSP: ₹{b.govt_msp.toFixed(2)}
                        </span>
                      )}
                      <span className="text-stone-500 text-[11px]">
                        APMC Mandi: <strong>₹{b.apmc_mandi_price.toFixed(2)}</strong>
                      </span>
                      <span className="text-stone-400 text-[11px] line-through">
                        Supermarket: ₹{b.retail_supermarket_price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex items-center gap-3 justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-stone-200 dark:border-stone-700">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                        Farmer Direct Price
                      </div>
                      <div className="text-lg font-black text-stone-900 dark:text-stone-100">
                        ₹{b.farmer_direct_benchmark.toFixed(2)}
                        <span className="text-xs text-stone-500 font-normal">/{b.unit}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 text-center">
                        Farmer: +{farmerGainPercent}% vs Mandi
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 text-center">
                        Customer: -{customerSavingsPercent}% vs Retail
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/40 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Fair Trade Direct Benchmark
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
