import { Router } from 'express';
import {
  getPublicProducts,
  getFarmerProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getMetadata,
} from '../controllers/productController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

// Public / Customer endpoint
router.get('/', getPublicProducts);
router.get('/meta/filters', getMetadata);

// Farmer authenticated inventory endpoints
router.get('/farmer', authenticateToken, requireRole('FARMER'), getFarmerProducts);
router.post('/', authenticateToken, requireRole('FARMER'), addProduct);
router.put('/:id', authenticateToken, requireRole('FARMER'), updateProduct);
router.delete('/:id', authenticateToken, requireRole('FARMER'), deleteProduct);

export default router;
