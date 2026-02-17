import { RenderView } from "../../vanilla-core/vanilla-render.js";
import { setupPaymentTerms } from "./parts/payment-terms/pterms-render.js";
import { setupNavigationToolbar } from "./parts/toolbar/toolbar-events.js";
import { createA4Sheet, createLoadingState, createPrintFAB, createQuotationNotFound } from "./quotation-viewgen.js";

export function showLoadingState() {
    RenderView(createLoadingState());
}

export function renderErrorState(error, quotationNumber) {
    if (error.status === 404) {
        RenderView(createQuotationNotFound(quotationNumber));
    } else {
        console.error(error);
        alert("Erro genérico ao carregar cotação.");
    }
}

export function renderSuccessState(quotation, globalBanks) {
    const quotationNumber = quotation.number;

    const toolbarView = setupNavigationToolbar(quotationNumber);

    const A4Sheet = createA4Sheet(quotationNumber);
    const paymentModal = setupPaymentTerms(A4Sheet, globalBanks, quotation.issuer.bankAccounts);
    // const customerModal = setupCustomerEvents(A4Sheet, quotation.customer);
    // const inventoryModal = setupInventoryEvents(A4Sheet, quotation.items, quotation.totals);

    RenderView(
        toolbarView,
        A4Sheet,
        paymentModal,
        // customerModal,
        // inventoryModal,
        createPrintFAB()
    );
}
