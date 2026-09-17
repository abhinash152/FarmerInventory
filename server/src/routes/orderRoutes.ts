import { Router } from 'express';
import {
  placeOrder,
  getFarmerOrders,
  getCustomerOrders,
  respondToOrder,
  updateTrackingStep,
} from '../controllers/orderController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Customer creates order and views own orders
router.post('/', authenticateToken, requireRole('CUSTOMER'), placeOrder);
router.get('/customer', authenticateToken, requireRole('CUSTOMER'), getCustomerOrders);

// Farmer views order inbox, accepts/rejects, updates delivery tracking
router.get('/farmer', authenticateToken, requireRole('FARMER'), getFarmerOrders);
router.patch('/:id/respond', authenticateToken, requireRole('FARMER'), respondToOrder);
router.patch('/:id/tracking', authenticateToken, requireRole('FARMER'), updateTrackingStep);

export default router;
