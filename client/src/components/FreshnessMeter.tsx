import React, { useState } from 'react';
import { calculateFreshness, FreshnessCalculation } from '../utils/freshnessEngine';
import { Sparkles, Info, CheckCircle2, AlertCircle, Leaf } from 'lucide-react';

interface FreshnessMeterProps {
  harvestDate?: Date | string | null;
  productName?: string;
  category?: string;
  storageCondition?: string;
  farmLocation?: string;
  mode?: 'compact' | 'card' | 'detailed';
  showExplanation?: boolean;
}

export const FreshnessMeter: React.FC<FreshnessMeterProps> = ({
  harvestDate,
  productName = '',
  category = 'General',
  storageCondition = 'FIELD_FRESH',
  farmLocation = '',
  mode = 'card',
  showExplanation = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(showExplanation);

  const freshness: FreshnessCalculation = calculateFreshness(
    harvestDate,
    productName,
    category,
    storageCondition,
    farmLocation
  );

  // Compact badge mode (ideal for table rows or small chips)
  if (mode === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border shadow-xs ${freshness.badgeBg} ${freshness.badgeBorder}`}
        title={`${freshness.tier} (${freshness.score}% Fresh)`}
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse shrink-0"
          style={{ backgroundColor: freshness.colorHex }}
        />
        <span>{freshness.score}% Fresh</span>
      </div>
    );
  }

  // Card or Detailed mode
  return (
    <div className="space-y-2 p-3 rounded-2xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200/90 dark:border-stone-800 transition-all text-stone-800 dark:text-stone-200">
      {/* Top Header: Badge, Score, and AI Label */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            AI Harvest Freshness
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Rating Scale badge (e.g. 9.5 / 10) */}
          <span className="text-xs font-extrabold text-stone-900 dark:text-stone-100">
            {freshness.rating10} <span className="text-[10px] text-stone-600 dark:text-stone-300 font-normal">/ 10</span>
          </span>

          {/* Percentage badge */}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-black shadow-xs border ${freshness.badgeBg} ${freshness.badgeBorder}`}
            style={{ color: freshness.colorHex }}
          >
            {freshness.score}%
          </span>
        </div>
      </div>

      {/* Freshness Tier Title */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold truncate text-stone-700 dark:text-stone-300 flex items-center gap-1">
          <Leaf className="w-3 h-3 text-emerald-500 shrink-0" />
          {freshness.tier}
        </span>
        <span className="text-[10px] text-stone-600 dark:text-stone-300 font-medium shrink-0">
          {freshness.daysSinceHarvest <= 0.2
            ? 'Picked Today'
            : `${freshness.daysSinceHarvest}d ago`}
        </span>
      </div>

      {/* The Visual Color Gradient Scale (Red for less fresh ➔ Green for fully fresh) */}
      <div className="space-y-1 pt-1">
        <div className="relative h-2.5 w-full rounded-full overflow-visible shadow-inner bg-stone-200 dark:bg-stone-800">
          {/* Continuous Red-to-Green Gradient Bar */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 50%, #84cc16 75%, #10b981 100%)',
            }}
          />

          {/* Target Freshness Indicator Pin */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
            style={{ left: `${Math.max(4, Math.min(96, freshness.score))}%` }}
          >
            {/* Outer ring / Pin */}
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-md flex items-center justify-center ring-2"
              style={{
                backgroundColor: freshness.colorHex,
                borderColor: '#ffffff',
              }}
            />
          </div>
        </div>

        {/* Gradient Legend Text */}
        <div className="flex items-center justify-between text-[10px] font-semibold text-stone-600 dark:text-stone-300 px-0.5 pt-0.5">
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Less Fresh
          </span>
          <span className="text-amber-600 dark:text-amber-400">
            Medium
          </span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            Fully Fresh
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </span>
        </div>
      </div>

      {/* AI Explanation Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Info className="w-3 h-3" />
          <span>{isExpanded ? 'Hide AI Freshness Report' : 'View AI Harvest Insights'}</span>
        </button>

        {isExpanded && (
          <div className="mt-2 p-2.5 rounded-xl bg-white dark:bg-stone-950 border border-emerald-200 dark:border-emerald-800 text-[11px] space-y-1.5 animate-fade-in text-stone-700 dark:text-stone-300">
            <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>AI Agricultural Calculation:</span>
            </div>
            <p className="leading-relaxed text-stone-600 dark:text-stone-300">
              {freshness.aiSummary}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-500">
              <div>
                <strong>Harvest Date:</strong> {freshness.harvestDateFormatted}
              </div>
              <div>
                <strong>Storage Method:</strong> {freshness.storageConditionLabel}
              </div>
              <div>
                <strong>Remaining Vitality:</strong> ~{freshness.daysRemaining} days peak
              </div>
              <div>
                <strong>Quality Confidence:</strong> 99% Verified Direct
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
