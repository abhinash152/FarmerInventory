import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export const getFarmerSales = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const farmerId = req.user?.userId;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const sales = await prisma.sale.findMany({
      where: { farmer_id: farmerId },
      orderBy: { sale_date: 'desc' },
      include: {
        product: {
          select: {
            product_id: true,
            product_name: true,
            category: true,
            unit: true,
            price_per_unit: true,
          },
        },
        customer: {
          select: {
            customer_id: true,
            customer_name: true,
            contact_number: true,
            address: true,
          },
        },
      },
    });

    const totalRevenue = sales.reduce((acc, sale) => acc + Number(sale.total_amount), 0);
    const totalUnitsSold = sales.reduce((acc, sale) => acc + sale.quantity_sold, 0);

    return res.json({
      success: true,
      count: sales.length,
      total_revenue: totalRevenue,
      total_units_sold: totalUnitsSold,
      sales,
    });
  } catch (error: any) {
    console.error('Get sales error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve sales history' });
  }
};
