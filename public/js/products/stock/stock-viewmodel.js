import {
    formatCurrency,
    calcStockValue,
    getStockStatus,
} from "./stock-math.js";

export function createBalanceRowViewModel(item) {
    const status = getStockStatus(item.realStock, item.minStock);

    let statusColor = "text-green-600 bg-green-50";
    if (status === "REPOR") statusColor = "text-red-600 bg-red-50";
    else if (status === "SEM STOCK") statusColor = "text-gray-500 bg-gray-100";

    const stockValue = calcStockValue(
        item.realStock,
        item.cost || item.price || 0
    );

    return {
        id: item.id,
        sku: item.ref || "—",
        name: item.name || "Produto sem nome",
        autoStock: item.autoStock ?? 0,
        realStock: item.realStock ?? 0,
        minStock: item.minStock ?? 0,
        stockValueFormatted: formatCurrency(stockValue),
        status,
        statusColor,
    };
}

export function createEntryRowViewModel(entry) {
    return {
        id: entry.id,
        date: entry.date || "—",
        productName: entry.productName || "—",
        supplier: entry.supplier || "—",
        qtyIn: entry.qty ?? 0,
        qtyPerBox: entry.qtyPerBox || "—",
        factor: entry.factor || "—",
        costFormatted: formatCurrency(entry.unitCost || 0),
    };
}

export function createExitRowViewModel(exit) {
    return {
        id: exit.id,
        date: exit.date || "—",
        productName: exit.productName || "—",
        destination: exit.destination || "—",
        qty: exit.qty ?? 0,
        priceFormatted: formatCurrency(exit.unitPrice || 0),
    };
}
