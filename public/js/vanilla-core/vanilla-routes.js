// import { loadQuotationByURLEvent } from '../quotations/quotation/quotation-events.js';
import { loadProductsByURLEvent } from "../products/product-render.js"
import { loadQuotationByURLEvent } from "../quotations/quotation/quotation-render.js"

export const routes = {
    // "/quotations/:quotationNumber": loadQuotationByURLEvent,
    "/quotations/:quotationNumber": loadQuotationByURLEvent,
    "/products": loadProductsByURLEvent,
    "/404": () => { alert("404 - Page not found, or still being developed") },
}
