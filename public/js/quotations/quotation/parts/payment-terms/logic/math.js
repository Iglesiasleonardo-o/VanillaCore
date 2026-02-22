// pterms-logic.js

/** Selected IDs from quotation banks */
export function buildSelectedIds(quotationBanks) {
    return new Set(quotationBanks.map(q => q.id));
}

/** Add account to quotation bankAccounts (keeps your current behavior: push) */
export function addAccountToQuotation(quotationBanks, account) {
    quotationBanks.push(account);
}

/** Remove account from quotation bankAccounts (keeps your current behavior) */
export function removeAccountFromQuotation(quotationBanks, account) {
    const idx = quotationBanks.findIndex(a => a.id === account.id);
    if (idx > -1) quotationBanks.splice(idx, 1);
}