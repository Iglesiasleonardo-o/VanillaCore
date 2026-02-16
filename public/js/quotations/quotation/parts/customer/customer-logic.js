import { fetchCustomers } from '../../database.js';

let debounceTimer = null;

export function prepareCustomerData(name, nuit, phone, address, isEntity) {
    return { name, nuit, phone, address, isEntity };
}

export function shouldSearch(value) {
    return value && value.trim().length >= 2;
}

export function searchCustomers(query, type, callback) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        try {
            const results = await fetchCustomers(query, type);
            callback(results);
        } catch (err) {
            console.error("Erro na busca:", err);
            callback([]);
        }
    }, 300);
}