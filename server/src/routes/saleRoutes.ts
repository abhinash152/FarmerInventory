import { Router } from 'express';
import { getFarmerSales } from '../controllers/saleController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/farmer', authenticateToken, requireRole('FARMER'), getFarmerSales);

export default router;
