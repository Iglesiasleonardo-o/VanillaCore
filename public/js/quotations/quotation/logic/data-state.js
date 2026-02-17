import { globalState } from "../../../vanilla-core/vanilla-global-state.js";

export let quotation = {};

export function setQuotation(newData) {
    quotation = newData;
    console.log("new data", quotation);
}

export function resetQuotation(number) {
    quotation = {
        number,
        status: "draft",
        issuer: {
            ...globalState.company
        },
        items: [],
        totals: { grand_total: 0 }
        // ... outros campos padrão
    };
}