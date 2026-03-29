import { HeaderView } from "./header-viewgen.js";
import { createHeaderViewModel } from "./header-viewmodel.js";
import { calculateExpiryDate, formatToDisplayDate } from "./header-math.js";

export function setupA4Header(quotation) {
    const viewModel = createHeaderViewModel(quotation);
    const events = setupEvents();
    return HeaderView(quotation, viewModel, events);
}

const updateUI = () => {
    const issueDate = $("dateInput").value;
    const select = $("validitySelect");
    const otherInput = $("otherInput");

    // Determine days: if "outro", read the number input; otherwise, read the select
    const days = select.value === "outro" ? (otherInput.value || 0) : select.value;
    const expiryDate = calculateExpiryDate(issueDate, Number(days));

    // Sync display elements
    $("printExpiry").textContent = expiryDate;
    $("uiExpiry").textContent = `Válida até: ${expiryDate}`;
};

function setupEvents() {
    return {
        onDateChange: () => {
            $("printDate").textContent = formatToDisplayDate($("dateInput").value);
            updateUI();
        },
        onOtherInput: () => {
            updateUI();
        },
        onValidityChange: (e) => {
            const selectValue = e.target.value;
            const otherInput = $("otherInput");

            if (selectValue === "outro") {
                otherInput.classList.remove("hidden");
                otherInput.focus();
                otherInput.select();
            } else {
                otherInput.classList.add("hidden");
                otherInput.value = "";
                updateUI();
            }
        }
    };
}