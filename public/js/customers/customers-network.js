const delay = (ms) => new Promise(res => setTimeout(res, ms));

// Mock Data c/ 150 registos para testar o Infinite Scroll
let mockClients = Array.from({ length: 150 }).map((_, i) => ({
    id: i + 1,
    clientType: i % 3 === 0 ? 'empresa' : 'pessoa',
    clientName: `Cliente Exemplo ${i + 1}`,
    jobPosition: i % 3 === 0 ? null : 'Cargo ' + (i+1),
    clientEmail: `cliente${i+1}@exemplo.com`,
    clientPhone: `+258 84 ${Math.floor(1000000 + Math.random() * 9000000)}`,
    clientNuit: i % 3 === 0 ? `500${100000 + i}` : null,
    addressDistrict: 'Maputo',
    addressState: 'Maputo Cidade',
    addressCountry: 'Moçambique'
})).reverse(); // Mais recentes primeiro

const ITEMS_PER_PAGE = 24;

export async function loadCustomersData(query = "", cursor = null) {
    await delay(400); // UI Smoothing

    let filtered = [...mockClients];

    // Lógica de filtro Case-Insensitive
    if (query && query.trim().length > 0) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(c =>
            c.clientName.toLowerCase().includes(lowerQuery) ||
            (c.clientEmail && c.clientEmail.toLowerCase().includes(lowerQuery)) ||
            (c.clientNuit && c.clientNuit.toLowerCase().includes(lowerQuery))
        );
    }

    // Paginação
    const startIndex = cursor ? parseInt(cursor, 10) : 0;
    const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const nextCursor = (startIndex + ITEMS_PER_PAGE < filtered.length) ? startIndex + ITEMS_PER_PAGE : null;

    return {
        data: paginatedData,
        nextCursor: nextCursor
    };
}

export async function saveCustomerDatabase(clientData) {
    await delay(300);

    if (clientData.id) {
        const index = mockClients.findIndex(c => c.id === clientData.id);
        if (index !== -1) mockClients[index] = { ...mockClients[index], ...clientData };
    } else {
        const newId = mockClients.length > 0 ? Math.max(...mockClients.map(c => c.id)) + 1 : 1;
        clientData.id = newId;
        mockClients.unshift(clientData); // Coloca no topo
    }

    return { success: true };
}

export async function getCustomerById(id) {
    return mockClients.find(c => c.id === id) || null;
}