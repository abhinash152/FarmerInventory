import { Router } from 'express';
import {
  registerFarmer,
  loginFarmer,
  registerCustomer,
  loginCustomer,
  getCurrentUser,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/farmer/signup', registerFarmer);
router.post('/farmer/login', loginFarmer);

router.post('/customer/signup', registerCustomer);
router.post('/customer/login', loginCustomer);

router.get('/me', authenticateToken, getCurrentUser);

export default router;
