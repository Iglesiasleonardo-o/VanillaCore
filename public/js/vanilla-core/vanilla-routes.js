// import { loadQuotationByURLEvent } from '../quotations/quotation/quotation-events.js';
import { loadQuotationByURLEvent } from "../quotations/quote/quote-render.js"

export const routes = {
    // "/quotations/:quotationNumber": loadQuotationByURLEvent,
    "/quotations/:quotationNumber": loadQuotationByURLEvent,
    "/404": () => { alert("404 - Page not found") },
}
