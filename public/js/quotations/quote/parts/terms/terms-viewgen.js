import { div, header, footer, h2, h3, h4, button, span, p, label, select, option, input, RichElement } from "../../../../shared/viewgencore.js";

// ==========================================
// 1. WIDGET (Replicated exactly from your HTML)
// ==========================================
export function PaymentTermsWidget(viewModel, events) {
    const termSelect = select({
        id: "paymentTerms",
        className: "block text-sm border border-gray-300 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
        onchange: events.onTermSelectChange
    });

    viewModel.standardTerms.forEach(term => {
        termSelect.Append(option({ value: term, textContent: term, selected: term === viewModel.paymentMethod }));
    });

    termSelect.Append(option({ value: "outro", textContent: "Outro (especificar)", selected: viewModel.isManualTerm }));

    return div({ className: "mt-8 pt-8 border-t border-gray-200" }).Append(
        h4({ className: "font-bold text-gray-800 mb-1", textContent: "Métodos de Pagamento" }),

        div({ className: "mb-2 grid grid-cols-[auto_1fr] gap-1 items-center" }).Append(
            // 1. Label única (Serve para Tela e Impressão)
            label({
                htmlFor: "paymentTerms",
                className: "text-sm font-semibold text-gray-700 whitespace-nowrap",
                textContent: "Termos de Pagamento:"
            }),

            // 2. Container de Valores
            div({ className: "flex flex-col w-full" }).Append(
                // Select (Só aparece na tela)
                div({ className: "no-print" }).Append(termSelect),

                // Input "Outro" (Só aparece na tela se necessário)
                input({
                    type: "text",
                    id: "paymentTermsOther",
                    className: `${viewModel.isManualTerm ? "" : "hidden"} no-print mt-1 block w-full text-sm border border-gray-300 rounded-md py-1 px-2 focus:ring-blue-500 focus:border-blue-500`,
                    placeholder: "Especificar termos...",
                    value: viewModel.isManualTerm ? viewModel.paymentMethod : "",
                    oninput: events.onTermOtherInput
                }),

                // Span de Impressão (Só aparece no A4)
                span({
                    id: "paymentTermsPrintValue",
                    className: "print-only hidden text-xs text-gray-600",
                    textContent: viewModel.paymentMethod
                })
            )
        ),

        // --- Gerir Contas Section ---
        div({ className: "mb-4 no-print" }).Append(
            button({
                id: "managePaymentMethodsButton",
                type: "button",
                className: "w-full px-6 py-3 bg-gray-100 text-gray-700 text-base font-medium rounded-lg shadow-sm border border-gray-300 hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2",
                onclick: events.onOpenModal
            }).Append(
                RichElement("i", { dataset: { lucide: "wallet" }, className: "w-5 h-5" }),
                span({ textContent: "Gerir Contas Bancárias" })
            )
        ),

        // --- Print Container for Selected Banks (Starts Empty, Render Fills It) ---
        div({ id: "paymentMethodsPrint", className: "grid grid-cols-2 gap-x-8 gap-y-4 text-xs text-gray-600" })
    );
}

// ==========================================
// 2. MODAL UI SKELETON
// ==========================================
export function PaymentTermsModal(events) {
    return div({
        id: "paymentMethodModal",
        className: "fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50 no-print",
        onclick: events.onCloseModal
    }).Append(
        div({
            className: "modal-panel bg-white w-full max-w-4xl h-full max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden",
            onclick: (e) => e.stopPropagation()
        }).Append(
            // Header
            header({ className: "p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10" }).Append(
                h2({ className: "text-xl font-bold text-gray-800", textContent: "Gerir Contas Bancárias" }),
                button({
                    className: "text-gray-400 hover:text-gray-600 transition-colors",
                    onclick: events.onCloseModal
                }).Append(RichElement("i", { dataset: { lucide: "x" }, className: "w-6 h-6" }))
            ),

            // Body Lists Containers
            div({ className: "flex-grow p-6 overflow-y-auto grid grid-cols-2 gap-6" }).Append(
                div({ className: "flex flex-col" }).Append(
                    h3({ className: "text-lg font-semibold text-gray-800 mb-3", textContent: "Contas Selecionadas" }),
                    div({ id: "selectedMethodsList", className: "flex-grow p-4 bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200 overflow-y-auto" })
                ),
                div({ className: "flex flex-col" }).Append(
                    h3({ className: "text-lg font-semibold text-gray-800 mb-3", textContent: "Contas Disponíveis" }),
                    div({ id: "availableMethodsList", className: "flex-grow p-4 bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200 overflow-y-auto" })
                )
            ),

            // Footer
            footer({ className: "p-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-gray-50 z-10" }).Append(
                button({
                    className: "px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200",
                    onclick: events.onCloseModal
                }).Append(span({ textContent: "Concluir" }))
            )
        )
    );
}

// ==========================================
// 3. ITEM COMPONENTS
// ==========================================

export function SelectedAccountItem(account, detailsString, onRemove) {
    return RichElement("li", {
        className: 'flex justify-between items-start p-3 bg-blue-50 border border-blue-200 rounded cursor-pointer hover:bg-red-50 hover:border-red-300 group transition-colors mb-2',
        onclick: (e) => onRemove(account, e.currentTarget) // Passes the clicked DOM node for O(1) removal
    }).Append(
        div({ className: 'flex-1 pr-2' }).Append(
            div({ className: 'font-bold text-gray-700 text-sm mb-1', textContent: `${account.bank} (${account.currency})` }),
            div({ className: 'text-xs text-gray-500 whitespace-pre-line leading-relaxed', textContent: detailsString })
        ),
        div({ className: 'flex flex-col justify-center h-full pt-1' }).Append(
            span({ className: 'text-gray-400 font-bold text-lg group-hover:text-red-500 transition-colors', textContent: '✕' })
        )
    );
}

export function AvailableAccountItem(account, detailsString, onAdd) {
    return RichElement("li", {
        className: 'flex justify-between items-start p-3 bg-white border border-gray-200 rounded cursor-pointer hover:bg-green-50 hover:border-green-300 transition-colors mb-2',
        onclick: (e) => onAdd(account, e.currentTarget) // Passes the clicked DOM node for O(1) removal
    }).Append(
        div({ className: 'flex-1 pr-2' }).Append(
            div({ className: 'font-bold text-gray-700 text-sm mb-1', textContent: `${account.bank} (${account.currency})` }),
            div({ className: 'text-xs text-gray-500 whitespace-pre-line leading-relaxed', textContent: detailsString })
        ),
        div({ className: 'flex flex-col justify-center h-full pt-1' }).Append(
            span({ className: 'text-green-600 font-bold text-xl hover:scale-110 transition-transform', textContent: '+' })
        )
    );
}

export function AccountPrintCard(account, detailsString) {
    return div({
        id: `print-bank-${account.id}`, // Specific ID allows surgical targeted removal
        className: 'mb-4 break-inside-avoid border-l-2 border-gray-100 pl-3'
    }).Append(
        p({ className: 'font-bold text-gray-800 text-sm mb-1', textContent: `${account.bank} (${account.currency})` }),
        p({ className: 'text-xs text-gray-600 whitespace-pre-line leading-relaxed', textContent: detailsString })
    );
}

export function EmptyPaymentMessage() {
    return p({
        id: "noPaymentMethod",
        className: "col-span-2 text-gray-400",
        textContent: "Nenhuma conta bancária selecionada."
    });
}