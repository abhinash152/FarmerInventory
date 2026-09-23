import { Response } from 'express';
import { prisma, OrderStatus } from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export const submitFeedback = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.user?.userId;
    if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { order_id, rating, comment } = req.body;
    const orderId = Number(order_id);
    const starRating = Number(rating);

    if (isNaN(orderId) || isNaN(starRating) || starRating < 1 || starRating > 5) {
      return res.status(400).json({ success: false, message: 'Valid order ID and rating (1-5) required' });
    }

    const order = await prisma.order.findUnique({
      where: { order_id: orderId },
      include: { feedback: true, product: true },
    });

    if (!order || order.customer_id !== customerId) {
      return res.status(404).json({ success: false, message: 'Order not found or unauthorized' });
    }

    if (order.status !== OrderStatus.ACCEPTED) {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for accepted orders',
      });
    }

    if (order.feedback) {
      return res.status(409).json({ success: false, message: 'Feedback already submitted for this order' });
    }

    const feedback = await prisma.orderFeedback.create({
      data: {
        order_id: orderId,
        customer_id: customerId,
        farmer_id: order.farmer_id,
        product_id: order.product_id,
        rating: starRating,
        comment: comment ? String(comment).trim() : null,
      },
    });

    // Notify farmer of new review
    await prisma.notification.create({
      data: {
        farmer_id: order.farmer_id,
        product_id: order.product_id,
        title: `⭐ New ${starRating}-Star Rating Received!`,
        message: `A customer rated "${order.product.product_name}" ${starRating} stars: "${comment || 'No comment provided'}"`,
        type: 'ORDER_RATED',
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been recorded.',
      feedback,
    });
  } catch (error: any) {
    console.error('Submit feedback error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit feedback' });
  }
};

export const getFarmerFeedbacks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const farmerId = req.user?.userId;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const feedbacks = await prisma.orderFeedback.findMany({
      where: { farmer_id: farmerId },
      orderBy: { created_at: 'desc' },
      include: {
        customer: { select: { customer_name: true } },
        product: { select: { product_name: true, image_url: true } },
        order: { select: { quantity: true, requested_at: true } },
      },
    });

    const avgRating =
      feedbacks.length > 0
        ? Number((feedbacks.reduce((a, b) => a + b.rating, 0) / feedbacks.length).toFixed(1))
        : 5.0;

    return res.json({
      success: true,
      count: feedbacks.length,
      average_rating: avgRating,
      feedbacks,
    });
  } catch (error: any) {
    console.error('Get farmer feedbacks error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve feedback' });
  }
};
