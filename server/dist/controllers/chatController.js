"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = exports.getConversations = void 0;
const prisma_1 = require("../prisma");
const getConversations = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;
        if (!userId || !role)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        if (role === 'FARMER') {
            // Find all distinct customers this farmer has exchanged messages with
            const messages = await prisma_1.prisma.chatMessage.findMany({
                where: { farmer_id: userId },
                orderBy: { created_at: 'desc' },
            });
            const customerIds = Array.from(new Set(messages.map((m) => m.customer_id)));
            const customers = await prisma_1.prisma.customer.findMany({
                where: { customer_id: { in: customerIds } },
                select: { customer_id: true, customer_name: true, contact_number: true },
            });
            const customerMap = new Map(customers.map((c) => [c.customer_id, c]));
            const conversations = customerIds.map((cId) => {
                const cMessages = messages.filter((m) => m.customer_id === cId);
                const lastMessage = cMessages[0];
                const unreadCount = cMessages.filter((m) => m.sender_role === prisma_1.UserRole.CUSTOMER && !m.is_read).length;
                return {
                    other_user_id: cId,
                    other_user_name: customerMap.get(cId)?.customer_name || 'Customer',
                    other_user_contact: customerMap.get(cId)?.contact_number || '',
                    last_message: lastMessage?.message_text || '',
                    last_message_at: lastMessage?.created_at,
                    unread_count: unreadCount,
                };
            });
            return res.json({ success: true, conversations });
        }
        else {
            // Role is CUSTOMER
            const messages = await prisma_1.prisma.chatMessage.findMany({
                where: { customer_id: userId },
                orderBy: { created_at: 'desc' },
            });
            const farmerIds = Array.from(new Set(messages.map((m) => m.farmer_id)));
            const farmers = await prisma_1.prisma.farmer.findMany({
                where: { farmer_id: { in: farmerIds } },
                select: { farmer_id: true, full_name: true, farm_location: true, contact_number: true },
            });
            const farmerMap = new Map(farmers.map((f) => [f.farmer_id, f]));
            const conversations = farmerIds.map((fId) => {
                const fMessages = messages.filter((m) => m.farmer_id === fId);
                const lastMessage = fMessages[0];
                const unreadCount = fMessages.filter((m) => m.sender_role === prisma_1.UserRole.FARMER && !m.is_read).length;
                return {
                    other_user_id: fId,
                    other_user_name: farmerMap.get(fId)?.full_name || 'Farmer',
                    other_user_location: farmerMap.get(fId)?.farm_location || '',
                    other_user_contact: farmerMap.get(fId)?.contact_number || '',
                    last_message: lastMessage?.message_text || '',
                    last_message_at: lastMessage?.created_at,
                    unread_count: unreadCount,
                };
            });
            return res.json({ success: true, conversations });
        }
    }
    catch (error) {
        console.error('Get conversations error:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve conversations' });
    }
};
exports.getConversations = getConversations;
const getMessages = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;
        if (!userId || !role)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const targetFarmerId = role === 'FARMER' ? userId : Number(req.params.farmerId);
        const targetCustomerId = role === 'CUSTOMER' ? userId : Number(req.params.customerId);
        if (isNaN(targetFarmerId) || isNaN(targetCustomerId)) {
            return res.status(400).json({ success: false, message: 'Invalid conversation participants' });
        }
        const messages = await prisma_1.prisma.chatMessage.findMany({
            where: {
                farmer_id: targetFarmerId,
                customer_id: targetCustomerId,
            },
            orderBy: { created_at: 'asc' },
        });
        // Mark opposing incoming messages as read
        const opposingRole = role === 'FARMER' ? prisma_1.UserRole.CUSTOMER : prisma_1.UserRole.FARMER;
        await prisma_1.prisma.chatMessage.updateMany({
            where: {
                farmer_id: targetFarmerId,
                customer_id: targetCustomerId,
                sender_role: opposingRole,
                is_read: false,
            },
            data: { is_read: true },
        });
        // Also get details of the participants
        const [farmer, customer] = await Promise.all([
            prisma_1.prisma.farmer.findUnique({
                where: { farmer_id: targetFarmerId },
                select: { farmer_id: true, full_name: true, farm_location: true, contact_number: true },
            }),
            prisma_1.prisma.customer.findUnique({
                where: { customer_id: targetCustomerId },
                select: { customer_id: true, customer_name: true, contact_number: true },
            }),
        ]);
        return res.json({
            success: true,
            messages,
            farmer,
            customer,
        });
    }
    catch (error) {
        console.error('Get messages error:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve messages' });
    }
};
exports.getMessages = getMessages;
const sendMessage = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;
        const { farmer_id, customer_id, message_text } = req.body;
        if (!userId || !role)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        if (!message_text || !message_text.trim()) {
            return res.status(400).json({ success: false, message: 'Message text cannot be empty' });
        }
        const effectiveFarmerId = role === 'FARMER' ? userId : Number(farmer_id);
        const effectiveCustomerId = role === 'CUSTOMER' ? userId : Number(customer_id);
        if (isNaN(effectiveFarmerId) || isNaN(effectiveCustomerId)) {
            return res.status(400).json({ success: false, message: 'Invalid recipient or sender' });
        }
        const newMessage = await prisma_1.prisma.chatMessage.create({
            data: {
                farmer_id: effectiveFarmerId,
                customer_id: effectiveCustomerId,
                sender_role: role === 'FARMER' ? prisma_1.UserRole.FARMER : prisma_1.UserRole.CUSTOMER,
                message_text: message_text.trim(),
                is_read: false,
            },
        });
        return res.status(201).json({ success: true, message: newMessage });
    }
    catch (error) {
        console.error('Send message error:', error);
        return res.status(500).json({ success: false, message: 'Failed to send message' });
    }
};
exports.sendMessage = sendMessage;
