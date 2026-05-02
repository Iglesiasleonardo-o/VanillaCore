// import { loadQuotationByURLEvent } from '../quotations/quotation/quotation-events.js';
import { loadCustomersByURLEvent } from "../customers/customers-render.js"
import { loadDasboardByURLEvent } from "../dashboard/dashboard-render.js"
import { loadNotFoundByURLEvent } from "../not-found/not-found-render.js"
import { loadProductsByURLEvent } from "../products/product-render.js"
import { loadProfileByURL } from "../profile/profile-render.js"
import { loadQuotationByURLEvent } from "../quotations/quotation/quotation-render.js"
import { loadQuotationsListByURL } from "../quotations/quotations-render.js"

export const routes = {
    "/quotations/:quotationNumber": loadQuotationByURLEvent,
    "/quotations": loadQuotationsListByURL,
    "/products": loadProductsByURLEvent,
    "/profile": loadProfileByURL,
    "/customers": loadCustomersByURLEvent,
    "/404": loadNotFoundByURLEvent,
    "/": loadDasboardByURLEvent
}