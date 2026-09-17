import { Router } from 'express';
import {
  getFarmerNotifications,
  markNotificationsRead,
} from '../controllers/notificationController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/farmer', authenticateToken, requireRole('FARMER'), getFarmerNotifications);
router.patch('/farmer/mark-read', authenticateToken, requireRole('FARMER'), markNotificationsRead);

export default router;
