import { products } from "../vanilla-core/database.js";

let debounceTimer = null;

// ==========================================
// 1. CARREGAMENTO INICIAL
// ==========================================
export async function fetchInitialProducts() {
    return new Promise((resolve) => {
        // Simulação de latência de rede (ex: 200ms)
        setTimeout(() => {
            try {
                // Retornamos todos os produtos (ou podes aplicar paginação/slice no futuro)
                resolve(products);
            } catch (err) {
                console.error("Erro ao carregar produtos iniciais:", err);
                resolve([]);
            }
        }, 200);
    });
}

// ==========================================
// 2. PESQUISA COM DEBOUNCE
// ==========================================
export async function searchProductsDatabase(query) {
    return new Promise((resolve) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            try {
                if (!query) {
                    resolve(products);
                    return;
                }

                const q = query.toLowerCase().trim();
                const results = products.filter(p =>
                    p.name.toLowerCase().includes(q) ||
                    (p.ref && p.ref.toLowerCase().includes(q))
                );

                resolve(results);
            } catch (err) {
                console.error("Erro na busca de produtos:", err);
                resolve([]);
            }
        }, 300); // 300ms mechanical debounce
    });
}

// ==========================================
// 3. GUARDAR / ATUALIZAR PRODUTO
// ==========================================
export async function saveProductDatabase(productData) {
    return new Promise((resolve) => {
        // Simulação de latência de gravação
        setTimeout(() => {
            try {
                if (productData.id) {
                    // Edição de produto existente
                    const index = products.findIndex(p => p.id === productData.id);
                    if (index !== -1) {
                        products[index] = { ...products[index], ...productData };
                    }
                } else {
                    // Criação de novo produto
                    const newId = products.length > 0
                        ? Math.max(...products.map(p => p.id)) + 1
                        : 1;

                    const newProduct = {
                        ...productData,
                        id: newId,
                        // Se não houver imagem, aplica um placeholder por defeito baseado no ID
                        img: productData.img || `https://placehold.co/100x100?text=Prod+${newId}`
                    };

                    products.push(newProduct);
                }

                // Numa API real, retornarias o estado de sucesso (ex: HTTP 200/201)
                resolve({ success: true, data: productData });
            } catch (err) {
                console.error("Erro ao guardar produto:", err);
                resolve({ success: false, error: err });
            }
        }, 400);
    });
}