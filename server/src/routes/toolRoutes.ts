import { Router } from 'express';
import { getMandiBenchmarks, calculatePincodeDelivery } from '../controllers/toolController';

const router = Router();

router.get('/mandi-benchmarks', getMandiBenchmarks);
router.post('/pincode-delivery', calculatePincodeDelivery);

export default router;
