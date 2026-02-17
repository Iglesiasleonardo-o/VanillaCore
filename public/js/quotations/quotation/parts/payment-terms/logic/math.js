// pterms-logic.js

/** Selected IDs from quotation banks */
export function buildSelectedIds(quotationBanks) {
    return new Set(quotationBanks.map(q => q.id));
}

/** Add account to quotation bankAccounts (keeps your current behavior: push) */
export function addAccountToQuotation(quotation, account) {
    quotation.issuer.bankAccounts.push(account);
}

/** Remove account from quotation bankAccounts (keeps your current behavior) */
export function removeAccountFromQuotation(quotation, account) {
    const idx = quotation.issuer.bankAccounts.findIndex(a => a.id === account.id);
    if (idx > -1) quotation.issuer.bankAccounts.splice(idx, 1);
}

/** Whether noPayment message should be hidden based on selected list size */
export function shouldHideNoPayment(selectedCount) {
    return selectedCount > 0;
}