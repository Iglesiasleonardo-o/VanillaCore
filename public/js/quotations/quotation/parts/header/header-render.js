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