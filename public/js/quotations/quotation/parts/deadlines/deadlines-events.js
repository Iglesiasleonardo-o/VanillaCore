import { calculateExpiryDate, formatToDisplayDate, getValidityDays } from './deadlines-logic.js';
import { renderIssueDate, renderExpiryDate, renderExpiryHelper, setOtherInputVisibility } from './deadlines-render.js';

function handleDeadlinesChange() {
    const issueInput = $('quoteDateInput');
    const validitySelect = $('quoteValidityDays');
    const otherInput = $('quoteValidityOther');

    // Lógica
    const days = getValidityDays(validitySelect.value, otherInput.value);
    const expiryDate = calculateExpiryDate(issueInput.value, days);
    const issueDate = formatToDisplayDate(issueInput.value);

    // Render
    renderIssueDate(issueDate);
    renderExpiryDate(expiryDate);
    renderExpiryHelper(expiryDate);
    setOtherInputVisibility(validitySelect.value === 'outro');
}

export function initDeadlinesEvents() {
    const issueInput = $('quoteDateInput');
    const validitySelect = $('quoteValidityDays');
    const otherInput = $('quoteValidityOther');

    // Data por defeito
    issueInput.value = new Date().toISOString().split('T')[0];

    issueInput.onchange = handleDeadlinesChange;
    validitySelect.onchange = handleDeadlinesChange;
    otherInput.oninput = handleDeadlinesChange;

    handleDeadlinesChange();
}