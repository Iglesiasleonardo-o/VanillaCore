import { globalState } from "../../vanilla-core/vanilla-global-state.js";
import { RenderView } from "../../vanilla-core/vanilla-render.js";
import { fetchQuotation } from "./logic/network.js";
import { setupA4Header } from "./parts/header/header-render.js";
import { setupNavigationToolbar } from "./parts/toolbar/toolbar-render.js";
import {
    createLoadingState,
    createPrintFAB,
    createQuotationNotFound
} from "./quote-viewgen.js";

export async function loadQuotationByURLEvent() {
    const quotationNumber = location.pathname.split('/')[2];

    try {
        const loadingDiv = createLoadingState();
        RenderView(loadingDiv);

        const response = await fetchQuotation(quotationNumber);
        const globalBanks = globalState.company.bankAccounts;

        loadingDiv.classList.add("hidden");

        renderSuccessState(response.data, globalBanks);
    } catch (error) {
        renderErrorState(error, quotationNumber);
    }
}

function renderErrorState(error, quotationNumber) {
    if (error.status === 404) {
        RenderView(createQuotationNotFound(quotationNumber));
    } else {
        console.error(error);
        alert("Erro genérico ao carregar cotação.");
    }
}

function renderSuccessState(quotation, globalBanks) {
    RenderView(
        setupNavigationToolbar(quotation.number), // doesnt have anything that changes, or requires ui state
        setupA4Header(quotation),
        createPrintFAB() // doesnt have anything that changes, or requires ui state
    );
}