import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { SkeletonChart, SkeletonStat } from '../../components/SkeletonLoaders';
import { AnimatedCounter } from '../../components/AnimatedCounter';
import { PulsingBadge } from '../../components/PulsingBadge';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Package,
  Calendar,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  Flame,
} from 'lucide-react';

export const FarmerReportsPage: React.FC = () => {
  const { token } = useAuth();
  const { error } = useToast();
  const { t } = useLanguage();

  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          fetch('/api/reports/farmer/stats', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/reports/farmer/analytics', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const statsData = await statsRes.json();
        const analyticsData = await analyticsRes.json();

        if (statsData.success) setStats(statsData.stats);
        if (analyticsData.success) setAnalytics(analyticsData.analytics);
      } catch {
        error('Report Error', 'Failed to retrieve analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [token]);

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];

  const orderStatusPieData = stats
    ? [
        { name: 'Pending', value: stats.orders_by_status.PENDING, color: '#f59e0b' },
        { name: 'Accepted', value: stats.orders_by_status.ACCEPTED, color: '#10b981' },
        { name: 'Rejected', value: stats.orders_by_status.REJECTED, color: '#ef4444' },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
          {t('nav_reports')}
        </h1>
        <p className="text-xs text-stone-500">
          Comprehensive financial performance, demand trends, inventory risks, and AI-assisted 7-day revenue forecast
        </p>
      </div>

      {/* Top Stat Summary Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Gross Realized Revenue</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              <AnimatedCounter prefix="₹" value={stats.total_revenue} decimals={2} />
            </div>
            <div className="text-[11px] text-stone-400 mt-1">All-time farm earnings</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Volume Sold</span>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
              <AnimatedCounter value={stats.total_units_sold} suffix=" units" />
            </div>
            <div className="text-[11px] text-stone-400 mt-1">Across all product lines</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Active Inventory</span>
            <div className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
              <AnimatedCounter value={stats.total_stock} suffix=" units" />
            </div>
            <div className="text-[11px] text-stone-400 mt-1">{stats.total_products} unique crops</div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Low Stock Warnings</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              <AnimatedCounter value={stats.low_stock_count} />
            </div>
            <div className="text-[11px] text-stone-400 mt-1">Items at risk of running out</div>
          </div>
        </div>
      ) : null}

      {/* Row 1: Revenue Trends AreaChart & Orders Distribution PieChart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Over Time */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                Daily Revenue Trend (Last 14 Days)
              </h3>
            </div>
            <span className="text-xs text-stone-400 font-medium">Auto-animating</span>
          </div>

          {isLoading || !analytics ? (
            <SkeletonChart />
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.revenue_trends}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val) => val.slice(5)}
                    stroke="#888888"
                    fontSize={11}
                  />
                  <YAxis stroke="#888888" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toFixed(2)}`, 'Revenue']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{
                      backgroundColor: 'rgba(23, 23, 23, 0.95)',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Orders by Status
            </h3>
          </div>

          {isLoading || !stats ? (
            <SkeletonChart />
          ) : (
            <div className="h-72 w-full flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={orderStatusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [val, name]}
                    contentStyle={{
                      backgroundColor: 'rgba(23, 23, 23, 0.95)',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Pending: {stats.orders_by_status.PENDING}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Accepted: {stats.orders_by_status.ACCEPTED}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Rejected: {stats.orders_by_status.REJECTED}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Best-selling Products (BarChart) & 7-Day Revenue Forecast (LineChart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Products */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                Top Performing Crops (Units Sold)
              </h3>
            </div>
            <span className="text-xs text-stone-400">Demand volume</span>
          </div>

          {isLoading || !analytics ? (
            <SkeletonChart />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.best_sellers}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={11} />
                  <Tooltip
                    formatter={(val, name) => [val, name === 'units' ? 'Units Sold' : 'Revenue']}
                    contentStyle={{
                      backgroundColor: 'rgba(23, 23, 23, 0.95)',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="units" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* 7-Day Future Revenue Forecast Projection */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                7-Day Revenue Forecast (AI Projection)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
              Predictive Model
            </span>
          </div>

          {isLoading || !analytics ? (
            <SkeletonChart />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.forecast}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => v.slice(5)}
                    stroke="#888888"
                    fontSize={11}
                  />
                  <YAxis stroke="#888888" fontSize={11} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    formatter={(v) => [`₹${Number(v).toFixed(2)}`, 'Projected']}
                    contentStyle={{
                      backgroundColor: 'rgba(23, 23, 23, 0.95)',
                      borderRadius: '12px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="projected_revenue"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: '#f59e0b' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Busiest Sales Days & Low Stock Risk Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Busiest Days of Week */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Busiest Days of the Week
            </h3>
          </div>
          {isLoading || !analytics ? (
            <SkeletonChart />
          ) : (
            <div className="space-y-3">
              {analytics.busiest_days.map((d: any) => (
                <div key={d.day} className="flex items-center gap-3 text-xs">
                  <span className="w-24 font-bold text-stone-700 dark:text-stone-300">{d.day}</span>
                  <div className="flex-1 bg-stone-100 dark:bg-stone-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(10, d.count * 25))}%`,
                      }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono text-stone-500">
                    {d.count} sales
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert Risk List */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                Critical Low-Stock Items
              </h3>
            </div>
            <span className="text-xs text-stone-400">Refill priority</span>
          </div>

          {isLoading || !stats ? (
            <SkeletonChart />
          ) : stats.low_stock_items.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              🎉 All product lines are safely above their alert thresholds!
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats.low_stock_items.map((item: any) => (
                <div
                  key={item.product_id}
                  className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <strong className="text-stone-900 dark:text-stone-100 font-bold">
                      {item.product_name}
                    </strong>
                    <div className="text-[11px] text-stone-500">
                      Category: {item.category} • Alert Threshold: {item.low_stock_threshold} {item.unit}
                    </div>
                  </div>
                  <PulsingBadge
                    currentStock={item.stock_quantity}
                    threshold={item.low_stock_threshold}
                    unit={item.unit}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
