import { updateElementText } from "../../shared/render.js";
import { RenderView } from "../../vanilla-core/vanilla-render.js";
import { handlePaymentTermsUpdate } from "./parts/payment-terms/pterms-events.js";
import { handleOptionsClick, handleSaveClick } from "./parts/toolbar/toolbar-events.js";
import { createQuotationView } from "./quotation-viewgen.js";

export function loadQuotationByURLEvent() {
    const quotationId = location.pathname.split('/')[2];

    RenderView(createQuotationView(
        quotationId,
        // toolbar events
        executePrint,
        handleSaveClick,
        handleOptionsClick,
        // payment terms events
        handlePaymentTermsUpdate,
        updateElementText
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