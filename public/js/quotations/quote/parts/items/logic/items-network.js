// logic/items-network.js
import { fetchProducts } from '../../../../database.js'; // <-- Adjust this path to your actual database file

const delay = (ms) => new Promise(res => setTimeout(res, ms));

export async function loadProductsData(query, offset) {
    // You had an artificial delay in your old code, keeping it here if you still want it for UI smoothing
    await delay(300);

    try {
        return await fetchProducts(query, offset);
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}