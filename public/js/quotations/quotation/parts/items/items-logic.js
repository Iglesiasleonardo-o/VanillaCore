// items-logic.js
import { fetchProducts } from '../../database.js';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// --- Data Fetching ---

export async function loadProductsData(query, offset) {
    await delay(300); // Artificial delay
    try {
        return await fetchProducts(query, offset);
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

// --- Validation ---

export function validateStepperValue(value, min, max) {
    const num = parseFloat(value);

    // Se não for número, retorna min (se existir) ou 0
    if (isNaN(num)) return min ?? 0;

    // Lógica de Clamping (manter dentro dos limites)
    if (min !== undefined && num < min) return min;
    if (max !== undefined && num > max) return max;

    return num;
}

// --- Cart Calculations ---

export function calculateTotals(items, vatRate = 16) {
    // reduce é ideal para calcular somatórios
    const subtotal = items.reduce((acc, item) => {
        const discountMultiplier = 1 - (item.discount / 100);
        return acc + (item.product.price * item.quantity * discountMultiplier);
    }, 0);

    const vatAmount = subtotal * (vatRate / 100);

    return {
        subtotal: subtotal,
        vat: vatAmount,
        total: subtotal + vatAmount
    };
}

// --- Cart Item Management ---

// Retorno implícito de objeto
export const createNewItem = (product) => ({
    product,
    quantity: 1,
    discount: 0
});

// Uso de método nativo findIndex
export const findItemIndex = (items, productId) =>
    items.findIndex(item => item.product.id === productId);

// Mutações diretas simplificadas
export const setItemQuantity = (item, qty) => item.quantity = qty;
export const setItemDiscount = (item, disc) => item.discount = disc;