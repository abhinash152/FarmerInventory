"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Both Farmer and Customer can access chat
router.get('/conversations', auth_1.authenticateToken, chatController_1.getConversations);
router.get('/messages/:farmerId/:customerId', auth_1.authenticateToken, chatController_1.getMessages);
router.post('/messages', auth_1.authenticateToken, chatController_1.sendMessage);
exports.default = router;
