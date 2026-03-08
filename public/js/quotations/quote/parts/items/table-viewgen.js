import { button, div, Icon, input, label, section, span, table, tbody, td, th, thead, tr } from "../../../../shared/viewgencore.js";

export function ItemsTableWidget(events, quoteItems, toQuoteRowViewModel) {
    const tableBody = tbody({
        id: "items-tbody",
        className: "divide-y divide-gray-100 bg-white"
    });

    if (quoteItems.length === 0) {
        tableBody.Append(EmptyTableState());
    } else {
        quoteItems.forEach(item => {
            tableBody.Append(QuoteRow(item, toQuoteRowViewModel(item), events.row));
        });
    }

    return section({ className: "mt-8" }).Append(
        div({ className: "mb-4 no-print" }).Append(
            button({
                className: "w-full py-3 bg-gray-50 text-blue-600 border border-dashed border-gray-300 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2",
                onclick: events.modal.onOpen
            }).Append(
                Icon("M12 4v16m8-8H4", "w-5 h-5"),
                span({ textContent: "Adicionar Produtos" })
            )
        ),
        div({ className: "border border-gray-200 rounded-lg bg-white" }).Append(
            table({ className: "min-w-full divide-y divide-gray-200" }).Append(
                thead({ className: "bg-gray-50" }).Append(
                    tr().Append(
                        th({ className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase", textContent: "Ref" }),
                        th({ className: "px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase", textContent: "Descrição" }),
                        th({ className: "px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-24", textContent: "Qtd" }),
                        th({ className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase", textContent: "Preço Unit." }),
                        th({ className: "px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-20", textContent: "Desc %" }),
                        th({ className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase", textContent: "Total" })
                    )
                ),
                tableBody
            )
        )
    );
}

export function QuoteRow(quoteItem, viewData, events) {
    const itemRef = quoteItem.ref;

    return tr({ className: "hover:bg-gray-50 transition-colors text-sm" }).Append(
        td({ className: "px-4 py-3 text-xs text-gray-500 align-middle", textContent: itemRef }),
        td({ className: "px-4 py-3 align-middle" }).Append(
            div({ className: "font-medium text-gray-900", textContent: quoteItem.name })
        ),
        // QTY STEPPER
        td({ className: "px-4 py-3 align-middle" }).Append(
            div({ className: "flex items-center border border-gray-200 rounded-md shadow-sm bg-white h-8 print:border-none print:shadow-none print:h-auto print:bg-transparent" }).Append(
                button({
                    className: "px-2 h-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors text-sm font-bold rounded-l-md border-r border-gray-100 print:hidden", textContent: "−",
                    onclick: e => events.onQtyRemove(quoteItem)
                }),
                input({
                    id: `qty-${itemRef}`, type: "number",
                    value: quoteItem.quantity, min: 0,
                    className: "w-16 text-center text-sm font-medium text-gray-700 border-none focus:ring-0 p-0 h-full appearance-none print:hidden",
                    onchange: e => events.onQtyChange(e, quoteItem)
                }),
                span({
                    id: `qty-print-${itemRef}`,
                    className: "hidden print:inline-block w-full text-center text-sm font-medium",
                    textContent: quoteItem.quantity
                }),
                button({
                    className: "px-2 h-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors text-sm font-bold rounded-r-md border-l border-gray-100 print:hidden", textContent: "+",
                    onclick: e => events.onQtyAdd(quoteItem)
                })
            )
        ),
        td({
            className: "px-4 py-3 text-right text-gray-600 align-middle",
            textContent: viewData.unitPrice
        }),
        // DISCOUNT STEPPER
        td({ className: "px-4 py-3 align-middle" }).Append(
            div({ className: "flex items-center border border-gray-200 rounded-md shadow-sm bg-white h-8 print:border-none print:shadow-none print:h-auto print:bg-transparent" }).Append(
                button({
                    className: "px-2 h-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors text-sm font-bold rounded-l-md border-r border-gray-100 print:hidden", textContent: "−",
                    onclick: e => events.onDiscRemove(e, quoteItem)
                }),
                input({
                    id: `disc-${itemRef}`,
                    type: "number", value: quoteItem.discount, min: 0, max: 100, className: "w-10 text-center text-sm font-medium text-gray-700 border-none focus:ring-0 p-0 h-full appearance-none print:hidden",
                    onchange: e => events.onDiscChange(e, quoteItem)
                }),
                span({
                    id: `disc-print-${itemRef}`,
                    className: "hidden print:inline-block w-full text-center text-sm font-medium",
                    textContent: quoteItem.discount
                }),
                button({
                    className: "px-2 h-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors text-sm font-bold rounded-r-md border-l border-gray-100 print:hidden", textContent: "+",
                    onclick: e => events.onDiscAdd(e, quoteItem)
                })
            )
        ),
        td({ className: "px-4 py-3 text-right align-middle" }).Append(
            div({ className: "flex items-center justify-end gap-3" }).Append(
                span({
                    id: `total-line-${itemRef}`,
                    className: "font-bold text-gray-900", textContent: viewData.totalLine
                }),
                button({
                    className: "flex items-center justify-center w-7 h-7 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all no-print",
                    onclick: () => events.onRemove(quoteItem)
                }).Append(Icon("M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16", "w-4 h-4"))
            )
        )
    );
}


export function TotalsWidget(events, viewModel) {
    return div({ className: "w-1/2 max-w-xs text-sm" }).Append(
        div({ className: "space-y-2" }).Append(
            div({ className: "flex items-center justify-between border-b border-gray-200 pb-2 mb-2 no-print" }).Append(
                div({ className: "flex items-center gap-2" }).Append(
                    input({
                        type: "checkbox", id: "toggleGlobalDiscount", className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500",
                        onchange: events.onToggleGlobalDiscount
                    }),
                    label({ htmlFor: "toggleGlobalDiscount", className: "text-xs font-medium text-gray-600 select-none cursor-pointer", textContent: "Desconto Global" })
                ),
                div({ className: "flex items-center gap-1" }).Append(
                    input({
                        type: "number", id: "globalDiscountInput", placeholder: "0", min: "0", max: "100", disabled: true, className: "w-12 text-right text-xs border border-gray-300 rounded py-0.5 px-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400",
                        onchange: events.onGlobalDiscountInput
                    }),
                    span({ className: "text-xs text-gray-500", textContent: "%" })
                )
            ),
            div({ className: "flex justify-between" }).Append(
                span({ className: "text-gray-600", textContent: "Subtotal:" }),
                div().Append(span({
                    id: "lblSubtotal",
                    className: "font-medium text-gray-800", textContent: viewModel.subtotal
                }))
            ),
            div({ className: "flex justify-between" }).Append(
                span({ className: "text-gray-600", textContent: "IVA (16%):" }),
                div().Append(span({
                    id: "lblVat",
                    className: "font-medium text-gray-800", textContent: viewModel.taxTotal
                }))
            ),

            div({ className: "flex justify-between border-t border-gray-300 pt-2 mt-2" }).Append(
                span({ className: "font-bold text-lg text-gray-900", textContent: "Total:" }),
                div().Append(span({
                    id: "lblTotal",
                    className: "font-bold text-lg text-blue-600", textContent: viewModel.grandTotal
                }))
            )
        )
    );
}

export function EmptyTableState() {
    return tr().Append(
        td({
            colSpan: "6", className: "text-center py-12 text-gray-400 italic",
            textContent: "Nenhum produto adicionado à cotação."
        })
    );
}
