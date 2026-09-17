import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-sm animate-pulse flex flex-col gap-3">
      <div className="w-full h-44 bg-stone-200 dark:bg-stone-800 rounded-xl" />
      <div className="flex items-center justify-between">
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-20" />
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-16" />
      </div>
      <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
      <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
      <div className="mt-2 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
        <div className="h-7 bg-stone-200 dark:bg-stone-800 rounded w-24" />
        <div className="h-9 bg-stone-200 dark:bg-stone-800 rounded-lg w-28" />
      </div>
    </div>
  );
};

export const SkeletonStat: React.FC = () => {
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-sm animate-pulse flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-24" />
        <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded w-32" />
        <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-20" />
      </div>
      <div className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-stone-800" />
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex gap-4 bg-stone-50 dark:bg-stone-950">
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/6" />
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/4" />
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/6" />
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/6" />
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/6 ml-auto" />
      </div>
      <div className="divide-y divide-stone-100 dark:divide-stone-800/60 p-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-stone-200 dark:bg-stone-800 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/3" />
              <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/4" />
            </div>
            <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-20" />
            <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-24" />
            <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded-lg w-20 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonChart: React.FC = () => {
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-40" />
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-24" />
      </div>
      <div className="w-full h-64 bg-stone-100 dark:bg-stone-800/40 rounded-xl flex items-end gap-3 p-4">
        <div className="flex-1 bg-stone-200 dark:bg-stone-800 rounded-t h-1/3" />
        <div className="flex-1 bg-stone-200 dark:bg-stone-800 rounded-t h-1/2" />
        <div className="flex-1 bg-stone-200 dark:bg-stone-800 rounded-t h-3/4" />
        <div className="flex-1 bg-stone-200 dark:bg-stone-800 rounded-t h-2/3" />
        <div className="flex-1 bg-stone-200 dark:bg-stone-800 rounded-t h-4/5" />
        <div className="flex-1 bg-stone-200 dark:bg-stone-800 rounded-t h-1/2" />
        <div className="flex-1 bg-stone-200 dark:bg-stone-800 rounded-t h-full" />
      </div>
    </div>
  );
};
