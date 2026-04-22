const CURRENCY = new Intl.NumberFormat('pt-MZ', { minimumFractionDigits: 2 }); // Apenas número
const CURRENCY_SYMBOL = new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }); // Com moeda para os totais

export const formatByCurrencySymbol = (value) => CURRENCY_SYMBOL.format(value.toFixed(2));
export const formatByCurrency = (value) => CURRENCY.format(value.toFixed(2));

export const toQuoteRowViewModel = (quoteItem) => ({
    unitPrice: CURRENCY.format(quoteItem.unitPrice),
    totalLine: CURRENCY.format(quoteItem.totalLine)
});

export const toTotalsViewModel = (totals) => ({
    subtotal: CURRENCY_SYMBOL.format(totals.subtotal),
    taxTotal: CURRENCY_SYMBOL.format(totals.taxTotal),
    grandTotal: CURRENCY_SYMBOL.format(totals.grandTotal)
});

export const toModalViewModel = (cartItem, item) => {
    if (cartItem) {
        return {
            unitPrice: CURRENCY_SYMBOL.format(cartItem.unitPrice),
            totalLine: CURRENCY_SYMBOL.format(cartItem.totalLine),
            quantity: cartItem.quantity,
            discount: cartItem.discount
        };
    }
    return {
        unitPrice: CURRENCY_SYMBOL.format(item.unitPrice),
        totalLine: CURRENCY_SYMBOL.format(item.unitPrice),
        quantity: 1,
        discount: 0
    };
};