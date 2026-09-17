import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { OrderStatus } from '@prisma/client';

export const getFarmerDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const farmerId = req.user?.userId;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const products = await prisma.product.findMany({
      where: { farmer_id: farmerId },
    });

    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock_quantity, 0);

    const lowStockItems = products.filter(
      (p) => p.stock_quantity <= (p.low_stock_threshold ?? 5)
    );
    const lowStockCount = lowStockItems.length;

    const [pendingOrders, acceptedOrders, rejectedOrders] = await Promise.all([
      prisma.order.count({ where: { farmer_id: farmerId, status: OrderStatus.PENDING } }),
      prisma.order.count({ where: { farmer_id: farmerId, status: OrderStatus.ACCEPTED } }),
      prisma.order.count({ where: { farmer_id: farmerId, status: OrderStatus.REJECTED } }),
    ]);

    const sales = await prisma.sale.findMany({
      where: { farmer_id: farmerId },
      select: { total_amount: true, quantity_sold: true },
    });

    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.total_amount), 0);
    const totalUnitsSold = sales.reduce((sum, s) => sum + s.quantity_sold, 0);

    return res.json({
      success: true,
      stats: {
        total_products: totalProducts,
        total_stock: totalStock,
        low_stock_count: lowStockCount,
        low_stock_items: lowStockItems,
        orders_by_status: {
          PENDING: pendingOrders,
          ACCEPTED: acceptedOrders,
          REJECTED: rejectedOrders,
          TOTAL: pendingOrders + acceptedOrders + rejectedOrders,
        },
        total_revenue: totalRevenue,
        total_units_sold: totalUnitsSold,
      },
    });
  } catch (error: any) {
    console.error('Farmer dashboard stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve stats' });
  }
};

export const getFarmerAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const farmerId = req.user?.userId;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // 1. Fetch sales for the farmer
    const sales = await prisma.sale.findMany({
      where: { farmer_id: farmerId },
      include: {
        product: {
          select: {
            product_name: true,
            category: true,
          },
        },
      },
      orderBy: { sale_date: 'asc' },
    });

    // 2. Daily revenue trends (group by day YYYY-MM-DD)
    const dailyMap = new Map<string, { date: string; revenue: number; orders: number }>();
    
    // Seed last 14 days with 0 so chart looks continuous
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyMap.set(key, { date: key, revenue: 0, orders: 0 });
    }

    // Busiest days of week tracker
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeekCount: { [key: string]: { day: string; count: number; revenue: number } } = {};
    daysOfWeek.forEach((d) => (dayOfWeekCount[d] = { day: d, count: 0, revenue: 0 }));

    // Product performance tracker
    const productStats: { [key: string]: { name: string; units: number; revenue: number } } = {};
    const categoryStats: { [key: string]: { category: string; value: number } } = {};

    sales.forEach((s) => {
      const dateKey = s.sale_date ? s.sale_date.toISOString().split('T')[0] : 'Unknown';
      const amt = Number(s.total_amount);

      if (dailyMap.has(dateKey)) {
        const item = dailyMap.get(dateKey)!;
        item.revenue += amt;
        item.orders += 1;
      } else {
        dailyMap.set(dateKey, { date: dateKey, revenue: amt, orders: 1 });
      }

      if (s.sale_date) {
        const dayName = daysOfWeek[s.sale_date.getDay()];
        if (dayOfWeekCount[dayName]) {
          dayOfWeekCount[dayName].count += 1;
          dayOfWeekCount[dayName].revenue += amt;
        }
      }

      const pName = s.product.product_name;
      if (!productStats[pName]) {
        productStats[pName] = { name: pName, units: 0, revenue: 0 };
      }
      productStats[pName].units += s.quantity_sold;
      productStats[pName].revenue += amt;

      const catName = s.product.category || 'General';
      if (!categoryStats[catName]) {
        categoryStats[catName] = { category: catName, value: 0 };
      }
      categoryStats[catName].value += amt;
    });

    const revenueTrends = Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // Best sellers sorted by units sold
    const bestSellers = Object.values(productStats).sort((a, b) => b.units - a.units).slice(0, 5);

    // Categories sorted
    const categoryBreakdown = Object.values(categoryStats);

    // Busiest days array
    const busiestDays = daysOfWeek.map((d) => dayOfWeekCount[d]);

    // Simple 7-day revenue forecast projection
    // Calculate average daily revenue of the last 14 days
    const recentValues = revenueTrends.slice(-14).map((d) => d.revenue);
    const avgDailyRev = recentValues.length > 0 ? recentValues.reduce((a, b) => a + b, 0) / recentValues.length : 100;
    
    // Slight upward trend simulation (+3% to +5% growth factor)
    const forecast: { date: string; projected_revenue: number }[] = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const nextD = new Date(today);
      nextD.setDate(today.getDate() + i);
      const key = nextD.toISOString().split('T')[0];
      const factor = 1 + (i * 0.03) + (Math.sin(i) * 0.05);
      forecast.push({
        date: key,
        projected_revenue: Number(Math.max(avgDailyRev * factor, 50).toFixed(2)),
      });
    }

    return res.json({
      success: true,
      analytics: {
        revenue_trends: revenueTrends,
        best_sellers: bestSellers,
        category_breakdown: categoryBreakdown,
        busiest_days: busiestDays,
        forecast,
      },
    });
  } catch (error: any) {
    console.error('Farmer analytics error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve analytics' });
  }
};
