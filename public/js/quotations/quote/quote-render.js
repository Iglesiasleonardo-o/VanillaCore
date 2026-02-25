import { globalState } from "../../vanilla-core/vanilla-global-state.js";
import { RenderView } from "../../vanilla-core/vanilla-render.js";
import { fetchQuotation } from "./logic/network.js";
import { setupCustomerModule } from "./parts/customer/customer-render.js";
import { setupA4Header } from "./parts/header/header-render.js";
import { setupItemsModule } from "./parts/items/items-render.js";
import { setupNavigationToolbar } from "./parts/toolbar/toolbar-render.js";
import { A4Sheet, LoadingState, QuotationNotFound } from "./quote-viewgen.js";

export async function loadQuotationByURLEvent() {
    const quotationNumber = location.pathname.split('/')[2];

    try {
        const loadingDiv = LoadingState();
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
        RenderView(QuotationNotFound(quotationNumber));
    } else {
        console.error(error);
        alert("Erro genérico ao carregar cotação.");
    }
}

function renderSuccessState(quotation, globalBanks) {
    const customerUi = setupCustomerModule(quotation);
    const itemsUi = setupItemsModule(quotation);

    RenderView(
        setupNavigationToolbar(quotation.number), // doesnt have anything that changes, or requires ui state
        A4Sheet(
            setupA4Header(quotation),
            customerUi.widget,
            itemsUi
        ),
        customerUi.modal,
        itemsUi.modal
        // Here is where modals should be naturally
    );
}