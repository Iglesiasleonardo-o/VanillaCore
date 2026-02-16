import { RenderView } from "../../vanilla-core/vanilla-render.js";
import { handleOptionsClick, handleSaveClick } from "./parts/toolbar/toolbar-events.js";
import { createQuotationView } from "./quotation-viewgen.js";

export function loadQuotationByURLEvent() {
    const quotationId = location.pathname.split('/')[2];

    RenderView(createQuotationView(
        quotationId,
        handleSaveClick,
        handleOptionsClick,
    ));

    // initToolbarEvents(getSelectedCustomer, getQuoteItems, getSelectedAccountIds);
    // initDeadlinesEvents();
    // initCustomerEvents();
    // initInventoryEvents();
    // initPaymentEvents();
}

function executePrint() {
    window.print();
}