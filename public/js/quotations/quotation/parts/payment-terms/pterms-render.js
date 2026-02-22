import { buildSelectedIds } from './logic/math.js';
import { handleAddClick, handleRemoveClick } from './pterms-events.js';
import {
    createAccountPrintCard,
    createAvailableAccountItem,
    createAvailableAccountsListColumn,
    createNoPaymentMessage, createPaymentMethodModal,
    createSelectedAccountItem,
    createSelectedAccountsListColumn,
    creatQuotationAccounts
} from './pterms-viewgen.js';

export function setupPaymentTerms(globalBanks, quotationBanks, renderFooter) {
    const selectedList = createSelectedAccountsListColumn();
    const availableList = createAvailableAccountsListColumn();
    const visibleAccounts = creatQuotationAccounts();
    const noPaymentMsg = createNoPaymentMessage();

    const paymentMethodModal = createPaymentMethodModal(selectedList, availableList);

    const onAdded = (account, el) => performAddActions(
        account, el, selectedList, visibleAccounts, noPaymentMsg, quotationBanks, onAdded, onRemoved
    );

    const onRemoved = (account, el) => performRemoveActions(
        account, el, availableList, noPaymentMsg, quotationBanks, onAdded, onRemoved, selectedList
    );

    // 3. Initialize Lists
    initializeAccountLists(
        globalBanks, quotationBanks, selectedList, availableList,
        visibleAccounts, onAdded, onRemoved
    );

    if (selectedList.children.length > 0) {
        noPaymentMsg.classList.add("hidden");
    }

    visibleAccounts.appendChild(noPaymentMsg);
    renderFooter(paymentMethodModal, visibleAccounts);

    return paymentMethodModal;
}

/** * Initialization Loop 
 */
function initializeAccountLists(globalBanks, quotationBanks, selectedList, availableList, visibleAccounts, onAdded, onRemoved) {
    const selectedIds = buildSelectedIds(quotationBanks);

    globalBanks.forEach(account => {
        if (selectedIds.has(account.id)) {
            const item = createSelectedAccountItem(account, (e) => handleRemoveClick(account, e, quotationBanks, onRemoved));
            selectedList.appendChild(item);
            visibleAccounts.appendChild(createAccountPrintCard(account));
        } else {
            const item = createAvailableAccountItem(account, (e) => handleAddClick(account, e, quotationBanks, onAdded));
            availableList.appendChild(item);
        }
    });
}

/** * Add Actions - Matches your 'performAddActions' logic
 */
function performAddActions(account, clickedElement, selectedList, visibleAccounts, noPaymentMsg, quotationBanks, onAdded, onRemoved) {
    clickedElement.remove();

    const newItem = createSelectedAccountItem(account, (e) => handleRemoveClick(account, e, quotationBanks, onRemoved));
    selectedList.appendChild(newItem);

    const printCard = createAccountPrintCard(account);
    visibleAccounts.appendChild(printCard);

    // Explicit behavior: Always hide message on add
    noPaymentMsg.classList.add("hidden");
}

/** * Remove Actions - Matches your 'performRemoveActions' logic
 */
function performRemoveActions(account, clickedElement, availableList, noPaymentMsg, quotationBanks, onAdded, onRemoved, selectedList) {
    clickedElement.remove();

    const newItem = createAvailableAccountItem(account, (e) => handleAddClick(account, e, quotationBanks, onAdded));
    availableList.appendChild(newItem);

    $(`print-bank-${account.id}`).remove();

    // Explicit behavior: Check if list is empty to SHOW message
    if (selectedList.children.length === 0) {
        noPaymentMsg.classList.remove("hidden");
    }
}