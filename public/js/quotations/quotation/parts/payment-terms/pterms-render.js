// pterms-render.js
import { quotation } from '../../logic/data-state.js';
import { createDocumentFooter } from '../../quotation-viewgen.js';
import {
    createAccountPrintCard, createAvailableAccountItem, createAvailableAccountsListColumn,
    createNoPaymentMessage, createPaymentMethodModal, createPrintContainer,
    createSelectedAccountItem, createSelectedAccountsListColumn
} from './pterms-viewgen.js';

export function setupPaymentTerms(A4Sheet, globalBanks, quotationBanks) {
    const selectedList = createSelectedAccountsListColumn();
    const availableList = createAvailableAccountsListColumn();
    const printEl = createPrintContainer();
    const noPaymentMsg = createNoPaymentMessage();
    const paymentMethodModal = createPaymentMethodModal(selectedList, availableList);

    const selectedIds = new Set(quotationBanks.map(q => q.id));

    initializeAccountLists(globalBanks, selectedIds, selectedList, availableList, printEl, noPaymentMsg);

    if (selectedList.children.length > 0) {
        noPaymentMsg.classList.add("hidden");
    }

    printEl.appendChild(noPaymentMsg);
    A4Sheet.appendChild(createDocumentFooter(paymentMethodModal, printEl));

    return paymentMethodModal;
}

/** * Subdivisão: Operações de Adição (Data + Print)
 */
function performAddActions(account, printEl, noPaymentMsg) {
    quotation.issuer.bankAccounts.push(account);
    const printCard = createAccountPrintCard(account);
    printEl.appendChild(printCard);
    noPaymentMsg.classList.add("hidden");
}

/** * Subdivisão: Operações de Remoção (Data + Print)
 */
function performRemoveActions(account, selectedList, noPaymentMsg) {
    const idx = quotation.issuer.bankAccounts.findIndex(a => a.id === account.id);
    if (idx > -1) quotation.issuer.bankAccounts.splice(idx, 1);

    $(`print-bank-${account.id}`).remove();
    if (selectedList.children.length === 0) {
        noPaymentMsg.classList.remove("hidden");
    }
}

/** * Handlers Principais
 */
const handleAddClick = (account, e, selectedList, availableList, printEl, noPaymentMsg) => {
    e.currentTarget.remove();

    const newItem = createSelectedAccountItem(account, (event) =>
        handleRemoveClick(account, event, selectedList, availableList, printEl, noPaymentMsg)
    );

    selectedList.appendChild(newItem);
    performAddActions(account, printEl, noPaymentMsg);
};

const handleRemoveClick = (account, e, selectedList, availableList, printEl, noPaymentMsg) => {
    e.currentTarget.remove();

    const newItem = createAvailableAccountItem(account, (event) =>
        handleAddClick(account, event, selectedList, availableList, printEl, noPaymentMsg)
    );

    availableList.appendChild(newItem);
    performRemoveActions(account, selectedList, noPaymentMsg);
};

/** * Loop de Inicialização
 */
function initializeAccountLists(globalBanks, selectedIds, selectedList, availableList, printEl, noPaymentMsg) {
    globalBanks.forEach(account => {
        if (selectedIds.has(account.id)) {
            selectedList.appendChild(createSelectedAccountItem(account, (e) =>
                handleRemoveClick(account, e, selectedList, availableList, printEl, noPaymentMsg)
            ));

            // Reutiliza a ação de adição para o print inicial
            const printCard = createAccountPrintCard(account);
            printCard.id = `print-bank-${account.id}`;
            printEl.appendChild(printCard);
        } else {
            availableList.appendChild(createAvailableAccountItem(account, (e) =>
                handleAddClick(account, e, selectedList, availableList, printEl, noPaymentMsg)
            ));
        }
    });
}