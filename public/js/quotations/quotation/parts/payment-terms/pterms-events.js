import { addAccountToQuotation, removeAccountFromQuotation } from './logic/math.js';

export const handleAddClick = (account, event, quotation, onAdded) => {
    addAccountToQuotation(quotation, account);
    onAdded(account, event.currentTarget);
};

export const handleRemoveClick = (account, event, quotation, onRemoved) => {
    removeAccountFromQuotation(quotation, account);
    onRemoved(account, event.currentTarget);
};