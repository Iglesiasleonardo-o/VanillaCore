// pterms-viewgen.js

import {
    div, header, footer, h2, h3,
    button, span, RichElement,
    p
} from "../../../../shared/viewgencore.js";

export function createPaymentMethodModal(selectedList, availableList) {
    const paymentMethodModal = div({
        id: "paymentMethodModal",
        className: "fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50 no-print",
        onclick: e => {
            if (e.target === e.currentTarget) {
                e.target.classList.add('hidden');
            }
        }
    });

    paymentMethodModal.Append(
        div({
            className: "modal-panel bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden"
        }).Append(
            createModalHeader(paymentMethodModal),
            createModalBody(selectedList, availableList),
            createModalFooter(paymentMethodModal)
        )
    );

    return paymentMethodModal;
}

// MODAL HEADER
function createModalHeader(paymentMethodModal) {
    return header({
        className: "p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10"
    }).Append(
        h2({ className: "text-xl font-bold text-gray-800", textContent: "Gerir Contas Bancárias" }),
        button({
            id: "closePaymentModalButton",
            className: "text-gray-400 hover:text-gray-600",
            onclick: () => { paymentMethodModal.classList.add('hidden'); }
        }).Append(
            RichElement("i", { dataset: { lucide: "x" }, className: "w-6 h-6" })
        )
    );
}

function createModalBody(selectedAccountsView, availableAccountsView) {
    return div({
        className: "flex-grow p-6 overflow-y-auto grid grid-cols-2 gap-6"
    }).Append(
        div({ className: "flex flex-col" }).Append(
            h3({ className: "text-lg font-semibold text-gray-800 mb-3", textContent: "Contas Selecionadas" }),
            selectedAccountsView
        ),
        div({ className: "flex flex-col" }).Append(
            h3({ className: "text-lg font-semibold text-gray-800 mb-3", textContent: "Contas Disponíveis" }),
            availableAccountsView
        )
    );
}

export function createSelectedAccountsListColumn() {
    return createMethodListColumn("selectedMethodsList");
}

export function createAvailableAccountsListColumn() {
    return createMethodListColumn("availableMethodsList");
}

function createMethodListColumn(listId) {
    return div({
        id: listId,
        className: "flex-grow p-4 bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200 overflow-y-auto"
    })
}

function createModalFooter(paymentMethodModal) {
    return footer({
        className: "p-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-gray-50 z-10"
    }).Append(
        button({
            id: "finishPaymentSelectionButton",
            className: "px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200",
            onclick: () => { paymentMethodModal.classList.add('hidden'); }
        }).Append(
            span({ textContent: "Concluir" })
        )
    );
}

// Função auxiliar interna para os detalhes (mantém o padrão DRY sem expor lógica complexa)
function getAccountDetails(account) {
    return `Titular: ${account.accountHolder}\nBanco: ${account.bank}\nConta: ${account.accountNumber}\nNIB: ${account.nib || 'N/A'}\nSWIFT: ${account.swift || 'N/A'}`;
}

/** Item para a coluna de Selecionados (Botão de remover) */
export function createSelectedAccountItem(account, onItemClick) {
    return RichElement("li", {
        className: 'flex justify-between items-start p-3 bg-blue-50 border border-blue-200 rounded cursor-pointer hover:bg-red-50 hover:border-red-300 group transition-colors mb-2',
        onclick: e => onItemClick(e)
    }).Append(
        div({ className: 'flex-1 pr-2' }).Append(
            div({ className: 'font-bold text-gray-700 text-sm mb-1', textContent: `${account.bank} (${account.currency})` }),
            div({ className: 'text-xs text-gray-500 whitespace-pre-line leading-relaxed', textContent: getAccountDetails(account) })
        ),
        div({ className: 'flex flex-col justify-center h-full pt-1' }).Append(
            span({ className: 'text-gray-400 font-bold text-lg group-hover:text-red-500 transition-colors', textContent: '✕' })
        )
    );
}

/** Item para a coluna de Disponíveis (Botão de adicionar) */
export function createAvailableAccountItem(account, onItemClick) {
    return RichElement("li", {
        className: 'flex justify-between items-start p-3 bg-white border border-gray-200 rounded cursor-pointer hover:bg-green-50 hover:border-green-300 transition-colors mb-2',
        onclick: e => onItemClick(e)
    }).Append(
        div({ className: 'flex-1 pr-2' }).Append(
            div({ className: 'font-bold text-gray-700 text-sm mb-1', textContent: `${account.bank} (${account.currency})` }),
            div({ className: 'text-xs text-gray-500 whitespace-pre-line leading-relaxed', textContent: getAccountDetails(account) })
        ),
        div({ className: 'flex flex-col justify-center h-full pt-1' }).Append(
            span({ className: 'text-green-600 font-bold text-xl hover:scale-110 transition-transform', textContent: '+' })
        )
    );
}

/**
 * Creates the static card for the A4 Print view.
 */
export function createAccountPrintCard(account) {
    const detailsText = `Titular: ${account.accountHolder}\nBanco: ${account.bank}\nConta: ${account.accountNumber}\nNIB: ${account.nib || 'N/A'}\nSWIFT: ${account.swift || 'N/A'}`;

    return div({ id: `print-bank-${account.id}`, className: 'mb-4 break-inside-avoid border-l-2 border-gray-100 pl-3' }).Append(
        p({
            className: 'font-bold text-gray-800 text-sm mb-1',
            textContent: `${account.bank} (${account.currency})`
        }),
        p({
            className: 'text-xs text-gray-600 whitespace-pre-line leading-relaxed',
            textContent: detailsText
        })
    );
}

export function createEmptyState(text) {
    return div({
        className: 'text-gray-400 text-sm italic text-center p-4',
        textContent: text
    });
}

export function createPrintContainer() {
    return div({ id: "paymentMethodsPrint", className: "grid grid-cols-2 gap-x-8 gap-y-4 text-xs text-gray-600" });
}

export function createNoPaymentMessage() {
    return p({ id: "noPaymentMethod", className: "col-span-2 text-gray-400", textContent: "Nenhuma conta bancária selecionada." });
}
