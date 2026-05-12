import { products } from "../../vanilla-core/database.js";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Entradas e saídas ficam em memória aqui (simula tabelas separadas do DB)
export const stockEntries = [];
export const stockExits = [];

export async function loadStockBalance(query = "") {
    await delay(300);
    try {
        const q = query.trim().toLowerCase();
        return products
            .filter((p) => {
                if (!q) return true;
                return (
                    (p.name || "").toLowerCase().includes(q) ||
                    (p.ref || "").toLowerCase().includes(q)
                );
            })
            .map((p) => {
                const entries = stockEntries.filter(
                    (e) => e.productId === p.id
                );
                const exits = stockExits.filter((e) => e.productId === p.id);
                const totalIn = entries.reduce(
                    (acc, e) => acc + (Number(e.qty) || 0),
                    0
                );
                const totalOut = exits.reduce(
                    (acc, e) => acc + (Number(e.qty) || 0),
                    0
                );
                return {
                    ...p,
                    autoStock: totalIn - totalOut,
                    realStock: p.onHand ?? totalIn - totalOut,
                    minStock: p.minStock ?? 3,
                };
            });
    } catch (err) {
        console.error("Erro ao carregar balanço:", err);
        return [];
    }
}

export async function loadStockEntries(query = "") {
    await delay(300);
    const q = query.trim().toLowerCase();
    return stockEntries.filter((e) => {
        if (!q) return true;
        return (
            (e.productName || "").toLowerCase().includes(q) ||
            (e.supplier || "").toLowerCase().includes(q)
        );
    });
}

export async function loadStockExits(query = "") {
    await delay(300);
    const q = query.trim().toLowerCase();
    return stockExits.filter((e) => {
        if (!q) return true;
        return (
            (e.productName || "").toLowerCase().includes(q) ||
            (e.destination || "").toLowerCase().includes(q)
        );
    });
}

export async function saveStockEntry(entryData) {
    await delay(300);
    if (entryData.id) {
        const idx = stockEntries.findIndex((e) => e.id === entryData.id);
        if (idx !== -1)
            stockEntries[idx] = { ...stockEntries[idx], ...entryData };
    } else {
        const newId =
            stockEntries.length > 0
                ? Math.max(...stockEntries.map((e) => e.id)) + 1
                : 1;
        stockEntries.push({ ...entryData, id: newId });

        // Actualiza onHand no produto
        const p = products.find((p) => p.id === entryData.productId);
        if (p) p.onHand = (p.onHand || 0) + (Number(entryData.qty) || 0);
    }
    return { success: true };
}

export async function saveStockExit(exitData) {
    await delay(300);
    if (exitData.id) {
        const idx = stockExits.findIndex((e) => e.id === exitData.id);
        if (idx !== -1) stockExits[idx] = { ...stockExits[idx], ...exitData };
    } else {
        const newId =
            stockExits.length > 0
                ? Math.max(...stockExits.map((e) => e.id)) + 1
                : 1;
        stockExits.push({ ...exitData, id: newId });

        // Desconta onHand no produto
        const p = products.find((p) => p.id === exitData.productId);
        if (p) p.onHand = (p.onHand || 0) - (Number(exitData.qty) || 0);
    }
    return { success: true };
}
