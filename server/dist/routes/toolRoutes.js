"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const toolController_1 = require("../controllers/toolController");
const router = (0, express_1.Router)();
router.get('/mandi-benchmarks', toolController_1.getMandiBenchmarks);
router.post('/pincode-delivery', toolController_1.calculatePincodeDelivery);
exports.default = router;
