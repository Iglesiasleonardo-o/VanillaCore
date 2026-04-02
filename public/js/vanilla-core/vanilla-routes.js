// import { loadQuotationByURLEvent } from '../quotations/quotation/quotation-events.js';
import { loadProductsByURLEvent } from "../products/product-render.js"
import { loadProfileByURL } from "../profile/profile-render.js"
import { loadQuotationByURLEvent } from "../quotations/quotation/quotation-render.js"
import { loadQuotationsListByURL } from "../quotations/quotations-render.js"

export const routes = {
    "/quotations/:quotationNumber": loadQuotationByURLEvent,
    "/quotations": loadQuotationsListByURL,
    "/products": loadProductsByURLEvent,
    "/profile": loadProfileByURL,
    "/404": () => { alert("404 - Page not found, or still being developed") },
}
