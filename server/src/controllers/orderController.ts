import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth';
import { OrderStatus, PaymentMethod, PaymentStatus, TrackingStep } from '@prisma/client';

export const placeOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.user?.userId;
    if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const {
      product_id,
      quantity,
      payment_method,
      delivery_pincode,
      delivery_address,
    } = req.body;

    const qty = Number(quantity);
    const prodId = Number(product_id);

    if (isNaN(prodId) || isNaN(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Valid product ID and quantity (> 0) required' });
    }

    const product = await prisma.product.findUnique({
      where: { product_id: prodId },
      include: { farmer: true },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock_quantity < qty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock_quantity} ${product.unit} available.`,
      });
    }

    // Calculate delivery fee based on pincode zone
    let deliveryFee = 30; // default local
    let estimatedDays = '1-2 days';
    if (delivery_pincode) {
      const pin = delivery_pincode.toString().trim();
      if (pin.startsWith('14') || pin.startsWith('16')) {
        // Local North/Punjab/Haryana zone
        deliveryFee = 30;
        estimatedDays = 'Same day / 24 hours';
      } else if (pin.startsWith('11') || pin.startsWith('12') || pin.startsWith('20')) {
        // NCR / Neighboring state zone
        deliveryFee = 60;
        estimatedDays = '1-2 days';
      } else {
        // Inter-state zone
        deliveryFee = 120;
        estimatedDays = '2-4 days';
      }
    }

    // Free delivery on orders over 500
    const itemTotal = Number(product.price_per_unit) * qty;
    if (itemTotal >= 500) {
      deliveryFee = 0;
    }

    const selectedPaymentMethod: PaymentMethod =
      payment_method === 'ONLINE' ? PaymentMethod.ONLINE : PaymentMethod.COD;
    const initialPaymentStatus: PaymentStatus =
      selectedPaymentMethod === 'ONLINE' ? PaymentStatus.COMPLETED : PaymentStatus.PENDING;

    // Create order and extension
    const order = await prisma.order.create({
      data: {
        customer_id: customerId,
        farmer_id: product.farmer_id,
        product_id: prodId,
        quantity: qty,
        status: OrderStatus.PENDING,
        extension: {
          create: {
            payment_method: selectedPaymentMethod,
            payment_status: initialPaymentStatus,
            delivery_pincode: delivery_pincode ? String(delivery_pincode) : '140001',
            delivery_fee: deliveryFee,
            delivery_address: delivery_address || 'Customer registered address',
            tracking_step: TrackingStep.PLACED,
            estimated_delivery: estimatedDays,
          },
        },
      },
      include: {
        product: true,
        extension: true,
      },
    });

    // Notify farmer of incoming order
    await prisma.notification.create({
      data: {
        farmer_id: product.farmer_id,
        product_id: product.product_id,
        title: `New Order #${order.order_id}`,
        message: `New order received for ${qty} ${product.unit} of ${product.product_name}. Total: ₹${(itemTotal + deliveryFee).toFixed(2)}`,
        type: 'NEW_ORDER',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error: any) {
    console.error('Place order error:', error);
    return res.status(500).json({ success: false, message: 'Failed to place order' });
  }
};

export const getFarmerOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const farmerId = req.user?.userId;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const orders = await prisma.order.findMany({
      where: { farmer_id: farmerId },
      orderBy: { requested_at: 'desc' },
      include: {
        customer: {
          select: {
            customer_id: true,
            customer_name: true,
            contact_number: true,
            address: true,
          },
        },
        product: {
          select: {
            product_id: true,
            product_name: true,
            unit: true,
            price_per_unit: true,
            stock_quantity: true,
            low_stock_threshold: true,
            image_url: true,
          },
        },
        extension: true,
        feedback: true,
      },
    });

    return res.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    console.error('Get farmer orders error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
  }
};

export const getCustomerOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.user?.userId;
    if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const orders = await prisma.order.findMany({
      where: { customer_id: customerId },
      orderBy: { requested_at: 'desc' },
      include: {
        farmer: {
          select: {
            farmer_id: true,
            full_name: true,
            farm_location: true,
            contact_number: true,
          },
        },
        product: {
          select: {
            product_id: true,
            product_name: true,
            category: true,
            unit: true,
            price_per_unit: true,
            stock_quantity: true,
            image_url: true,
          },
        },
        extension: true,
        feedback: true,
      },
    });

    return res.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    console.error('Get customer orders error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve your orders' });
  }
};

export const respondToOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const farmerId = req.user?.userId;
    const orderId = Number(req.params.id);
    const { action } = req.body; // 'ACCEPTED' or 'REJECTED'

    if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (isNaN(orderId)) return res.status(400).json({ success: false, message: 'Invalid order ID' });

    if (action !== 'ACCEPTED' && action !== 'REJECTED') {
      return res.status(400).json({ success: false, message: 'Action must be ACCEPTED or REJECTED' });
    }

    const order = await prisma.order.findUnique({
      where: { order_id: orderId },
      include: { product: true, extension: true },
    });

    if (!order || order.farmer_id !== farmerId) {
      return res.status(404).json({ success: false, message: 'Order not found or unauthorized' });
    }

    if (order.status !== OrderStatus.PENDING) {
      return res.status(400).json({
        success: false,
        message: `Order is already ${order.status.toLowerCase()} and cannot be changed`,
      });
    }

    // Execute atomic response
    const result = await prisma.$transaction(async (tx) => {
      const now = new Date();

      if (action === 'ACCEPTED') {
        // Fetch fresh product data inside transaction to prevent race conditions
        const freshProduct = await tx.product.findUnique({
          where: { product_id: order.product_id },
        });

        if (!freshProduct) {
          throw new Error('Product not found');
        }

        if (freshProduct.stock_quantity < order.quantity) {
          throw new Error(
            `Insufficient stock to accept order! Available: ${freshProduct.stock_quantity} ${freshProduct.unit}, requested: ${order.quantity}`
          );
        }

        // 1. Decrement product stock
        const newStock = freshProduct.stock_quantity - order.quantity;
        const updatedProduct = await tx.product.update({
          where: { product_id: order.product_id },
          data: { stock_quantity: newStock },
        });

        // 2. Insert Sale record
        const totalAmount = Number(freshProduct.price_per_unit) * order.quantity;
        const sale = await tx.sale.create({
          data: {
            product_id: order.product_id,
            customer_id: order.customer_id,
            farmer_id: farmerId,
            quantity_sold: order.quantity,
            total_amount: totalAmount,
            sale_date: now,
          },
        });

        // 3. Update Order status
        const updatedOrder = await tx.order.update({
          where: { order_id: orderId },
          data: {
            status: OrderStatus.ACCEPTED,
            responded_at: now,
          },
        });

        // 4. Update order extension tracking
        await tx.orderExtension.upsert({
          where: { order_id: orderId },
          update: {
            tracking_step: TrackingStep.ACCEPTED,
          },
          create: {
            order_id: orderId,
            tracking_step: TrackingStep.ACCEPTED,
            payment_method: PaymentMethod.COD,
          },
        });

        // 5. Check if stock crossed low stock threshold
        const threshold = updatedProduct.low_stock_threshold ?? 5;
        if (newStock <= threshold) {
          await tx.notification.create({
            data: {
              farmer_id: farmerId,
              product_id: updatedProduct.product_id,
              title: `Low Stock Warning: ${updatedProduct.product_name}`,
              message: `Attention! Stock for "${updatedProduct.product_name}" is down to ${newStock} ${updatedProduct.unit} (Threshold: ${threshold}).`,
              type: 'LOW_STOCK',
            },
          });
        }

        return { order: updatedOrder, sale, updatedProduct };
      } else {
        // REJECTED
        const updatedOrder = await tx.order.update({
          where: { order_id: orderId },
          data: {
            status: OrderStatus.REJECTED,
            responded_at: now,
          },
        });

        return { order: updatedOrder };
      }
    });

    return res.json({
      success: true,
      message: `Order successfully ${action.toLowerCase()}`,
      data: result,
    });
  } catch (error: any) {
    console.error('Order respond error:', error);
    return res.status(400).json({ success: false, message: error.message || 'Failed to update order' });
  }
};

export const updateTrackingStep = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const farmerId = req.user?.userId;
    const orderId = Number(req.params.id);
    const { tracking_step } = req.body;

    if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const order = await prisma.order.findUnique({
      where: { order_id: orderId },
      include: { extension: true },
    });

    if (!order || order.farmer_id !== farmerId) {
      return res.status(404).json({ success: false, message: 'Order not found or unauthorized' });
    }

    const validSteps = ['PLACED', 'ACCEPTED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    if (!validSteps.includes(tracking_step)) {
      return res.status(400).json({ success: false, message: 'Invalid tracking step' });
    }

    const updatedExt = await prisma.orderExtension.upsert({
      where: { order_id: orderId },
      update: {
        tracking_step: tracking_step as TrackingStep,
        ...(tracking_step === 'DELIVERED' ? { payment_status: PaymentStatus.COMPLETED } : {}),
      },
      create: {
        order_id: orderId,
        tracking_step: tracking_step as TrackingStep,
        payment_method: PaymentMethod.COD,
      },
    });

    return res.json({
      success: true,
      message: `Tracking updated to ${tracking_step}`,
      extension: updatedExt,
    });
  } catch (error: any) {
    console.error('Update tracking error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update tracking' });
  }
};
