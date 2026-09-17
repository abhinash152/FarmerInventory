import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface PulsingBadgeProps {
  currentStock: number;
  threshold?: number;
  unit?: string;
  className?: string;
}

export const PulsingBadge: React.FC<PulsingBadgeProps> = ({
  currentStock,
  threshold = 5,
  unit = 'units',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60 shadow-sm relative overflow-hidden ${className}`}
    >
      {/* Pulsing indicator dot */}
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
      </span>
      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
      <span>
        Low Stock: <strong className="font-bold">{currentStock} {unit}</strong> (Alert ≤ {threshold})
      </span>
    </span>
  );
};
