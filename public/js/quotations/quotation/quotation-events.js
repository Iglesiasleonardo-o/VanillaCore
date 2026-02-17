import { RenderView } from "../../vanilla-core/vanilla-render.js";
import { quotation, setQuotation } from "./logic/data-state.js";
import { fetchQuotation } from "./logic/network.js";
import { createPaymentMethodModal } from "./parts/payment-terms/pterms-viewgen.js";
import { handleOptionsClick, handleSaveClick } from "./parts/toolbar/toolbar-events.js";
import { createLoadingState, createQuotationNotFound, createQuotationView } from "./quotation-viewgen.js";

// TODO
// TERMINAR O RESTO DAS PARTES: bank accounts, customer, inventory
// MAKE SURE quotation data is being set correctly

// --- Métodos de Apoio ---
function renderSuccessState() {
    const paymentMethodModal = createPaymentMethodModal();
    const quotationView = createQuotationView(
        quotation,
        paymentMethodModal,
        handleSaveClick,
        handleOptionsClick,
    );
    RenderView(quotationView);

    console.log("Inicializando eventos da cotação...");
    // initToolbarEvents(...);
    // initCustomerEvents();
    // initInventoryEvents();
}

function renderErrorState(error, quotationNumber) {
    if (error.status === 404) {
        RenderView(createQuotationNotFound(quotationNumber));
    } else {
        console.error(error);
        alert("Erro genérico ao carregar cotação.");
    }
}

// --- Método Principal (Orquestrador) ---
export async function loadQuotationByURLEvent() {
    const quotationNumber = location.pathname.split('/')[2];

    try {
        RenderView(createLoadingState());
        const response = await fetchQuotation(quotationNumber);
        setQuotation(response.data);
        renderSuccessState();
    } catch (error) {
        renderErrorState(error, quotationNumber);
    }
}