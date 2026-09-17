import { Router } from 'express';
import {
  getFarmerDashboardStats,
  getFarmerAnalytics,
} from '../controllers/reportController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/farmer/stats', authenticateToken, requireRole('FARMER'), getFarmerDashboardStats);
router.get('/farmer/analytics', authenticateToken, requireRole('FARMER'), getFarmerAnalytics);

export default router;
