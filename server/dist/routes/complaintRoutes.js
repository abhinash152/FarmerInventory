"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complaintController_1 = require("../controllers/complaintController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Customer creates complaint
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)('CUSTOMER'), complaintController_1.createComplaint);
// Customer lists their complaints
router.get('/customer', auth_1.authenticateToken, (0, auth_1.requireRole)('CUSTOMER'), complaintController_1.getCustomerComplaints);
// Farmer lists complaints for their farm
router.get('/farmer', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), complaintController_1.getFarmerComplaints);
// Publicly check complaints / quality alerts for a product
router.get('/product/:productId', complaintController_1.getProductComplaints);
// Farmer updates complaint status & resolution
router.patch('/:id/status', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), complaintController_1.updateComplaintStatus);
exports.default = router;
