// logic/items-math.js

export const CURRENCY = new Intl.NumberFormat('pt-MZ', { minimumFractionDigits: 2 }); // Apenas número
export const CURRENCY_SYMBOL = new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }); // Com moeda para os totais

export function validateStepperValue(value, min = 0, max = 1000000) {
    const num = parseFloat(value);
    if (isNaN(num)) return min;
    if (num < min) return min;
    if (num > max) return max;
    return num;
}

export function calculateTotals(items, vatRate = 16) {
    const subtotal = items.reduce((acc, item) => {
        const discount = item.discount || 0;
        const discountMultiplier = 1 - (discount / 100);
        // Look directly at unitPrice now!
        const price = item.unitPrice || 0;

        return acc + (price * item.quantity * discountMultiplier);
    }, 0);

    const vatAmount = subtotal * (vatRate / 100);

    return {
        subtotal: parseFloat(subtotal.toFixed(2)),
        vat: parseFloat(vatAmount.toFixed(2)),
        total: parseFloat((subtotal + vatAmount).toFixed(2))
    };
}

// Adicione em logic/items-math.js
export function calculateLineTotal(unitPrice, quantity, discount) {
    return (unitPrice * quantity) * (1 - (discount / 100));
}