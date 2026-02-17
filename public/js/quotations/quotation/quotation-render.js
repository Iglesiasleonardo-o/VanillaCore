import { RenderView } from "../../vanilla-core/vanilla-render.js";
import { renderPaymentTerms } from "./parts/payment-terms/pterms-render.js";
import { createAvailableAccountsListColumn, createPaymentMethodModal, createSelectedAccountsListColumn } from "./parts/payment-terms/pterms-viewgen.js";
import { handleOptionsClick, handleSaveClick } from "./parts/toolbar/toolbar-events.js";
import { createLoadingState, createNoPaymentMessage, createPrintContainer, createQuotationNotFound, createQuotationView } from "./quotation-viewgen.js";

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
    const selectedList = createSelectedAccountsListColumn();
    const availableList = createAvailableAccountsListColumn();
    const paymentMethodModal = createPaymentMethodModal(selectedList, availableList);

    const printEl = createPrintContainer();
    const noPaymentMsg = createNoPaymentMessage();

    const quotationView = createQuotationView(
        quotation,
        paymentMethodModal,
        printEl, noPaymentMsg,
        handleSaveClick,
        handleOptionsClick,
    );

    renderPaymentTerms(
        selectedList, availableList, printEl, noPaymentMsg,
        globalBanks, quotation.issuer.bankAccounts
    );

    RenderView(quotationView);

    console.log("Inicializando eventos da cotação...");
    // initToolbarEvents(...);
    // initCustomerEvents();
    // initInventoryEvents();
}
