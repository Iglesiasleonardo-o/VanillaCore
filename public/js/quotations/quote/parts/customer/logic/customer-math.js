import { fetchCustomers } from "../../../../database.js";

let debounceTimer = null;

export function shouldSearch(value) {
    return value && value.trim().length >= 2;
}

// Now it returns a Promise instead of taking a callback, making it much cleaner
export async function searchCustomersDatabase(query, type) {
    return new Promise((resolve) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            try {
                const results = await fetchCustomers(query, type);
                resolve(results);
            } catch (err) {
                console.error("Erro na busca de clientes:", err);
                resolve([]);
            }
        }, 300);
    });
}