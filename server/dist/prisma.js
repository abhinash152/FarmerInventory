"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintStatus = exports.UserRole = exports.TrackingStep = exports.PaymentStatus = exports.PaymentMethod = exports.OrderStatus = exports.prisma = void 0;
const client_1 = require("@prisma/client");
if (!process.env.DATABASE_URL ||
    process.env.DATABASE_URL.startsWith('mysql') ||
    process.env.DATABASE_URL.includes('localhost')) {
    process.env.DATABASE_URL = 'file:./dev.db';
}
exports.prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || 'file:./dev.db',
        },
    },
});
exports.OrderStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
};
exports.PaymentMethod = {
    ONLINE: 'ONLINE',
    COD: 'COD',
};
exports.PaymentStatus = {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
};
exports.TrackingStep = {
    PLACED: 'PLACED',
    ACCEPTED: 'ACCEPTED',
    PACKED: 'PACKED',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
};
exports.UserRole = {
    FARMER: 'FARMER',
    CUSTOMER: 'CUSTOMER',
};
exports.ComplaintStatus = {
    PENDING: 'PENDING',
    INVESTIGATING: 'INVESTIGATING',
    RESOLVED: 'RESOLVED',
};
