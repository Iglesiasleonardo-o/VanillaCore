import { formatCurrency } from "./product-math.js";

export function createProductCardViewModel(product) {
    // 1. Lógica rigorosa de Inventário vs Serviços
    const isService = product.productType === 'servico' || product.type === 'servico';
    const isTracking = product.trackInventory !== false; // Assume true por defeito
    const hasStock = product.onHand !== undefined && product.onHand !== null;

    let stockText = 'Serviço / Sob Demanda';
    let stockColor = 'text-gray-500';

    // Só mostra "X em mão" se não for serviço e se o rastreio estiver ativo
    if (!isService && isTracking && hasStock) {
        stockText = `${product.onHand} em mão`;
        if (product.onHand > 20) stockColor = 'text-green-600';
        else if (product.onHand > 0) stockColor = 'text-yellow-600';
        else stockColor = 'text-red-500';
    }

    // 2. Conversão segura de preços (Números Reais)
    let priceRaw = parseFloat(product.price ?? product.unitPrice ?? 0);
    if (isNaN(priceRaw)) priceRaw = 0;

    // 3. Fallback seguro para o nome e imagem
    const safeName = (product.name || 'S/N').substring(0, 10);

    return {
        id: product.id,
        name: product.name || 'Produto sem nome',
        // Usa a tua função formatCurrency diretamente e com performance O(1)
        priceFormatted: formatCurrency(priceRaw), 
        stockText: stockText,
        stockColor: stockColor,
        imgSrc: product.img || `https://placehold.co/400x400/CCCCCC/333333?text=${encodeURIComponent(safeName)}`
    };
}

export function createProductListViewModel(products) {
    return products.map(createProductCardViewModel);
}