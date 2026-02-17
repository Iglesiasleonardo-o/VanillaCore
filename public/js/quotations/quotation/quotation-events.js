import { RenderView } from "../../vanilla-core/vanilla-render.js";
import { createPaymentMethodModal } from "./parts/payment-terms/pterms-viewgen.js";
import { handleOptionsClick, handleSaveClick } from "./parts/toolbar/toolbar-events.js";
import { createQuotationView } from "./quotation-viewgen.js";

export function loadQuotationByURLEvent() {
    const quotationId = location.pathname.split('/')[2];

    // show loading quotation
    // simulate network fetch in logic for quotation id
    // hide loading

    // pass the data to quotationView
    const paymentMethodModal = createPaymentMethodModal();
    const quotationView = createQuotationView(
        quotationId,
        paymentMethodModal,
        handleSaveClick,
        handleOptionsClick,
    );
    RenderView(quotationView);

    // initToolbarEvents(getSelectedCustomer, getQuoteItems, getSelectedAccountIds);
    // initDeadlinesEvents();
    // initCustomerEvents();
    // initInventoryEvents();
    // initPaymentEvents();
}