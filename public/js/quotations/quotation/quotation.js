import { RenderView } from "../../vanilla-core/vanilla-render.js";
import { createQuotationView } from "./quotation-viewgen.js";

export function loadQuotationByURL() {
    const quotationId = location.pathname.split('/')[2];
    RenderView(createQuotationView(quotationId));

}