"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadata = exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getFarmerProducts = exports.getPublicProducts = void 0;
const prisma_1 = require("../prisma");
const freshnessEngine_1 = require("../utils/freshnessEngine");
const getPublicProducts = async (req, res) => {
    try {
        const { q, category, state, sort } = req.query;
        const whereClause = {};
        if (q && typeof q === 'string' && q.trim().length > 0) {
            whereClause.OR = [
                { product_name: { contains: q } },
                { category: { contains: q } },
                { farmer: { farm_location: { contains: q } } },
                { farmer: { full_name: { contains: q } } },
            ];
        }
        if (category && typeof category === 'string' && category !== 'ALL') {
            whereClause.category = category;
        }
        if (state && typeof state === 'string' && state !== 'ALL') {
            whereClause.farmer = {
                farm_location: {
                    contains: state,
                },
            };
        }
        let orderBy = { created_at: 'desc' };
        if (sort === 'price_asc')
            orderBy = { price_per_unit: 'asc' };
        if (sort === 'price_desc')
            orderBy = { price_per_unit: 'desc' };
        if (sort === 'stock')
            orderBy = { stock_quantity: 'desc' };
        const products = await prisma_1.prisma.product.findMany({
            where: whereClause,
            orderBy,
            include: {
                farmer: {
                    select: {
                        farmer_id: true,
                        full_name: true,
                        farm_location: true,
                        contact_number: true,
                    },
                },
                feedbacks: {
                    select: {
                        rating: true,
                        comment: true,
                        customer: {
                            select: {
                                customer_name: true,
                            },
                        },
                        created_at: true,
                    },
                },
                complaints: {
                    select: {
                        complaint_id: true,
                        status: true,
                        issue_type: true,
                    },
                },
            },
        });
        let enriched = products.map((p) => {
            const avgRating = p.feedbacks.length > 0
                ? Number((p.feedbacks.reduce((acc, f) => acc + f.rating, 0) / p.feedbacks.length).toFixed(1))
                : 0;
            const openComplaints = (p.complaints || []).filter((c) => c.status !== 'RESOLVED');
            const freshness = (0, freshnessEngine_1.calculateFreshness)(p.harvest_date || p.created_at, p.product_name, p.category || 'General', p.storage_condition || 'FIELD_FRESH', p.farmer?.farm_location || '');
            return {
                ...p,
                is_low_stock: p.stock_quantity <= (p.low_stock_threshold ?? 5),
                average_rating: avgRating,
                reviews_count: p.feedbacks.length,
                open_complaints_count: openComplaints.length,
                freshness_score: freshness.score,
                freshness_rating_10: freshness.rating10,
                freshness_rating_5: freshness.rating5,
                freshness_tier: freshness.tier,
                freshness_tier_code: freshness.tierCode,
                freshness_color: freshness.colorHex,
                days_since_harvest: freshness.daysSinceHarvest,
                days_remaining: freshness.daysRemaining,
                ai_freshness_summary: freshness.aiSummary,
                storage_condition_label: freshness.storageConditionLabel,
                harvest_date: p.harvest_date || p.created_at,
                storage_condition: p.storage_condition || 'FIELD_FRESH',
            };
        });
        if (sort === 'freshness') {
            enriched = enriched.sort((a, b) => b.freshness_score - a.freshness_score);
        }
        return res.json({ success: true, count: enriched.length, products: enriched });
    }
    catch (error) {
        console.error('Get public products error:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve products' });
    }
};
exports.getPublicProducts = getPublicProducts;
const getFarmerProducts = async (req, res) => {
    try {
        const farmerId = req.user?.userId;
        if (!farmerId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const products = await prisma_1.prisma.product.findMany({
            where: { farmer_id: farmerId },
            orderBy: { created_at: 'desc' },
            include: {
                sales: {
                    select: {
                        quantity_sold: true,
                        total_amount: true,
                    },
                },
                feedbacks: {
                    select: {
                        rating: true,
                        comment: true,
                        created_at: true,
                        customer: { select: { customer_name: true } },
                    },
                },
            },
        });
        const enriched = products.map((p) => {
            const totalUnitsSold = p.sales.reduce((sum, s) => sum + s.quantity_sold, 0);
            const totalRevenue = p.sales.reduce((sum, s) => sum + Number(s.total_amount), 0);
            const avgRating = p.feedbacks.length > 0
                ? Number((p.feedbacks.reduce((sum, f) => sum + f.rating, 0) / p.feedbacks.length).toFixed(1))
                : 0;
            const freshness = (0, freshnessEngine_1.calculateFreshness)(p.harvest_date || p.created_at, p.product_name, p.category || 'General', p.storage_condition || 'FIELD_FRESH');
            return {
                ...p,
                is_low_stock: p.stock_quantity <= (p.low_stock_threshold ?? 5),
                total_units_sold: totalUnitsSold,
                total_revenue: totalRevenue,
                average_rating: avgRating,
                reviews_count: p.feedbacks.length,
                freshness_score: freshness.score,
                freshness_rating_10: freshness.rating10,
                freshness_tier: freshness.tier,
                freshness_color: freshness.colorHex,
                days_since_harvest: freshness.daysSinceHarvest,
                days_remaining: freshness.daysRemaining,
                ai_freshness_summary: freshness.aiSummary,
                harvest_date: p.harvest_date || p.created_at,
                storage_condition: p.storage_condition || 'FIELD_FRESH',
            };
        });
        return res.json({ success: true, products: enriched });
    }
    catch (error) {
        console.error('Get farmer products error:', error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve inventory' });
    }
};
exports.getFarmerProducts = getFarmerProducts;
const addProduct = async (req, res) => {
    try {
        const farmerId = req.user?.userId;
        if (!farmerId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        const { product_name, category, stock_quantity, unit, price_per_unit, low_stock_threshold, image_url, harvest_date, storage_condition, } = req.body;
        if (!product_name || stock_quantity === undefined || !unit || price_per_unit === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Product name, stock quantity, unit, and price per unit are required',
            });
        }
        const product = await prisma_1.prisma.product.create({
            data: {
                farmer_id: farmerId,
                product_name,
                category: category || 'General',
                stock_quantity: Number(stock_quantity),
                unit,
                price_per_unit: Number(price_per_unit),
                low_stock_threshold: low_stock_threshold !== undefined ? Number(low_stock_threshold) : 5,
                image_url: image_url || null,
                harvest_date: harvest_date ? new Date(harvest_date) : new Date(),
                storage_condition: storage_condition || 'FIELD_FRESH',
            },
        });
        // Check if initial stock is at or below threshold
        if (product.stock_quantity <= (product.low_stock_threshold ?? 5)) {
            await prisma_1.prisma.notification.create({
                data: {
                    farmer_id: farmerId,
                    product_id: product.product_id,
                    title: `Low Stock Alert: ${product.product_name}`,
                    message: `Product "${product.product_name}" is currently at ${product.stock_quantity} ${product.unit}, which is at or below the alert threshold (${product.low_stock_threshold}).`,
                    type: 'LOW_STOCK',
                },
            });
        }
        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product,
        });
    }
    catch (error) {
        console.error('Add product error:', error);
        return res.status(500).json({ success: false, message: 'Failed to add product' });
    }
};
exports.addProduct = addProduct;
const updateProduct = async (req, res) => {
    try {
        const farmerId = req.user?.userId;
        const productId = Number(req.params.id);
        if (!farmerId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        if (isNaN(productId))
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        const existing = await prisma_1.prisma.product.findUnique({ where: { product_id: productId } });
        if (!existing || existing.farmer_id !== farmerId) {
            return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
        }
        const { product_name, category, stock_quantity, unit, price_per_unit, low_stock_threshold, image_url, harvest_date, storage_condition, } = req.body;
        const updated = await prisma_1.prisma.product.update({
            where: { product_id: productId },
            data: {
                ...(product_name !== undefined && { product_name }),
                ...(category !== undefined && { category }),
                ...(stock_quantity !== undefined && { stock_quantity: Number(stock_quantity) }),
                ...(unit !== undefined && { unit }),
                ...(price_per_unit !== undefined && { price_per_unit: Number(price_per_unit) }),
                ...(low_stock_threshold !== undefined && { low_stock_threshold: Number(low_stock_threshold) }),
                ...(image_url !== undefined && { image_url }),
                ...(harvest_date !== undefined && { harvest_date: harvest_date ? new Date(harvest_date) : null }),
                ...(storage_condition !== undefined && { storage_condition }),
            },
        });
        // Check low stock threshold alert
        if (updated.stock_quantity <= (updated.low_stock_threshold ?? 5)) {
            await prisma_1.prisma.notification.create({
                data: {
                    farmer_id: farmerId,
                    product_id: updated.product_id,
                    title: `Low Stock Alert: ${updated.product_name}`,
                    message: `Stock for "${updated.product_name}" is now ${updated.stock_quantity} ${updated.unit} (Threshold: ${updated.low_stock_threshold}).`,
                    type: 'LOW_STOCK',
                },
            });
        }
        return res.json({
            success: true,
            message: 'Product updated successfully',
            product: updated,
        });
    }
    catch (error) {
        console.error('Update product error:', error);
        return res.status(500).json({ success: false, message: 'Failed to update product' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const farmerId = req.user?.userId;
        const productId = Number(req.params.id);
        if (!farmerId)
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        if (isNaN(productId))
            return res.status(400).json({ success: false, message: 'Invalid product ID' });
        const existing = await prisma_1.prisma.product.findUnique({ where: { product_id: productId } });
        if (!existing || existing.farmer_id !== farmerId) {
            return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
        }
        await prisma_1.prisma.product.delete({ where: { product_id: productId } });
        return res.json({ success: true, message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error('Delete product error:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
};
exports.deleteProduct = deleteProduct;
const getMetadata = async (_req, res) => {
    try {
        const categories = await prisma_1.prisma.product.findMany({
            select: { category: true },
            distinct: ['category'],
        });
        const locations = await prisma_1.prisma.farmer.findMany({
            select: { farm_location: true },
            distinct: ['farm_location'],
        });
        return res.json({
            success: true,
            categories: categories.map((c) => c.category).filter(Boolean),
            locations: locations.map((l) => l.farm_location).filter(Boolean),
        });
    }
    catch (error) {
        console.error('Metadata error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch filter metadata' });
    }
};
exports.getMetadata = getMetadata;
