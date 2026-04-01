import { fetchCustomers } from "../../../../vanilla-core/database.js";

let debounceTimer = null;


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
        }, 300); // 300ms mechanical debounce
    });
}