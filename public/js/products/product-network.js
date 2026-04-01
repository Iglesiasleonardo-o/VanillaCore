import { products, fetchProducts } from "../vanilla-core/database.js";

const delay = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * Interface de busca que utiliza a lógica centralizada do database.js.
 * Utilizada pelo Render para preencher tanto a carga inicial quanto o infinite scroll.
 */
export async function loadProductsData(query = "", cursor = null) {
    await delay(300); // UI Smoothing para feedback visual de carregamento

    try {
        // Reutiliza a função core que já lida com Regex, Case-Insensitive e paginação
        return await fetchProducts(query, cursor);
    } catch (err) {
        console.error("Erro na busca de produtos:", err);
        return [];
    }
}

/**
 * Persiste as alterações no array global em memória.
 * Atualiza o SSOT (Single Source of Truth) para que todas as partes da app vejam a mudança.
 */
export async function saveProductDatabase(productData) {
    await delay(300); // Simula latência de rede/escrita

    if (productData.id) {
        // EDIÇÃO: Localiza no array global e atualiza
        const index = products.findIndex(p => p.id === productData.id);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
        }
    } else {
        // CRIAÇÃO: Gera novo ID sequencial e insere no array global
        const newId = products.length > 0 
            ? Math.max(...products.map(p => p.id)) + 1 
            : 1;
        
        products.push({ 
            ...productData, 
            id: newId,
            img: productData.img || "" 
        });
    }

    return { success: true };
}