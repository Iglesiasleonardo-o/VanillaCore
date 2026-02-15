import { loadQuotationByURL } from '../quotations/quotation/quotation.js';

export const routes = {
    "/quotations/:quotationId": loadQuotationByURL,
    "/404": () => { alert("404 - Page not found") },
}
