import { button, div, footer, form, h1, h2, h3, header, input, label, p, RichElement, section, span, textarea, ul, li } from "../../../../shared/viewgencore.js";

// ==========================================
// 1. MAIN UI WIDGET
// ==========================================
export function createCustomerSection(quotationNumber, events) {
    const views = {};

    const root = div({ className: "flex justify-between items-end" }).Append(
        createCustomerSearchSection(events, views),

        // Static Title Block
        div({ className: "flex flex-col items-end text-right flex-shrink-0 ml-8" }).Append(
            h1({ className: "text-3xl font-bold text-gray-900 -mb-1", textContent: "COTAÇÃO" }),
            p({ id: "quoteNumber", className: "text-lg font-semibold text-blue-600", textContent: `Nº ${quotationNumber}` })
        )
    );

    return { root, views };
}

function createCustomerSearchSection(events, views) {
    return section({ className: "pt-1 border-t border-gray-300 w-1/2" }).Append(
        h3({ className: "text-sm font-bold text-gray-500 uppercase tracking-wide", textContent: "Cliente" }),
        div({ className: "w-full no-print" }).Append(
            div({ className: "relative mb-2" }).Append(
                (views.searchInput = input({
                    type: "text",
                    placeholder: "-- Clique para selecionar ou criar cliente --",
                    className: "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                    readonly: true,
                    onclick: events.onOpenModal
                })),
                (views.clearBtn = button({
                    className: "absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 hidden",
                    onclick: events.onClearCustomer
                }).Append(
                    RichElement("i", { dataset: { lucide: "x-circle" }, className: "w-5 h-5" })
                ))
            )
        ),
        (views.detailsContainer = div({ className: "border-l border-gray-200 pl-2 text-xs text-gray-700 min-h-[100px]" }).Append(
            createEmptyState()
        ))
    );
}

// ==========================================
// 2. MODAL FORM UI
// ==========================================
export function createCustomerModal(events) {
    const views = {};

    const root = (views.modalOverlay = div({
        id: "customerSelectionModal",
        className: "fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50 no-print",
        onclick: events.onCloseModal // UX: Click dark background to close
    }).Append(
        div({
            className: "modal-panel bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]",
            onclick: (e) => e.stopPropagation() // Prevent clicks inside from bubbling to overlay
        }).Append(

            // Header
            header({ className: "p-4 border-b border-gray-200 flex items-center justify-between bg-white sticky top-0 z-10" }).Append(
                h2({ className: "text-xl font-bold text-gray-800", textContent: "Selecionar ou Criar Cliente" }),
                button({
                    id: "closeCustomerModalButton",
                    type: "button",
                    className: "text-gray-400 hover:text-gray-600 transition-colors",
                    onclick: events.onCloseModal
                }).Append(
                    RichElement("i", { dataset: { lucide: "x" }, className: "w-6 h-6" })
                )
            ),

            // Form
            form({
                id: "customerForm",
                className: "flex flex-col flex-grow overflow-hidden",
                onsubmit: events.onSaveModal
            }).Append(
                // Body
                div({ className: "p-6 overflow-y-auto space-y-5 flex-grow" }).Append(

                    // Name Field
                    div({ className: "relative group" }).Append(
                        label({ htmlFor: "inputCustomerName", className: "block text-sm font-medium text-gray-700" }).Append(
                            span({ textContent: "Nome do Cliente " }),
                            span({ className: "text-red-500", textContent: "*" })
                        ),
                        div({ className: "relative mt-1" }).Append(
                            (views.inName = input({
                                type: "text",
                                id: "inputCustomerName",
                                autocomplete: "off",
                                required: true,
                                className: "capitalize block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 transition-colors",
                                placeholder: "Digite o nome para pesquisar ou criar...",
                                oninput: events.onNameInput,
                                onfocus: (e) => e.target.select() // UX: Auto-select text
                            })),
                            (views.loadingName = div({
                                id: "loadingName",
                                className: "absolute right-3 top-1/2 -translate-y-1/2 hidden"
                            }).Append(
                                div({ className: "animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-b-blue-600" })
                            ))
                        ),
                        (views.resNameContainer = ul({
                            id: "resultsName",
                            className: "hidden absolute z-20 w-full bg-white shadow-lg max-h-48 rounded-md border border-gray-200 overflow-y-auto mt-1 divide-y divide-gray-100"
                        }))
                    ),

                    // Entity Toggle
                    div({
                        id: "containerToggleEntity",
                        className: "flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer",
                        onclick: events.onToggleEntity
                    }).Append(
                        span({ className: "text-sm font-medium text-gray-700 select-none", textContent: "O cliente é uma Entidade/Empresa?" }),
                        label({ className: "relative inline-flex items-center cursor-pointer" }).Append(
                            (views.toggleEntity = input({
                                type: "checkbox",
                                id: "toggleIsEntity",
                                className: "sr-only peer"
                            })),
                            div({ className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })
                        )
                    ),

                    // NUIT & Phone Grid
                    div({ className: "grid grid-cols-1 md:grid-cols-2 gap-4" }).Append(
                        // NUIT
                        div({ className: "relative" }).Append(
                            label({ htmlFor: "inputCustomerNuit", className: "block text-sm font-medium text-gray-700" }).Append(
                                span({ textContent: "NUIT " }),
                                (views.labelNuitRequired = span({ id: "labelNuitRequired", className: "text-red-500 hidden", textContent: "*" }))
                            ),
                            div({ className: "relative mt-1" }).Append(
                                (views.inNuit = input({
                                    type: "number",
                                    min: "1000000",
                                    max: "100000000000",
                                    id: "inputCustomerNuit",
                                    autocomplete: "off",
                                    className: "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500",
                                    placeholder: "Digite o NUIT para pesquisar...",
                                    oninput: events.onNuitInput,
                                    onfocus: (e) => e.target.select() // UX: Auto-select text
                                })),
                                (views.loadingNuit = div({
                                    id: "loadingNuit",
                                    className: "absolute right-3 top-1/2 -translate-y-1/2 hidden"
                                }).Append(
                                    div({ className: "animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-b-blue-600" })
                                ))
                            ),
                            (views.resNuitContainer = ul({
                                id: "resultsNuit",
                                className: "hidden absolute z-20 w-full bg-white shadow-lg max-h-48 rounded-md border border-gray-200 overflow-y-auto mt-1 divide-y divide-gray-100"
                            }))
                        ),
                        // Phone
                        div().Append(
                            label({ htmlFor: "inputCustomerPhone", className: "block text-sm font-medium text-gray-700", textContent: "Telefone" }),
                            (views.inPhone = input({
                                type: "text",
                                id: "inputCustomerPhone",
                                className: "capitalize mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500",
                                oninput: events.onPhoneInput,
                                onfocus: (e) => e.target.select() // UX: Auto-select text
                            }))
                        )
                    ),

                    // Address
                    div().Append(
                        label({ htmlFor: "inputCustomerAddress", className: "block text-sm font-medium text-gray-700" }).Append(
                            span({ textContent: "Endereço " }),
                            span({ className: "text-red-500", textContent: "*" })
                        ),
                        (views.inAddr = textarea({
                            id: "inputCustomerAddress",
                            rows: "2",
                            required: true,
                            className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500",
                            oninput: events.onAddrInput,
                            onfocus: (e) => e.target.select() // UX: Auto-select text
                        }))
                    )
                ),

                // Footer Actions
                footer({ className: "p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 mt-auto" }).Append(
                    button({
                        id: "btnCancelCustomer",
                        type: "button",
                        className: "px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors",
                        textContent: "Cancelar",
                        onclick: events.onCancelModal
                    }),
                    button({
                        id: "btnConfirmCustomer",
                        type: "submit",
                        className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm font-medium text-sm transition-colors flex items-center gap-2"
                    }).Append(
                        RichElement("i", { dataset: { lucide: "check" }, className: "w-4 h-4" }),
                        span({ textContent: "Confirmar" })
                    )
                )
            )
        )
    ));

    return { root, views };
}

// ==========================================
// 3. STATIC HELPERS
// ==========================================
export function createEmptyState() {
    return p({ className: 'text-gray-400', textContent: 'Nenhum cliente selecionado.' });
}

export function createDetailsContent(customerState) {
    return div().Append(
        h2({ className: 'font-bold text-lg text-gray-900', textContent: customerState.name }),
        p({ className: 'text-gray-600', textContent: customerState.address || 'Sem endereço' }),
        p({ className: 'mt-1 font-semibold text-gray-700', textContent: `NUIT: ${customerState.nuit || 'N/A'}` }),
        p({ className: 'text-gray-600', textContent: `Tel: ${customerState.phone || 'N/A'}` })
    );
}

export function createSearchItem(customer, onSelect) {
    return li({
        className: 'px-4 py-3 hover:bg-gray-50 cursor-pointer flex flex-col gap-0.5 border-b border-gray-100 last:border-0',
        onclick: () => onSelect(customer)
    }).Append(
        span({ className: 'font-medium text-sm text-gray-900', textContent: customer.name }),
        span({ className: 'text-xs text-gray-700 truncate', textContent: customer.address || 'Sem endereço' }),
        span({ className: 'text-xs text-blue-600 font-semibold uppercase', textContent: customer.nuit ? `NUIT: ${customer.nuit}` : 'Particular' })
    );
}

export function createCloseDropdownItem(onClose) {
    return li({
        className: 'px-4 py-2 bg-gray-100 text-center cursor-pointer border-t border-gray-200 hover:bg-gray-200 transition-colors sticky bottom-0',
        onclick: onClose
    }).Append(
        span({ className: 'text-xs font-bold text-gray-500 uppercase tracking-wide', textContent: 'Fechar Sugestões' })
    );
}