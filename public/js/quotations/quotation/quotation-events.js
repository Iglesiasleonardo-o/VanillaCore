import { globalState } from "../../vanilla-core/vanilla-global-state.js";
import { quotation, setQuotation } from "./logic/data-state.js";
import { fetchQuotation } from "./logic/network.js";
import { renderErrorState, renderSuccessState, showLoadingState } from "./quotation-render.js";

// TODO
// TERMINAR O RESTO DAS PARTES: 
// 1. bank accounts, comparar entre global data state e o que está na cotação 
// 2. customer, 
// 3. inventory
// MAKE SURE quotation data is being set correctly

export async function loadQuotationByURLEvent() {
    const quotationNumber = location.pathname.split('/')[2];

    try {
        showLoadingState();
        const response = await fetchQuotation(quotationNumber);
        setQuotation(response.data);
        const globalBanks = globalState.company.bankAccounts;
        renderSuccessState(quotation, globalBanks);
    } catch (error) {
        renderErrorState(error, quotationNumber);
    }
}