"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFreshness = calculateFreshness;
function calculateFreshness(harvestDateInput, productName = '', category = 'General', storageCondition = 'FIELD_FRESH', farmLocation = '') {
    const now = new Date();
    const harvestDate = harvestDateInput ? new Date(harvestDateInput) : new Date(now.getTime() - 1000 * 60 * 60 * 18); // default ~18h ago
    // Days elapsed (fractional)
    const diffMs = Math.max(0, now.getTime() - harvestDate.getTime());
    const daysSinceHarvest = Number((diffMs / (1000 * 60 * 60 * 24)).toFixed(1));
    const nameLower = (productName || '').toLowerCase();
    const catLower = (category || '').toLowerCase();
    // Determine crop profile: { baseShelfLifeDays, dailyDecayAmbient, dailyDecayCold }
    let baseShelfLife = 10;
    let decayRate = 8.0;
    if (catLower.includes('grain') ||
        nameLower.includes('wheat') ||
        nameLower.includes('rice') ||
        nameLower.includes('dal') ||
        nameLower.includes('mustard') ||
        catLower.includes('honey')) {
        baseShelfLife = 240;
        decayRate = 0.2;
    }
    else if (catLower.includes('dairy') ||
        nameLower.includes('milk') ||
        nameLower.includes('paneer') ||
        nameLower.includes('curd')) {
        baseShelfLife = 4;
        decayRate = 22.0;
    }
    else if (nameLower.includes('spinach') ||
        nameLower.includes('palak') ||
        nameLower.includes('coriander') ||
        nameLower.includes('methi') ||
        nameLower.includes('lettuce') ||
        nameLower.includes('mushroom')) {
        baseShelfLife = 5;
        decayRate = 18.0;
    }
    else if (nameLower.includes('potato') ||
        nameLower.includes('onion') ||
        nameLower.includes('garlic') ||
        nameLower.includes('ginger')) {
        baseShelfLife = 60;
        decayRate = 1.3;
    }
    else if (nameLower.includes('apple') ||
        nameLower.includes('citrus') ||
        nameLower.includes('orange') ||
        nameLower.includes('lemon') ||
        nameLower.includes('pomegranate')) {
        baseShelfLife = 30;
        decayRate = 2.8;
    }
    else if (nameLower.includes('tomato') ||
        nameLower.includes('capsicum') ||
        nameLower.includes('cucumber') ||
        nameLower.includes('papaya') ||
        nameLower.includes('okra') ||
        nameLower.includes('bhindi') ||
        catLower.includes('vegetable') ||
        catLower.includes('fruit')) {
        baseShelfLife = 10;
        decayRate = 8.5;
    }
    // Storage factor modifier
    let storageFactor = 1.0;
    let storageConditionLabel = 'Field Fresh (Direct Pick)';
    switch (storageCondition) {
        case 'COLD_STORAGE':
            storageFactor = 0.45; // 55% slower decay in cold storage
            storageConditionLabel = 'Cold-Chain Preserved (2-6°C)';
            break;
        case 'SHADE_VENTILATED':
            storageFactor = 0.8;
            storageConditionLabel = 'Shaded & Ventilated Farm Storage';
            break;
        case 'DRY_STORAGE':
            storageFactor = 0.7;
            storageConditionLabel = 'Dry Aerated Farm Warehouse';
            break;
        case 'STANDARD':
            storageFactor = 1.0;
            storageConditionLabel = 'Ambient Farm Storage';
            break;
        case 'FIELD_FRESH':
        default:
            storageFactor = 0.9;
            storageConditionLabel = 'Direct from Field (Zero Processing)';
            break;
    }
    const effectiveDecayRate = decayRate * storageFactor;
    const calculatedLoss = daysSinceHarvest * effectiveDecayRate;
    const rawScore = Math.max(8, Math.min(100, 100 - calculatedLoss));
    const score = Math.round(rawScore);
    const rating10 = Number((score / 10).toFixed(1));
    const rating5 = Number((score / 20).toFixed(1));
    // Compute days remaining
    const daysRemaining = Math.max(0, Math.round((score / 100) * baseShelfLife));
    // Tiers and visual color gradients
    let tier = 'Farm Fresh Today • Peak Crispness';
    let tierCode = 'PEAK';
    let colorHex = '#10B981'; // Emerald Green
    let badgeBg = 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
    let badgeBorder = 'border-emerald-300 dark:border-emerald-700';
    if (score >= 88) {
        tier = 'Farm Fresh Today • Peak Crispness';
        tierCode = 'PEAK';
        colorHex = '#10B981'; // Green
        badgeBg = 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
        badgeBorder = 'border-emerald-300 dark:border-emerald-700';
    }
    else if (score >= 72) {
        tier = 'Very Fresh • High Nutritional Vitality';
        tierCode = 'VERY_FRESH';
        colorHex = '#84CC16'; // Lime Green
        badgeBg = 'bg-lime-50 text-lime-800 dark:bg-lime-950/80 dark:text-lime-300';
        badgeBorder = 'border-lime-300 dark:border-lime-700';
    }
    else if (score >= 52) {
        tier = 'Good Condition • Freshly Kept';
        tierCode = 'GOOD';
        colorHex = '#EAB308'; // Amber / Yellow
        badgeBg = 'bg-amber-50 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300';
        badgeBorder = 'border-amber-300 dark:border-amber-700';
    }
    else if (score >= 35) {
        tier = 'Maturing • Best Consumed in 24-48h';
        tierCode = 'MATURING';
        colorHex = '#F97316'; // Orange
        badgeBg = 'bg-orange-50 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300';
        badgeBorder = 'border-orange-300 dark:border-orange-700';
    }
    else {
        tier = 'Aging • Clearance / Quick Sale';
        tierCode = 'AGING';
        colorHex = '#EF4444'; // Red
        badgeBg = 'bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300';
        badgeBorder = 'border-rose-300 dark:border-rose-700';
    }
    // AI-generated summary explanation
    const originPart = farmLocation ? ` from ${farmLocation}` : '';
    const daysText = daysSinceHarvest <= 0.3
        ? 'Harvested earlier today'
        : daysSinceHarvest <= 1.0
            ? 'Picked yesterday'
            : `Harvested ${daysSinceHarvest} days ago`;
    const aiSummary = `🌾 ${daysText}${originPart}. ${storageConditionLabel}. Retains ${score}% cellular moisture & crispness. Optimal window: ~${daysRemaining} days remaining.`;
    const harvestDateFormatted = harvestDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    return {
        score,
        rating10,
        rating5,
        tier,
        tierCode,
        colorHex,
        badgeBg,
        badgeText: colorHex,
        badgeBorder,
        daysSinceHarvest,
        daysRemaining,
        aiSummary,
        storageConditionLabel,
        harvestDateFormatted,
    };
}
