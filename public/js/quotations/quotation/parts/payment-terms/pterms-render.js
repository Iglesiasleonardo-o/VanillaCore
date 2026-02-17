// pterms-render.js
import { quotation } from '../../logic/data-state.js';
import { createDocumentFooter } from '../../quotation-viewgen.js';
import { addAccountToQuotation, buildSelectedIds, removeAccountFromQuotation, shouldHideNoPayment } from './logic/math.js';
import {
    createAccountPrintCard, createAvailableAccountItem, createAvailableAccountsListColumn,
    createNoPaymentMessage, createPaymentMethodModal,
    createSelectedAccountItem, createSelectedAccountsListColumn,
    creatQuotationAccounts
} from './pterms-viewgen.js';

export function setupPaymentTerms(A4Sheet, globalBanks, quotationBanks) {
    const selectedList = createSelectedAccountsListColumn();
    const availableList = createAvailableAccountsListColumn();
    const visibleAccounts = creatQuotationAccounts();
    const noPaymentMsg = createNoPaymentMessage();
    const paymentMethodModal = createPaymentMethodModal(selectedList, availableList);

    const selectedIds = buildSelectedIds(quotationBanks);

    initializeAccountLists(globalBanks, selectedIds, selectedList, availableList, visibleAccounts, noPaymentMsg);

    if (shouldHideNoPayment(selectedList.children.length)) {
        noPaymentMsg.classList.add("hidden");
    }

    visibleAccounts.appendChild(noPaymentMsg);
    A4Sheet.appendChild(createDocumentFooter(paymentMethodModal, visibleAccounts));

    return paymentMethodModal;
}

/** * Subdivisão: Operações de Adição (Data + Print)
 */
function performAddActions(account, visibleAccounts, noPaymentMsg) {
    addAccountToQuotation(quotation, account);
    const printCard = createAccountPrintCard(account);
    visibleAccounts.appendChild(printCard);
    noPaymentMsg.classList.add("hidden");
}

/** * Subdivisão: Operações de Remoção (Data + Print)
 */
function performRemoveActions(account, selectedList, noPaymentMsg) {
    removeAccountFromQuotation(quotation, account);

    $(`print-bank-${account.id}`).remove();
    if (selectedList.children.length === 0) {
        noPaymentMsg.classList.remove("hidden");
    }
}

/** * Handlers Principais
 */
const handleAddClick = (account, e, selectedList, availableList, visibleAccounts, noPaymentMsg) => {
    e.currentTarget.remove();

    const newItem = createSelectedAccountItem(account, (event) =>
        handleRemoveClick(account, event, selectedList, availableList, visibleAccounts, noPaymentMsg)
    );

    selectedList.appendChild(newItem);
    performAddActions(account, visibleAccounts, noPaymentMsg);
};

const handleRemoveClick = (account, e, selectedList, availableList, visibleAccounts, noPaymentMsg) => {
    e.currentTarget.remove();

    const newItem = createAvailableAccountItem(account, (event) =>
        handleAddClick(account, event, selectedList, availableList, visibleAccounts, noPaymentMsg)
    );

    availableList.appendChild(newItem);
    performRemoveActions(account, selectedList, noPaymentMsg);
};

/** * Loop de Inicialização
 */
function initializeAccountLists(globalBanks, selectedIds, selectedList, availableList, visibleAccounts, noPaymentMsg) {
    globalBanks.forEach(account => {
        if (selectedIds.has(account.id)) {
            selectedList.appendChild(createSelectedAccountItem(account, (e) =>
                handleRemoveClick(account, e, selectedList, availableList, visibleAccounts, noPaymentMsg)
            ));
            visibleAccounts.appendChild(createAccountPrintCard(account));
        } else {
            availableList.appendChild(createAvailableAccountItem(account, (e) =>
                handleAddClick(account, e, selectedList, availableList, visibleAccounts, noPaymentMsg)
            ));
        }
    });
}