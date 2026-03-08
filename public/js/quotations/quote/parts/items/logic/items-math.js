/**
 * Pure calculation for a single line item.
 */
export const calculateLineTotals = (unitPrice, qty, disc, taxRate) => {
    const subtotal = (unitPrice * qty) * (1 - (disc / 100));
    return { subtotal, tax: subtotal * taxRate };
};

/**
 * Updates the quotation totals incrementally based on the change (delta) 
 * in line item values.
 */
export const applyTotalDelta = (totals, oldSubtotal, newSubtotal, taxRate) => {
    totals.subtotal += (newSubtotal - oldSubtotal);
    totals.taxTotal = totals.subtotal * taxRate;
    totals.grandTotal = totals.subtotal + totals.taxTotal;
};

export const sanitizeQuantity = (value) => {
    const num = Number(value);
    return (isNaN(num) || num < 1) ? 1 : num;
};

export const sanitizeDiscount = (value) => {
    const num = Number(value);
    return (isNaN(num) || num < 0 || num > 100) ? 0 : num;
};
