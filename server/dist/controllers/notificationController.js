"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markNotificationsRead = exports.getFarmerNotifications = void 0;
const prisma_1 = require("../prisma");
const getFarmerNotifications = async (req, res) => {
    try {
        const farmerId = req.user?.userId;
        if (!farmerId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const notifications = await prisma_1.prisma.notification.findMany({
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
    }
    catch (error) {
        console.error('Get notifications error:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve notifications' });
    }
};
exports.getFarmerNotifications = getFarmerNotifications;
const markNotificationsRead = async (req, res) => {
    try {
        const farmerId = req.user?.userId;
        if (!farmerId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        await prisma_1.prisma.notification.updateMany({
            where: { farmer_id: farmerId, is_read: false },
            data: { is_read: true },
        });
        return res.json({ success: true, message: 'Notifications marked as read' });
    }
    catch (error) {
        console.error('Mark read error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update notifications' });
    }
};
exports.markNotificationsRead = markNotificationsRead;
