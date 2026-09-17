import { Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest } from '../middleware/auth';

export const getFarmerNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const farmerId = req.user?.userId;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const notifications = await prisma.notification.findMany({
      where: { farmer_id: farmerId },
      orderBy: { created_at: 'desc' },
      take: 30,
    });

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return res.json({
      success: true,
      unread_count: unreadCount,
      notifications,
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve notifications' });
  }
};

export const markNotificationsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const farmerId = req.user?.userId;
    if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    await prisma.notification.updateMany({
      where: { farmer_id: farmerId, is_read: false },
      data: { is_read: true },
    });

    return res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error: any) {
    console.error('Mark read error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update notifications' });
  }
};
