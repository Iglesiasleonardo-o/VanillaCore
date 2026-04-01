import { button, div, header, Icon, img, input, span } from "../../../../vanilla-core/viewgencore.js";

// --- MODAL & LOADERS ---
export function ItemsModalWidget(events) {
    return div({
        id: "items-modal-overlay",
        className: "fixed inset-0 bg-gray-800/10 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50 no-print",
        onclick: events.onClose
    }).Append(
        div({
            className: "bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col overflow-hidden h-[85vh]",
            onclick: e => e.stopPropagation()
        }).Append(
            header({ className: "p-4 border-b border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10" }).Append(
                input({
                    id: "modal-search", type: "text", placeholder: "Pesquisar produtos por nome ou referência...", className: "flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:ring-blue-500 focus:border-blue-500",
                    oninput: events.onSearchInput,
                    onfocus: e => {
                        setTimeout(() => { e.target.select(); }, 0);
                    }
                }),
                button({
                    className: "text-gray-400 hover:text-gray-600",
                    onclick: events.onClose
                }).Append(
                    Icon("M6 18L18 6M6 6l12 12", "w-6 h-6")
                )
            ),
            div({ id: "modal-loading", className: "flex flex-col items-center justify-center py-12 space-y-4 bg-white w-full h-full" }).Append(
                div({ className: "animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-blue-600" }),
                span({ className: "text-sm text-gray-500 font-medium animate-pulse", textContent: "A carregar produtos..." })
            ),
            div({
                id: "items-list", className: "flex-1 overflow-y-auto bg-gray-50 relative"
            }),
            div({ className: "p-4 border-t border-gray-200 bg-white flex justify-end" }).Append(
                button({
                    className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors", textContent: "Concluir Seleção",
                    onclick: events.onClose
                })
            )
        )
    );
}

// THESE ARE USED AFTER INITIAL RENDER
export function ModalItem(isCartItem, item, viewData, events) {
    let addBtnVisibility, removeBtnVisibility;

    if (isCartItem) {
        addBtnVisibility = "hidden";
        removeBtnVisibility = "";
    } else {
        addBtnVisibility = "";
        removeBtnVisibility = "hidden";
    }

    return div({ className: "group flex flex-col sm:flex-row items-center justify-between p-3 border-b border-gray-100 transition-all hover:bg-gray-50" }).Append(
        div({ className: "flex items-center w-full sm:w-auto mb-3 sm:mb-0" }).Append(
            div({ className: "relative h-12 w-12 flex-shrink-0 mr-3" }).Append(
                img({ src: item.image || 'https://via.placeholder.com/150', className: "h-12 w-12 rounded-lg object-cover border border-gray-200 bg-white" })
            ),
            div().Append(
                div({ className: "font-medium text-gray-900 text-sm leading-tight mb-1", textContent: item.name }),
                div({ className: "flex items-center gap-2" }).Append(
                    span({ className: "text-xs font-bold text-gray-700 mt-0.5", textContent: viewData.unitPrice }),
                    span({ className: "text-xs text-gray-500 bg-gray-100/50 px-1 rounded", textContent: item.ref })
                )
            )
        ),
        div({ className: "flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto sm:justify-end" }).Append(
            // QTY
            div({ className: "flex flex-col items-center gap-0.5" }).Append(
                span({ className: "text-[9px] text-gray-400 uppercase tracking-wide", textContent: "Qtd" }),
                div({ className: "flex items-center border border-gray-200 rounded-md shadow-sm bg-white h-8" }).Append(
                    button({
                        className: "px-2 h-full text-gray-500 hover:text-blue-600 border-r border-gray-100", textContent: "−",
                        onclick: e => events.onQtyRemove(item)
                    }),
                    input({
                        id: `modal-qty-${item.ref}`,
                        type: "number", value: viewData.quantity, className: "w-16 text-center text-sm text-gray-700 border-none p-0 h-full",
                        onchange: e => events.onQtyChange(e, item)
                    }),
                    button({
                        className: "px-2 h-full text-gray-500 hover:text-blue-600 border-l border-gray-100", textContent: "+",
                        onclick: e => events.onQtyAdd(item)
                    })
                )
            ),
            // DISC
            div({ className: "flex flex-col items-center gap-0.5" }).Append(
                span({ className: "text-[9px] text-gray-400 uppercase tracking-wide", textContent: "Desc %" }),
                div({ className: "flex items-center border border-gray-200 rounded-md shadow-sm bg-white h-8" }).Append(
                    button({
                        className: "px-2 h-full text-gray-500 hover:text-blue-600 border-r border-gray-100", textContent: "−",
                        onclick: e => events.onDiscRemove(item)
                    }),
                    input({
                        id: `modal-disc-${item.ref}`,
                        type: "number", value: viewData.discount, className: "w-10 text-center text-sm text-gray-700 border-none p-0 h-full",
                        onchange: e => events.onDiscChange(e, item)
                    }),
                    button({
                        className: "px-2 h-full text-gray-500 hover:text-blue-600 border-l border-gray-100", textContent: "+",
                        onclick: e => events.onDiscAdd(item)
                    })
                )
            ),
            // TOTALS & STATUS
            div({ className: "flex flex-col items-end min-w-[70px]" }).Append(
                span({
                    id: `modal-total-line-${item.ref}`,
                    className: "text-xs font-bold text-blue-600 mt-1",
                    textContent: viewData.totalLine
                }),
                span({
                    id: `modal-item-status-${item.ref}`,
                    className: removeBtnVisibility + " text-[10px] text-blue-600 font-medium px-2 py-0.5 bg-blue-100 rounded mt-1",
                    textContent: "No Carrinho"
                })
            ),
            button({
                id: `modal-add-btn-${item.ref}`,
                className: addBtnVisibility + " bg-blue-600 text-white hover:bg-blue-700 mt-1 flex items-center justify-center w-8 h-8 rounded-lg transition-all shadow-sm ",
                onclick: () => events.onAddItem(item)
            }).Append(Icon("M12 4v16m8-8H4", "w-5 h-5")),
            button({
                id: `modal-remove-btn-${item.ref}`,
                className: removeBtnVisibility + " bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white mt-1 flex items-center justify-center w-8 h-8 rounded-lg transition-all shadow-sm ",
                onclick: () => events.onRemoveItem(item)
            }).Append(Icon("M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16", "w-5 h-5"))
        )
    );
}

export function BottomLoader() {
    return div({ id: "infinite-scroll-loader", className: "flex items-center justify-center py-4 w-full border-t border-gray-50 mt-2" }).Append(
        div({ className: "animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-blue-600 mr-2" }),
        span({ className: "text-xs text-gray-400", textContent: "A carregar mais produtos..." })
    );
}

export function EmptySearchState() {
    return div({ className: "p-8 text-center text-gray-400 italic", textContent: "Nenhum produto encontrado." });
}