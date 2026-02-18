import { createDocumentHeader } from "./header-viewgen.js";

export function setupA4Header(quotation) {
    return createDocumentHeader(quotation, updateExpiry);
}

export function updateExpiry(days) {
    const issueDateInput = $("quoteDateInput");
    const printExpirySpan = $("quoteExpiryDate");
    const uiExpirySpan = $("quoteExpiryDateUI");

    const date = new Date(issueDateInput.value);
    date.setDate(date.getDate() + parseInt(days));

    const finalDate = date.toISOString().split('T')[0];
    printExpirySpan.textContent = finalDate;
    uiExpirySpan.textContent = `Válida até: ${finalDate}`;
}

export function renderIssueDate(formattedDate) {
    const element = $('quoteDate');
    element.textContent = formattedDate;
}

export function renderExpiryDate(formattedDate) {
    const element = $('quoteExpiryDate');
    element.textContent = formattedDate;
}

export function renderExpiryHelper(formattedDate) {
    $('quoteExpiryDateUI').textContent = formattedDate;
}

export function setOtherInputVisibility(isVisible) {
    const input = $('quoteValidityOther');
    if (isVisible) {
        input.style.display = 'block';
        input.focus();
    } else {
        input.style.display = 'none';
    }
}