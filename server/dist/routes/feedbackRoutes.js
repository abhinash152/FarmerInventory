"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedbackController_1 = require("../controllers/feedbackController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Customer submits feedback on accepted order
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)('CUSTOMER'), feedbackController_1.submitFeedback);
// Farmer retrieves feedback
router.get('/farmer', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), feedbackController_1.getFarmerFeedbacks);
exports.default = router;
