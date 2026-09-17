import { Router } from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
} from '../controllers/chatController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Both Farmer and Customer can access chat
router.get('/conversations', authenticateToken, getConversations);
router.get('/messages/:farmerId/:customerId', authenticateToken, getMessages);
router.post('/messages', authenticateToken, sendMessage);

export default router;
