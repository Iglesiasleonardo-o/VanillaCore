import { loadQuotationByURL } from '../quotations/quotation/quotation.js';

export const routes = {
    "/quotations/:quotationId": loadQuotationByURL
}
