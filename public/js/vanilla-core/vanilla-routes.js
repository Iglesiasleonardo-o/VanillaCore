import { loadQuotationByURLEvent } from '../quotations/quotation/quotation-events.js';

export const routes = {
    "/quotations/:quotationId": loadQuotationByURLEvent,
    "/404": () => { alert("404 - Page not found") },
}
