import { quotations } from "../vanilla-core/database.js";

// Adaptador da BD Mock para a UI
let mockQuotesDatabase = quotations.map(q => {
    let compatStatus = "Pendente"; 
    if (q.status === "draft" || !q.status) compatStatus = "Rascunho";
    if (q.status === "finalized") compatStatus = "Pendente";
    
    return {
        ...q,
        id: parseInt(q.number.split('-')[0]) || Math.floor(Math.random() * 10000),
        status: compatStatus,
        customer: q.customer ? q.customer.name : "Cliente Desconhecido",
        nuit: q.customer && q.customer.nuit ? q.customer.nuit : "N/A",
        total: q.totals ? q.totals.grandTotal : 0,
        date: q.issueDate,
        expiry: q.expiryDate
    };
});

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export async function loadQuotationsData(query = "", cursor = 0, statusFilter = "") {
    await delay(300); // UI Smoothing para o infinite scroll

    return new Promise((resolve) => {
        let filtered = mockQuotesDatabase;

        // Filtro de Pesquisa (Query)
        if (query) {
            const lowerQuery = query.toLowerCase();
            filtered = filtered.filter(q => 
                q.number.toLowerCase().includes(lowerQuery) ||
                q.customer.toLowerCase().includes(lowerQuery) ||
                (q.nuit && q.nuit.includes(lowerQuery))
            );
        }

        // Filtro de Estado
        if (statusFilter) {
            filtered = filtered.filter(q => q.status === statusFilter);
        }

        // Ordenação mais recente
        filtered.sort((a, b) => b.id - a.id);

        // Paginação
        const ITEMS_PER_PAGE = 12;
        const start = cursor || 0;
        const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);
        const nextCursor = start + ITEMS_PER_PAGE < filtered.length ? start + ITEMS_PER_PAGE : null;

        resolve({ data: paginated, nextCursor });
    });
}

export async function deleteQuotation(id) {
    await delay(200);
    mockQuotesDatabase = mockQuotesDatabase.filter(q => q.id !== id);
    return { success: true };
}

export async function saveQuotation(newQuote) {
    await delay(200);
    mockQuotesDatabase.unshift(newQuote);
    return { success: true, data: newQuote };
}

export async function updateQuotationStatus(id, newStatus) {
    await delay(200);
    const quote = mockQuotesDatabase.find(q => q.id === id);
    if (quote) quote.status = newStatus;
    return { success: true };
}