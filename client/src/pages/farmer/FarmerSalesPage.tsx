import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sale } from '../../types';
import { AnimatedCounter } from '../../components/AnimatedCounter';
import { SkeletonTable } from '../../components/SkeletonLoaders';
import {
  DollarSign,
  TrendingUp,
  Download,
  Search,
  Calendar,
  User,
  ShoppingBag,
  FileSpreadsheet,
} from 'lucide-react';

export const FarmerSalesPage: React.FC = () => {
  const { token } = useAuth();
  const { error } = useToast();
  const { t } = useLanguage();

  const [sales, setSales] = useState<Sale[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalUnitsSold, setTotalUnitsSold] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSales = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/sales/farmer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSales(data.sales || []);
        setTotalRevenue(data.total_revenue || 0);
        setTotalUnitsSold(data.total_units_sold || 0);
      }
    } catch {
      error('Sales Error', 'Failed to retrieve sales records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [token]);

  const filteredSales = sales.filter((s) => {
    const pName = s.product?.product_name.toLowerCase() || '';
    const cName = s.customer?.customer_name.toLowerCase() || '';
    const q = search.toLowerCase();
    return pName.includes(q) || cName.includes(q);
  });

  const handleExportCSV = () => {
    if (sales.length === 0) return;

    const headers = ['Sale ID', 'Product', 'Customer', 'Quantity', 'Unit Price', 'Total Amount', 'Date'];
    const rows = sales.map((s) => [
      s.sale_id,
      `"${s.product?.product_name || ''}"`,
      `"${s.customer?.customer_name || ''}"`,
      s.quantity_sold,
      s.product?.price_per_unit || 0,
      s.total_amount,
      s.sale_date ? new Date(s.sale_date).toLocaleDateString() : '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Farmer_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t('nav_sales')}
          </h1>
          <p className="text-xs text-stone-500">
            Verified completed transactions, customer records, and accumulated revenue
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={sales.length === 0}
          className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center gap-2 border border-stone-200 dark:border-stone-700 transition-colors disabled:opacity-40"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Aggregate Metric Cards with Animated Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Gross Farm Revenue</span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              <AnimatedCounter prefix="₹" value={totalRevenue} decimals={2} />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Units Dispatched</span>
            <div className="text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
              <AnimatedCounter value={totalUnitsSold} />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-950 text-green-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Completed Orders</span>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              <AnimatedCounter value={sales.length} />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by product or customer name..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Sales Table */}
      {isLoading ? (
        <SkeletonTable rows={6} />
      ) : filteredSales.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 p-8 space-y-2">
          <ShoppingBag className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="font-bold text-base text-stone-700 dark:text-stone-300">
            No sales records yet
          </h3>
          <p className="text-xs text-stone-400">
            When you accept pending orders in the Kanban board, sales transactions are automatically created here!
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Sale ID</th>
                  <th className="p-4">Harvest / Product</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Quantity Sold</th>
                  <th className="p-4">Total Realization</th>
                  <th className="p-4 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filteredSales.map((s) => (
                  <tr
                    key={s.sale_id}
                    className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      #{s.sale_id}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                        {s.product?.product_name}
                      </div>
                      <div className="text-[11px] text-stone-400">{s.product?.category}</div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-stone-800 dark:text-stone-200">
                        {s.customer?.customer_name}
                      </div>
                      <div className="text-[11px] text-stone-400">{s.customer?.address || 'Verified Address'}</div>
                    </td>

                    <td className="p-4 font-bold text-stone-900 dark:text-stone-100">
                      {s.quantity_sold} <span className="text-xs font-normal text-stone-500">{s.product?.unit}</span>
                    </td>

                    <td className="p-4">
                      <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        ₹{Number(s.total_amount).toFixed(2)}
                      </span>
                    </td>

                    <td className="p-4 text-right text-stone-500 font-medium">
                      {s.sale_date ? new Date(s.sale_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
