import { createConditionsViewModel } from './conditions-viewmodel.js';
import { GeneralConditionsWidget } from './conditions-viewgen.js';

export function setupConditionsModule(quotation) {
    // Ensure structure exists
    if (!quotation.terms) quotation.terms = {};

    const vm = createConditionsViewModel(quotation);
    const events = setupEvents(quotation);

    const widget = GeneralConditionsWidget(vm, events);
    return widget;
}

function setupEvents(quotation) {
    return {
        onWarrantyInput: (e) => {
            const val = e.target.value;
            // Update The Truth
            quotation.terms.warrantyMonths = val;
            // Update Live Tracker (Print span)
            const printEl = $("warrantyMonthsPrint");
            printEl.textContent = val;
        },

        onNotesInput: (e) => {
            const val = e.target.value;
            // Update The Truth
            quotation.terms.additionalNotes = val;
            // Update Live Tracker (Print div)
            const printEl = $("generalConditionsExtraPrint");
            printEl.textContent = val;
            // Toggle visibility if empty to save space on paper
            printEl.classList.toggle("hidden", val.trim() === "");
        }
    };
}