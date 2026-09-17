import { Router } from 'express';
import { submitFeedback, getFarmerFeedbacks } from '../controllers/feedbackController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Customer submits feedback on accepted order
router.post('/', authenticateToken, requireRole('CUSTOMER'), submitFeedback);

// Farmer retrieves feedback
router.get('/farmer', authenticateToken, requireRole('FARMER'), getFarmerFeedbacks);

export default router;
