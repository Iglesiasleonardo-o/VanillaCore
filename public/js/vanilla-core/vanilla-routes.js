import { loadQuotationByURLEvent } from '../quotations/quotation/quotation-events.js';

export const routes = {
    "/quotations/:quotationNumber": loadQuotationByURLEvent,
    "/404": () => { alert("404 - Page not found") },
}
