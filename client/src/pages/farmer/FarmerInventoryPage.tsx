import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../types';
import { PulsingBadge } from '../../components/PulsingBadge';
import { SkeletonTable } from '../../components/SkeletonLoaders';
import { AnimatedCounter } from '../../components/AnimatedCounter';
import {
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Package,
  Search,
  CheckCircle2,
  TrendingUp,
  X,
  Sparkles,
} from 'lucide-react';

export const FarmerInventoryPage: React.FC = () => {
  const { token } = useAuth();
  const { success, error } = useToast();
  const { t } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal states for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [unit, setUnit] = useState('kg');
  const [pricePerUnit, setPricePerUnit] = useState<number>(30);
  const [threshold, setThreshold] = useState<number>(5);
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInventory = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/products/farmer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch {
      error('Inventory Error', 'Failed to retrieve farm inventory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [token]);

  const openAddModal = () => {
    setEditingProduct(null);
    setProductName('');
    setCategory('Vegetables');
    setStockQuantity(20);
    setUnit('kg');
    setPricePerUnit(35);
    setThreshold(5);
    setImageUrl('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductName(p.product_name);
    setCategory(p.category || 'Vegetables');
    setStockQuantity(p.stock_quantity);
    setUnit(p.unit);
    setPricePerUnit(Number(p.price_per_unit));
    setThreshold(p.low_stock_threshold ?? 5);
    setImageUrl(p.image_url || '');
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    try {
      const url = editingProduct ? `/api/products/${editingProduct.product_id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_name: productName,
          category,
          stock_quantity: stockQuantity,
          unit,
          price_per_unit: pricePerUnit,
          low_stock_threshold: threshold,
          image_url: imageUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        success(
          editingProduct ? 'Product Updated! 🌾' : 'Product Added! 🌾',
          `"${productName}" is now active in your farm catalog.`
        );
        setIsModalOpen(false);
        fetchInventory();
      } else {
        error('Error saving', data.message || 'Could not save product');
      }
    } catch {
      error('Network Error', 'Failed to communicate with server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from inventory?`)) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        success('Product Deleted', `"${name}" removed.`);
        setProducts((prev) => prev.filter((p) => p.product_id !== productId));
      } else {
        error('Delete Error', data.message || 'Could not delete product');
      }
    } catch {
      error('Network Error', 'Could not delete product');
    }
  };

  const lowStockItems = products.filter((p) => p.is_low_stock);
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock_quantity, 0);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const distinctCategories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ) as string[];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Stats Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
            {t('inventory_title')}
          </h1>
          <p className="text-xs text-stone-500">
            Monitor real-time crop inventory levels, thresholds, and product catalog
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t('add_product')}</span>
        </button>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Products</span>
            <div className="text-2xl font-black text-stone-900 dark:text-stone-100 mt-0.5">
              <AnimatedCounter value={products.length} />
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Units in Stock</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              <AnimatedCounter value={totalStockUnits} />
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950 text-green-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Low Stock Alerts</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">
              <AnimatedCounter value={lowStockItems.length} />
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner if items need attention */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 flex items-start gap-3 text-amber-900 dark:text-amber-100 animate-fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-bounce-subtle" />
          <div className="flex-1">
            <h4 className="font-bold text-sm">
              {lowStockItems.length} product(s) are below alert thresholds!
            </h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {lowStockItems.map((item) => (
                <span
                  key={item.product_id}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/90 dark:bg-stone-900/90 border border-amber-300 dark:border-amber-700 flex items-center gap-1.5"
                >
                  <span>{item.product_name}:</span>
                  <strong className="text-amber-700 dark:text-amber-300 font-bold">
                    {item.stock_quantity} {item.unit}
                  </strong>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-stone-900 p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by product name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === 'ALL'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
            }`}
          >
            All
          </button>
          {distinctCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      {isLoading ? (
        <SkeletonTable rows={6} />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 p-8 space-y-3">
          <Package className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
          <h3 className="font-bold text-base text-stone-700 dark:text-stone-300">
            No products match your criteria
          </h3>
          <p className="text-xs text-stone-400">
            Try adjusting your search query or add a new harvest crop above.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Crop / Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Stock Level</th>
                  <th className="p-4">Price / Unit</th>
                  <th className="p-4">Threshold</th>
                  <th className="p-4">Performance</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filteredProducts.map((p) => (
                  <tr
                    key={p.product_id}
                    className="hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.product_name}
                            className="w-11 h-11 rounded-xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-lg">
                            🌾
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                            {p.product_name}
                          </div>
                          <div className="text-[11px] text-stone-400">ID: #{p.product_id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-stone-600 dark:text-stone-300">
                      <span className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                        {p.category || 'General'}
                      </span>
                    </td>

                    <td className="p-4">
                      {p.is_low_stock ? (
                        <PulsingBadge
                          currentStock={p.stock_quantity}
                          threshold={p.low_stock_threshold ?? 5}
                          unit={p.unit}
                        />
                      ) : (
                        <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                          {p.stock_quantity} <span className="text-xs font-normal text-stone-500">{p.unit}</span>
                        </span>
                      )}
                    </td>

                    <td className="p-4 font-extrabold text-stone-900 dark:text-stone-100">
                      ₹{Number(p.price_per_unit).toFixed(2)}
                      <span className="text-xs font-normal text-stone-400">/{p.unit}</span>
                    </td>

                    <td className="p-4 text-stone-500">
                      ≤ {p.low_stock_threshold ?? 5} {p.unit}
                    </td>

                    <td className="p-4 text-[11px] text-stone-500">
                      <div>Sold: <strong>{p.total_units_sold ?? 0} {p.unit}</strong></div>
                      <div>Revenue: <strong className="text-emerald-600">₹{(p.total_revenue ?? 0).toFixed(0)}</strong></div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(p)}
                          title="Edit product"
                          className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.product_id, p.product_name)}
                          title="Delete product"
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                {editingProduct ? t('edit_product') : t('add_product')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
                  {t('product_name')} *
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Royal Delicious Mountain Apples"
                  className="w-full p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
                    {t('category')}
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Vegetables">Vegetables / सब्जियां</option>
                    <option value="Fruits">Fruits / फल</option>
                    <option value="Grains">Grains / अनाज</option>
                    <option value="Dairy">Dairy / दुग्ध उत्पाद</option>
                    <option value="Honey & Sweeteners">Honey & Sweeteners / शहद</option>
                    <option value="Spices & Herbs">Spices & Herbs / मसाले</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
                    {t('unit')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="kg, dozen, jar, bunch, crate"
                    className="w-full p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
                    {t('stock_quantity')} *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
                    {t('price_per_unit')} *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    min={0}
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
                    {t('threshold')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600 dark:text-stone-300">
                  {t('image_url')}
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl text-xs border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 font-bold text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                >
                  {isSubmitting ? 'Saving...' : t('save_product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
