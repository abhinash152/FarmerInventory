"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/farmer/stats', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), reportController_1.getFarmerDashboardStats);
router.get('/farmer/analytics', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), reportController_1.getFarmerAnalytics);
exports.default = router;
