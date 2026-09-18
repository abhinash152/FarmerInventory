import { Router } from 'express';
import {
  createComplaint,
  getCustomerComplaints,
  getFarmerComplaints,
  getProductComplaints,
  updateComplaintStatus,
} from '../controllers/complaintController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Customer creates complaint
router.post('/', authenticateToken, requireRole('CUSTOMER'), createComplaint);

// Customer lists their complaints
router.get('/customer', authenticateToken, requireRole('CUSTOMER'), getCustomerComplaints);

// Farmer lists complaints for their farm
router.get('/farmer', authenticateToken, requireRole('FARMER'), getFarmerComplaints);

// Publicly check complaints / quality alerts for a product
router.get('/product/:productId', getProductComplaints);

// Farmer updates complaint status & resolution
router.patch('/:id/status', authenticateToken, requireRole('FARMER'), updateComplaintStatus);

export default router;
