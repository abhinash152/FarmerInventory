"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public / Customer endpoint
router.get('/', productController_1.getPublicProducts);
router.get('/meta/filters', productController_1.getMetadata);
// Farmer authenticated inventory endpoints
router.get('/farmer', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), productController_1.getFarmerProducts);
router.post('/', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), productController_1.addProduct);
router.put('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), productController_1.updateProduct);
router.delete('/:id', auth_1.authenticateToken, (0, auth_1.requireRole)('FARMER'), productController_1.deleteProduct);
exports.default = router;
