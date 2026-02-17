// pterms-render.js
import { processBanks } from './logic/math.js';
import { createAccountPrintCard, createAvailableAccountItem, createEmptyState, createSelectedAccountItem } from './pterms-viewgen.js';

export function renderPaymentTerms(
    selectedList, availableList, printEl, noPaymentMsg,
    globalBanks, quotationBanks,
    callback
) {
    const handleSelected = (account) => {
        noPaymentMsg.classList.add("hidden");
        selectedList.appendChild(createSelectedAccountItem(account, callback));
        printEl.appendChild(createAccountPrintCard(account));
    };

    const handleAvailable = (account) => {
        availableList.appendChild(createAvailableAccountItem(account, callback));
    };

    // Execução da lógica pura passando funções como argumentos
    processBanks(
        globalBanks,
        quotationBanks,
        handleSelected,
        handleAvailable
    );
}

// --- Contas Bancárias (Modal) ---
export function renderAccountsModalLists(selectedListContainer, availableListContainer, selectedAccounts, availableAccounts, onRemove, onAdd) {
    // Limpar containers
    selectedListContainer.textContent = '';
    availableListContainer.textContent = '';

    // Renderizar Selecionados
    if (selectedAccounts.length === 0) {
        selectedListContainer.appendChild(createEmptyState('Nenhuma conta selecionada.'));
    } else {
        selectedAccounts.forEach(acc => {
            selectedListContainer.appendChild(createAccountListItem(acc, true, onRemove));
        });
    }

    // Renderizar Disponíveis
    if (availableAccounts.length === 0) {
        availableListContainer.appendChild(createEmptyState('Todas as contas foram adicionadas.'));
    } else {
        availableAccounts.forEach(acc => {
            availableListContainer.appendChild(createAccountListItem(acc, false, onAdd));
        });
    }
}

// --- Contas Bancárias (Impressão) ---

export function renderAccountsPrintArea(printContainerElement, selectedAccounts) {
    printContainerElement.textContent = ''; // Limpar anterior

    // Aplica layout grid
    printContainerElement.className = 'grid grid-cols-2 gap-x-8 gap-y-4 text-xs text-gray-600';

    if (selectedAccounts.length === 0) {
        printContainerElement.classList.add('hidden');
        return;
    }

    printContainerElement.classList.remove('hidden');
    selectedAccounts.forEach(account => {
        printContainerElement.appendChild(createAccountPrintCard(account));
    });
}