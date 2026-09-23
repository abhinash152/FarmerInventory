"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Customer creates order and views own orders
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)('CUSTOMER'), orderController_1.placeOrder);
router.get('/customer', auth_1.authenticateToken, (0, auth_1.requireRole)('CUSTOMER'), orderController_1.getCustomerOrders);
// Farmer views order inbox, accepts/rejects, updates delivery tracking
router.get('/farmer', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), orderController_1.getFarmerOrders);
router.patch('/:id/respond', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), orderController_1.respondToOrder);
router.patch('/:id/tracking', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), orderController_1.updateTrackingStep);
exports.default = router;
