import { calculateExpiryDate, formatToDisplayDate } from "./header-logic.js";
import { createHeaderViews } from "./header-viewgen.js";
import { createHeaderState } from "./logic/header-data-state.js";

export function setupA4Header(quotation) {
    const state = createHeaderState(quotation);
    const events = setupEvents(state);
    const { root, views } = createHeaderViews(quotation, events);
    observeState(state, views);
    return root;
}

function observeState(state, {
    printDate, dateInput, printExpiry, uiExpiry,
    validitySelect, otherInput, sellerSpan
}) {
    state.on("issueDate", (issueDate) => {
        printDate.textContent = formatToDisplayDate(issueDate);
        dateInput.value = issueDate;
    });

    state.on("expiryDate", (expiryDate) => {
        printExpiry.textContent = expiryDate;
        uiExpiry.textContent = `Válida até: ${expiryDate}`;
    });

    state.on("seller", (name) => {
        sellerSpan.textContent = name || "Anónimo";
    });

    state.on("expiryDays", (days) => {
        const isStandard = ["7", "15", "30", "120"].includes(days.toString());
        const isManualMode = validitySelect.value === "outro" || !isStandard;
        otherInput.classList.toggle("hidden", !isManualMode);
        validitySelect.value = isManualMode ? "outro" : days;
    });
}

// --- Events Factory ---
const setupEvents = state => ({
    onDateChange: e => {
        state.issueDate = e.target.value;
        state.expiryDate = calculateExpiryDate(state.issueDate, state.expiryDays);
    },
    onOtherInput: e => {
        state.expiryDays = parseInt(e.target.value) || 0;
        state.expiryDate = calculateExpiryDate(state.issueDate, state.expiryDays);
    },
    onValidityChange: (e, otherInput) => {
        const isOther = e.target.value === "outro";

        if (isOther) {
            state.expiryDays = parseInt(otherInput.value) || 0;
            // Now that the Observer has removed '.hidden', focus works!
            otherInput.focus();
            otherInput.select();
        } else {
            state.expiryDays = parseInt(e.target.value);
        }
        state.expiryDate = calculateExpiryDate(state.issueDate, state.expiryDays);
    }
});