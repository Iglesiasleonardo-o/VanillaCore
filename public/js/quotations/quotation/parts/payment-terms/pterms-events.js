// pterms-events.js
import { updateElementText } from '../../../../shared/render.js';
import { company } from '../database.js';
import {
    addAccountId,
    filterAccounts,
    removeAccountId,
    shouldInputTermManually
} from './pterms-logic.js';
import {
    renderAccountsModalLists, renderAccountsPrintArea,
    showAndRenderPrint
} from './pterms-render.js';

let selectedAccountIds = [];

export function getSelectedAccountIds() { return selectedAccountIds; }

export function initPaymentEvents() {
    // Inicializar Estado
    if (company.bankAccounts) {
        selectedAccountIds = company.bankAccounts
            .filter(acc => acc.id === 1 || acc.id === 2)
            .map(acc => acc.id);

        if (selectedAccountIds.length === 0 && company.bankAccounts.length > 0) {
            selectedAccountIds = company.bankAccounts.map(a => a.id);
        }
    }
    
    // Passamos o renderizador de contas como callback para ser chamado quando o estado mudar
    setupBankAccountsEvents();
    triggerInitialRender();
}

function triggerInitialRender() {
    // Contas (Impressão)
    const printContainer = $('paymentMethodsPrint');
    const { selected } = filterAccounts(company.bankAccounts, selectedAccountIds);
    renderAccountsPrintArea(printContainer, selected);
}

// --- Termos de Pagamento ---
export const handlePaymentTermsUpdate = (e, otherInput, printEl) => {
    const selectedTerm = e.target.value;
    const manualInputTerms = shouldInputTermManually(selectedTerm);
    showAndRenderPrint(manualInputTerms, printEl, selectedTerm, otherInput);
};

// --- Gestão de Contas Bancárias ---
// --- Gestão de Contas Bancárias (Otimizado) ---

export function setupBankAccountsEvents() {
    const btnManage = $('managePaymentMethodsButton');
    const modal = $('paymentMethodModal');
    const closeBtn1 = $('closePaymentModalButton');
    const closeBtn2 = $('finishPaymentSelectionButton');
    $('warrantyMonths').onchange = (e) => updateElementText($('warrantyMonthsPrint'), e);
    // Vincula eventos reutilizando as consts capturadas

    btnManage.onclick = () => handleOpenModal(modal);

    closeBtn1.onclick = () => handleCloseModal(modal);
    closeBtn2.onclick = () => handleCloseModal(modal);

    modal.onclick = (e) => handleModalOverlayClick(e, modal);
}

// Funções de Ação (Handlers)

function handleOpenModal(modalElement) {
    modalElement.classList.remove('hidden');
    refreshAccountsUI();
}

function handleCloseModal(modalElement) {
    modalElement.classList.add('hidden');
}

function handleModalOverlayClick(e, modalElement) {
    if (e.target === modalElement) {
        handleCloseModal(modalElement);
    }
}

function handleAccountAdd(id) {
    selectedAccountIds = addAccountId(selectedAccountIds, id);
    refreshAccountsUI();
}

function handleAccountRemove(id) {
    selectedAccountIds = removeAccountId(selectedAccountIds, id);
    refreshAccountsUI();
}

function refreshAccountsUI() {
    const printContainer = $('paymentMethodsPrint');
    const listSelected = $('selectedMethodsList');
    const listAvailable = $('availableMethodsList');

    const { selected, available } = filterAccounts(company.bankAccounts, selectedAccountIds);

    // Injeção de dependência total: elementos, dados e callbacks
    renderAccountsPrintArea(printContainer, selected);

    renderAccountsModalLists(
        listSelected,
        listAvailable,
        selected,
        available,
        handleAccountRemove,
        handleAccountAdd
    );
}