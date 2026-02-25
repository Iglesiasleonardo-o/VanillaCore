import { button, div, h3, header, input, label, p, section, span, table, tbody, td, th, thead, tr, img, RichElement } from "../../../../shared/viewgencore.js";

const NUMBER = new Intl.NumberFormat('pt-MZ', { minimumFractionDigits: 2 });

// --- WIDGET 1: THE TABLE ---
export function ItemsTableWidget(events) {
    const views = {};

    const root = section({ className: "mt-8" }).Append(
        // Full width Add button, no title needed
        div({ className: "mb-4 no-print" }).Append(
            button({
                className: "w-full py-3 bg-gray-50 text-blue-600 border border-dashed border-gray-300 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2",
                onclick: events.onOpenModal
            }).Append(
                RichElement("i", { dataset: { lucide: "plus" }, className: "w-5 h-5" }),
                span({ textContent: "Adicionar Produtos" })
            )
        ),

        // The Table
        div({ className: "overflow-x-auto border border-gray-200 rounded-lg bg-white" }).Append(
            table({ className: "min-w-full divide-y divide-gray-200" }).Append(
                thead({ className: "bg-gray-50" }).Append(
                    tr().Append(
                        th({ className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase", textContent: "Ref" }),
                        th({ className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase", textContent: "Descrição" }),
                        th({ className: "px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-24", textContent: "Qtd" }),
                        th({ className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase", textContent: "Preço (MZN)" }),
                        th({ className: "px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-20", textContent: "Desc %" }),
                        th({ className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase", textContent: "Total" })
                    )
                ),
                (views.tbody = tbody({ className: "divide-y divide-gray-100 bg-white" }))
            )
        )
    );

    return { root, views };
}

// --- WIDGET 2: THE TOTALS ---
export function TotalsWidget(events) {
    const views = {};

    const root = div({ className: "w-1/2 max-w-xs text-sm" }).Append(
        div({ className: "space-y-2" }).Append(
            div({ className: "flex items-center justify-between border-b border-gray-200 pb-2 mb-2 no-print" }).Append(
                div({ className: "flex items-center gap-2" }).Append(
                    (views.toggleGlobalDiscount = input({
                        type: "checkbox", id: "toggleGlobalDiscount",
                        className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500",
                        onchange: events.onToggleGlobalDiscount
                    })),
                    label({ htmlFor: "toggleGlobalDiscount", className: "text-xs font-medium text-gray-600 select-none cursor-pointer", textContent: "Desconto Global" })
                ),
                div({ className: "flex items-center gap-1" }).Append(
                    (views.globalDiscountInput = input({
                        type: "number", id: "globalDiscountInput", placeholder: "0", min: "0", max: "100", disabled: true,
                        className: "w-12 text-right text-xs border border-gray-300 rounded py-0.5 px-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400",
                        oninput: events.onGlobalDiscountInput
                    })),
                    span({ className: "text-xs text-gray-500", textContent: "%" })
                )
            ),
            div({ className: "flex justify-between" }).Append(
                span({ className: "text-gray-600", textContent: "Subtotal:" }),
                div().Append((views.lblSubtotal = span({ className: "font-medium text-gray-800", textContent: "0,00" })))
            ),
            div({ className: "flex justify-between" }).Append(
                span({ className: "text-gray-600", textContent: "IVA (16%):" }),
                div().Append((views.lblVat = span({ className: "font-medium text-gray-800", textContent: "0,00" })))
            ),
            div({ className: "flex justify-between border-t border-gray-300 pt-2 mt-2" }).Append(
                span({ className: "font-bold text-lg text-gray-900", textContent: "Total:" }),
                div().Append((views.lblTotal = span({ className: "font-bold text-lg text-blue-600", textContent: "0,00" })))
            )
        )
    );

    return { root, views };
}

// --- COMPONENTS ---
export function QuoteRow(item, index, events) {
    const totalVal = (item.unitPrice * item.quantity) * (1 - ((item.discount || 0) / 100));

    return tr({ className: "hover:bg-gray-50 transition-colors text-sm" }).Append(
        td({ className: "px-4 py-3 text-xs text-gray-500 align-middle", textContent: item.ref }),
        td({ className: "px-4 py-3 align-middle" }).Append(
            div({ className: "font-medium text-gray-900", textContent: item.name })
        ),
        td({ className: "px-4 py-3 align-middle" }).Append(
            Stepper(item.quantity, (v) => events.onUpdateRowQty(index, v), "w-16")
        ),
        td({ className: "px-4 py-3 text-right text-gray-600 align-middle", textContent: NUMBER.format(item.unitPrice) }),
        td({ className: "px-4 py-3 align-middle" }).Append(
            Stepper(item.discount || 0, (v) => events.onUpdateRowDisc(index, v), "w-10")
        ),
        td({ className: "px-4 py-3 text-right align-middle" }).Append(
            div({ className: "flex items-center justify-end gap-3" }).Append(
                span({ className: "font-bold text-gray-900", textContent: NUMBER.format(totalVal) }),
                button({
                    className: "text-gray-400 hover:text-red-500 no-print",
                    onclick: () => events.onRemoveRow(index)
                }).Append(
                    RichElement("i", { dataset: { lucide: "trash-2" }, className: "w-4 h-4" })
                )
            )
        )
    );
}

export function ProductSearchItem(dbProduct, isAlreadyAdded, events) {
    return div({
        className: `p-4 border-b border-gray-100 flex justify-between items-center transition-colors cursor-pointer ${isAlreadyAdded ? 'bg-blue-50' : 'hover:bg-gray-50'}`,
        onclick: () => events.onProductSelect(dbProduct)
    }).Append(
        div().Append(
            div({ className: "font-medium text-gray-900", textContent: dbProduct.name }),
            div({ className: "text-xs text-gray-500", textContent: `Ref: ${dbProduct.ref}` })
        ),
        div({ className: "text-right flex flex-col items-end" }).Append(
            div({ className: "font-bold text-gray-900", textContent: NUMBER.format(dbProduct.price) }),
            isAlreadyAdded ? span({ className: "text-xs text-blue-600 font-medium mt-1", textContent: "No Carrinho" }) : ""
        )
    );
}

export function EmptyTableState() {
    return tr().Append(td({ colSpan: "6", className: "text-center py-12 text-gray-400 italic", textContent: "Nenhum produto adicionado." }));
}

export function Stepper(initialValue, onChange, widthClass) {
    const wrapper = div({ className: "flex items-center border border-gray-200 rounded-md bg-white h-8 print:border-none" });
    const btnClass = "px-2 h-full text-gray-500 hover:bg-gray-100 transition-colors print:hidden";

    const inputEl = input({
        type: "number", value: initialValue,
        className: `${widthClass} text-center text-sm font-medium border-none p-0 h-full print:hidden`,
        onchange: (e) => onChange(e.target.value)
    });

    wrapper.Append(
        button({ className: `${btnClass} border-r`, textContent: "−", onclick: () => { inputEl.value--; onChange(inputEl.value); } }),
        inputEl,
        span({ className: "hidden print:inline-block w-full text-center text-sm font-medium", textContent: initialValue }),
        button({ className: `${btnClass} border-l`, textContent: "+", onclick: () => { inputEl.value++; onChange(inputEl.value); } })
    );

    return wrapper;
}

// (ItemsModal stays mostly the same, renamed to ItemsModal)
export function ItemsModal(events) {
    const views = {};
    const root = (views.modalOverlay = div({
        className: "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50 no-print",
        onclick: events.onCloseModal
    }).Append(
        div({
            className: "bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col overflow-hidden h-[85vh]",
            onclick: e => e.stopPropagation()
        }).Append(
            header({ className: "p-4 border-b border-gray-200 flex items-center gap-4 bg-white sticky top-0" }).Append(
                (views.searchInput = input({
                    type: "text", placeholder: "Pesquisar produtos por nome ou referência...",
                    className: "flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:ring-blue-500 focus:border-blue-500",
                    oninput: events.onSearchInput
                })),
                button({ className: "text-gray-400 hover:text-gray-600", onclick: events.onCloseModal }).Append(
                    RichElement("i", { dataset: { lucide: "x" }, className: "w-6 h-6" })
                )
            ),
            (views.listContainer = div({ className: "flex-1 overflow-y-auto bg-gray-50 relative", onscroll: events.onSearchScroll })),
            div({ className: "p-4 border-t border-gray-200 bg-white flex justify-end" }).Append(
                button({
                    className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors",
                    textContent: "Concluir Seleção",
                    onclick: events.onCloseModal
                })
            )
        )
    ));
    return { root, views };
}