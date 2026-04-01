import { formatCurrency } from "./product-math.js";

export function createProductCardViewModel(product) {
    const hasStock = product.onHand !== null;
    const stockText = hasStock ? `${product.onHand} em mão` : 'Serviço/Sob Demanda';

    let stockColor = 'text-gray-500';

    if (hasStock) {
        if (product.onHand > 20) stockColor = 'text-green-600';
        else if (product.onHand > 0) stockColor = 'text-yellow-600';
        else stockColor = 'text-red-600';
    }

    return {
        id: product.id,
        name: product.name,
        priceFormatted: formatCurrency(product.price),
        stockText: stockText,
        stockColor: stockColor,
        imgSrc: product.img || 'https://placehold.co/400x400/CCCCCC/333333?text=Imagem+Indisponível'
    };
}

export function createProductListViewModel(products) {
    return products.map(createProductCardViewModel);
}

