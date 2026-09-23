"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const saleController_1 = require("../controllers/saleController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/farmer', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), saleController_1.getFarmerSales);
exports.default = router;
