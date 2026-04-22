import { button, div, footer, form, h1, h2, h3, header, input, label, p, RichElement, section, span, textarea, ul, li } from "../../../../vanilla-core/viewgencore.js";

export function CustomerSection(viewModel, events) {
    return div({ className: "flex justify-between items-end" }).Append(
        section({ className: "pt-1 border-t border-gray-300 w-1/2" }).Append(
            h3({ className: "text-sm font-bold text-gray-500 uppercase tracking-wide", textContent: "Cliente" }),
            div({ className: "w-full no-print" }).Append(
                div({ className: "relative mb-2" }).Append(
                    input({
                        id: "customer-search-input",
                        type: "text",
                        placeholder: viewModel.searchPlaceholder,
                        className: "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                        readOnly: true,
                        onclick: events.onOpenModal
                    }),
                    button({
                        id: "customer-clear-btn",
                        className: `absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 ${viewModel.hasName ? "" : "hidden"}`,
                        onclick: events.onClearCustomer
                    }).Append(
                        RichElement("i", { dataset: { lucide: "x-circle" }, className: "w-5 h-5" })
                    )
                )
            ),
            div({ id: "customer-details-container", className: "border-l border-gray-200 pl-2 text-xs text-gray-700 min-h-[100px]" }).Append(
                viewModel.hasName ? DetailsContent(viewModel) : EmptyState()
            )
        ),

        // Static Title Block
        div({ className: "flex flex-col items-end text-right flex-shrink-0 ml-8" }).Append(
            h1({ className: "text-3xl font-bold text-gray-900 -mb-1", textContent: "COTAÇÃO" }),
            p({
                id: "quoteNumber", className: "text-lg font-semibold text-blue-600",
                textContent: `Nº ${viewModel.quotationNumber}`
            })
        )
    );
}

// ==========================================
// 2. MODAL FORM UI
// ==========================================
export function CustomerModal(viewModel, events) {
    return div({
        id: "customer-selection-modal",
        className: "fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50 no-print",
        onclick: events.onCancelModal
    }).Append(
        div({
            className: "modal-panel bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]",
            onclick: (e) => e.stopPropagation()
        }).Append(

            header({ className: "p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10" }).Append(
                h2({ className: "text-xl font-bold text-gray-800", textContent: "Selecionar ou Criar Cliente" }),
                button({
                    id: "close-customer-modal-button",
                    type: "button",
                    className: "text-gray-400 hover:text-gray-600 transition-colors",
                    onclick: events.onCancelModal
                }).Append(
                    RichElement("i", { dataset: { lucide: "x" }, className: "w-6 h-6" })
                )
            ),

            form({
                id: "customer-form",
                className: "flex flex-col flex-grow overflow-hidden",
                onsubmit: events.onSaveModal
            }).Append(
                div({ className: "p-6 overflow-y-auto space-y-5 flex-grow" }).Append(

                    // Name Field
                    div({ className: "relative group" }).Append(
                        label({ htmlFor: "input-customer-name", className: "block text-sm font-medium text-gray-700" }).Append(
                            span({ textContent: "Nome do Cliente " }),
                            span({ className: "text-red-500", textContent: "*" })
                        ),
                        div({ className: "relative mt-1" }).Append(
                            input({
                                type: "text",
                                id: "input-customer-name",
                                value: viewModel.name,
                                autocomplete: "off",
                                required: true,
                                className: "capitalize block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                                placeholder: "Digite o nome para pesquisar ou criar...",
                                oninput: events.onNameInput,
                                onfocus: (e) => e.target.select()
                            }),
                            div({ id: "customer-loading-name", className: "absolute right-3 top-1/2 -translate-y-1/2 hidden" }).Append(
                                div({ className: "animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-b-blue-600" })
                            )
                        ),
                        ul({ id: "customer-results-name", className: "hidden absolute z-20 w-full bg-white shadow-lg max-h-48 rounded-md border border-gray-200 overflow-y-auto mt-1 divide-y divide-gray-100" })
                    ),

                    // Entity Toggle
                    div({
                        id: "containerToggleEntity",
                        className: "flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer",
                        onclick: events.onToggleEntity
                    }).Append(
                        span({ className: "text-sm font-medium text-gray-700 select-none", textContent: "O cliente é uma Entidade/Empresa?" }),
                        label({ className: "relative inline-flex items-center cursor-pointer" }).Append(
                            input({
                                type: "checkbox",
                                id: "toggleIsEntity",
                                checked: viewModel.isEntity,
                                className: "sr-only peer",
                                onchange: events.onToggleEntity
                            }),
                            div({ className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })
                        )
                    ),

                    // NUIT & Phone Grid
                    div({ className: "grid grid-cols-1 md:grid-cols-2 gap-4" }).Append(
                        div({ className: "relative" }).Append(
                            label({ htmlFor: "input-customer-nuit", className: "block text-sm font-medium text-gray-700" }).Append(
                                span({ textContent: "NUIT " }),
                                span({ id: "label-nuit-required", className: `text-red-500 ${viewModel.isEntity ? "" : "hidden"}`, textContent: "*" })
                            ),
                            div({ className: "relative mt-1" }).Append(
                                input({
                                    type: "number",
                                    min: "1000000",
                                    max: "100000000000",
                                    id: "input-customer-nuit",
                                    required: viewModel.isEntity,
                                    value: viewModel.nuit,
                                    autocomplete: "off",
                                    className: "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500",
                                    placeholder: "Digite o NUIT para pesquisar...",
                                    oninput: events.onNuitInput,
                                    onfocus: (e) => e.target.select()
                                }),
                                div({ id: "loading-nuit", className: "absolute right-3 top-1/2 -translate-y-1/2 hidden" }).Append(
                                    div({ className: "animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-b-blue-600" })
                                )
                            ),
                            ul({ id: "customer-results-nuit", className: "hidden absolute z-20 w-full bg-white shadow-lg max-h-48 rounded-md border border-gray-200 overflow-y-auto mt-1 divide-y divide-gray-100" })
                        ),
                        div().Append(
                            label({ htmlFor: "input-customer-phone", className: "block text-sm font-medium text-gray-700", textContent: "Telefone" }),
                            input({
                                type: "text",
                                id: "input-customer-phone",
                                value: viewModel.phone,
                                className: "capitalize mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500",
                                oninput: events.onPhoneInput,
                                onfocus: (e) => e.target.select()
                            })
                        )
                    ),

                    // Address
                    div().Append(
                        label({ htmlFor: "input-customer-address", className: "block text-sm font-medium text-gray-700" }).Append(
                            span({ textContent: "Endereço " }),
                            span({ className: "text-red-500", textContent: "*" })
                        ),
                        textarea({
                            id: "input-customer-address",
                            value: viewModel.address,
                            rows: "2",
                            required: true,
                            className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500",
                            oninput: events.onAddrInput,
                            onfocus: (e) => e.target.select()
                        })
                    )
                ),

                // Footer Actions
                footer({ className: "p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 mt-auto" }).Append(
                    button({
                        id: "btn-cancel-customer",
                        type: "button",
                        className: "px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors",
                        textContent: "Cancelar",
                        onclick: events.onCancelModal
                    }),
                    button({
                        id: "btn-confirm-customer",
                        type: "submit",
                        className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm font-medium text-sm transition-colors flex items-center gap-2"
                    }).Append(
                        RichElement("i", { dataset: { lucide: "check" }, className: "w-4 h-4" }),
                        span({ textContent: "Confirmar" })
                    )
                )
            )
        )
    );
}

// ==========================================
// 3. STATIC HELPERS
// ==========================================
export function EmptyState() {
    return p({ className: 'text-gray-400', textContent: 'Nenhum cliente selecionado.' });
}

export function DetailsContent(customer) {
    return div().Append(
        h2({ className: 'font-bold text-lg text-gray-900', textContent: customer.name }),
        p({ className: 'text-gray-600', textContent: `Endereço: ${customer.address || 'N/A'}` }),
        p({ className: 'mt-1 font-semibold text-gray-700', textContent: `NUIT: ${customer.nuit || 'N/A'}` }),
        p({ className: 'text-gray-600', textContent: `Tel: ${customer.phone || 'N/A'}` })
    );
}

// Network results remain slightly raw since they are dynamic arrays, but we keep the inline logic minimal
export function SearchItem(networkCustomer, onSelect) {
    return li({
        className: 'px-4 py-3 hover:bg-gray-50 cursor-pointer flex flex-col gap-0.5 border-b border-gray-100 last:border-0',
        onclick: () => onSelect(networkCustomer)
    }).Append(
        span({ className: 'font-medium text-sm text-gray-900', textContent: networkCustomer.name }),
        span({ className: 'text-xs text-gray-700 truncate', textContent: networkCustomer.address || 'Sem endereço' }),
        span({ className: 'text-xs text-blue-600 font-semibold uppercase', textContent: networkCustomer.nuit ? `NUIT: ${networkCustomer.nuit}` : 'Particular' })
    );
}

export function CloseDropdownItem(onClose) {
    return li({
        className: 'px-4 py-2 bg-gray-100 text-center cursor-pointer border-t border-gray-200 hover:bg-gray-200 transition-colors sticky bottom-0',
        onclick: onClose
    }).Append(
        span({ className: 'text-xs font-bold text-gray-500 uppercase tracking-wide', textContent: 'Fechar Sugestões' })
    );
}