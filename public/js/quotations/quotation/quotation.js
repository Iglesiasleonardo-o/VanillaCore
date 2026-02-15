export function loadQuotationByURL() {
    const quotationId = location.pathname.split('/')[2];
    console.log(`Cotação ${quotationId}`);
}