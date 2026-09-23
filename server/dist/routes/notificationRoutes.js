"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controllers/notificationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/farmer', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), notificationController_1.getFarmerNotifications);
router.patch('/farmer/mark-read', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), notificationController_1.markNotificationsRead);
exports.default = router;
