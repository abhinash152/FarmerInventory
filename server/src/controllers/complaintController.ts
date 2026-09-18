import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export const createComplaint = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.user?.userId;
    if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { order_id, issue_type, description, proof_image } = req.body;

    if (!order_id || !issue_type || !description) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, Issue Type, and Description are required',
      });
    }

    // Verify order exists and belongs to this customer
    const order = await prisma.order.findUnique({
      where: { order_id: Number(order_id) },
      include: {
        product: true,
        farmer: true,
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.customer_id !== customerId) {
      return res.status(403).json({ success: false, message: 'You can only file complaints for your own orders' });
    }

    // Create the complaint
    const complaint = await prisma.complaint.create({
      data: {
        order_id: order.order_id,
        customer_id: customerId,
        farmer_id: order.farmer_id,
        product_id: order.product_id,
        issue_type: String(issue_type).toUpperCase(),
        description: String(description).trim(),
        proof_image: proof_image || null,
        status: 'PENDING',
      },
      include: {
        product: {
          select: {
            product_name: true,
            unit: true,
            image_url: true,
          },
        },
        farmer: {
          select: {
            full_name: true,
            farm_location: true,
          },
        },
      },
    });

    // Notify the farmer about the issue
    try {
      await prisma.notification.create({
        data: {
          farmer_id: order.farmer_id,
          product_id: order.product_id,
          title: `⚠️ Quality Alert: Order #${order.order_id}`,
          message: `Customer reported ${issue_type}: "${description.slice(0, 80)}...". Please review details and proof image.`,
          type: 'COMPLAINT',
        },
      });
    } catch (notifErr) {
      console.error('Failed to create farmer notification for complaint:', notifErr);
    }

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully with proof verification.',
      complaint,
    });
  } catch (error: any) {
    console.error('Create complaint error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit complaint' });
  }
};

export const getCustomerComplaints = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const customerId = req.user?.userId;
    if (!customerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const complaints = await prisma.complaint.findMany({
      where: { customer_id: customerId },
      orderBy: { created_at: 'desc' },
      include: {
        product: {
          select: {
            product_id: true,
            product_name: true,
            unit: true,
            image_url: true,
          },
        },
        farmer: {
          select: {
            farmer_id: true,
            full_name: true,
            farm_location: true,
          },
        },
      },
    });

    return res.json({ success: true, count: complaints.length, complaints });
  } catch (error: any) {
    console.error('Get customer complaints error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve complaints' });
  }
};

export const getFarmerComplaints = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const farmerId = req.user?.userId;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const complaints = await prisma.complaint.findMany({
      where: { farmer_id: farmerId },
      orderBy: { created_at: 'desc' },
      include: {
        customer: {
          select: {
            customer_name: true,
            contact_number: true,
          },
        },
        product: {
          select: {
            product_id: true,
            product_name: true,
            unit: true,
          },
        },
      },
    });

    return res.json({ success: true, count: complaints.length, complaints });
  } catch (error: any) {
    console.error('Get farmer complaints error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve complaints' });
  }
};

export const getProductComplaints = async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.productId);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const complaints = await prisma.complaint.findMany({
      where: { product_id: productId },
      orderBy: { created_at: 'desc' },
      select: {
        complaint_id: true,
        issue_type: true,
        description: true,
        status: true,
        resolution: true,
        created_at: true,
        proof_image: true,
      },
    });

    return res.json({
      success: true,
      count: complaints.length,
      has_complaints: complaints.length > 0,
      complaints,
    });
  } catch (error: any) {
    console.error('Get product complaints error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve product complaints' });
  }
};

export const updateComplaintStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const farmerId = req.user?.userId;
    const complaintId = Number(req.params.id);

    if (!farmerId || isNaN(complaintId)) {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    const { status, resolution } = req.body;

    const complaint = await prisma.complaint.findUnique({
      where: { complaint_id: complaintId },
    });

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.farmer_id !== farmerId) {
      return res.status(403).json({ success: false, message: 'You can only manage complaints for your own farm' });
    }

    const updated = await prisma.complaint.update({
      where: { complaint_id: complaintId },
      data: {
        status: status || complaint.status,
        resolution: resolution || complaint.resolution,
      },
    });

    return res.json({ success: true, message: 'Complaint updated', complaint: updated });
  } catch (error: any) {
    console.error('Update complaint status error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update complaint' });
  }
};
