import { formatCurrency } from "../product-math.js";

export { formatCurrency };

export function calcStockValue(onHand, unitCost) {
    const qty = Number(onHand) || 0;
    const cost = Number(unitCost) || 0;
    return qty * cost;
}

export function getStockStatus(onHand, minStock) {
    const qty = Number(onHand) ?? 0;
    const min = Number(minStock) ?? 0;
    if (qty <= 0) return "SEM STOCK";
    if (qty <= min) return "REPOR";
    return "OK";
}

export function calcBalanceSummary(entries, exits) {
    const totalIn = entries.reduce((acc, e) => acc + (Number(e.qty) || 0), 0);
    const totalOut = exits.reduce((acc, e) => acc + (Number(e.qty) || 0), 0);
    return totalIn - totalOut;
}

export function shouldSearch(value) {
    return value === "" || value.trim().length >= 2;
}
