import { button, div, header, input, label, span, table, tbody, td, th, thead, tr, img, section, RichElement } from "../../../../shared/viewgencore.js";

const TRASH_ICON = "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16";
const PLUS_ICON = "M12 4v16m8-8H4";
const CLOSE_ICON = "M6 18L18 6M6 6l12 12";

export function createIcon(pathData, className) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", className);
    svg.setAttribute("fill", "none");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
    return svg;
}

// --- WIDGETS PRINCIPAIS ---
export function ItemsTableWidget(events) {
    const views = {};
    const btnAdd = button({
        className: "w-full py-3 bg-gray-50 text-blue-600 border border-dashed border-gray-300 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2",
        onclick: events.onOpenModal
    });
    btnAdd.appendChild(createIcon(PLUS_ICON, "w-5 h-5"));
    btnAdd.appendChild(span({ textContent: "Adicionar Produtos" }));

    const root = section({ className: "mt-8" }).Append(
        div({ className: "mb-4 no-print" }).Append(btnAdd),
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
                (views.tbody = tbody({ className: "divide-y divide-gray-100 bg-white" }))
            )
        )
    );
    return { root, views };
}

export function TotalsWidget(events) {
    const views = {};
    const root = div({ className: "w-1/2 max-w-xs text-sm" }).Append(
        div({ className: "space-y-2" }).Append(
            div({ className: "flex items-center justify-between border-b border-gray-200 pb-2 mb-2 no-print" }).Append(
                div({ className: "flex items-center gap-2" }).Append(
                    (views.toggleGlobalDiscount = input({ type: "checkbox", id: "toggleGlobalDiscount", className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500", onchange: events.onToggleGlobalDiscount })),
                    label({ htmlFor: "toggleGlobalDiscount", className: "text-xs font-medium text-gray-600 select-none cursor-pointer", textContent: "Desconto Global" })
                ),
                div({ className: "flex items-center gap-1" }).Append(
                    (views.globalDiscountInput = input({ type: "number", id: "globalDiscountInput", placeholder: "0", min: "0", max: "100", disabled: true, className: "w-12 text-right text-xs border border-gray-300 rounded py-0.5 px-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400", oninput: events.onGlobalDiscountInput })),
                    span({ className: "text-xs text-gray-500", textContent: "%" })
                )
            ),
            div({ className: "flex justify-between" }).Append(span({ className: "text-gray-600", textContent: "Subtotal:" }), div().Append((views.lblSubtotal = span({ className: "font-medium text-gray-800", textContent: "0,00" })))),
            div({ className: "flex justify-between" }).Append(span({ className: "text-gray-600", textContent: "IVA (16%):" }), div().Append((views.lblVat = span({ className: "font-medium text-gray-800", textContent: "0,00" })))),
            div({ className: "flex justify-between border-t border-gray-300 pt-2 mt-2" }).Append(span({ className: "font-bold text-lg text-gray-900", textContent: "Total:" }), div().Append((views.lblTotal = span({ className: "font-bold text-lg text-blue-600", textContent: "0,00" }))))
        )
    );
    return { root, views };
}

// --- SUBCONENTES BASE ---
function createStepperViews(widthClass) {
    const views = {};
    views.input = input({ type: "number", className: `${widthClass} text-center text-sm font-medium text-gray-700 border-none focus:ring-0 p-0 h-full appearance-none print:hidden` });
    views.print = span({ className: "hidden print:inline-block w-full text-center text-sm font-medium" });
    views.btnMinus = button({ className: "px-2 h-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors text-sm font-bold rounded-l-md border-r border-gray-100 print:hidden", textContent: "−" });
    views.btnPlus = button({ className: "px-2 h-full text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors text-sm font-bold rounded-r-md border-l border-gray-100 print:hidden", textContent: "+" });

    const root = div({ className: "flex items-center border border-gray-200 rounded-md shadow-sm bg-white h-8 print:border-none print:shadow-none print:h-auto print:bg-transparent" })
        .Append(views.btnMinus, views.input, views.print, views.btnPlus);
    return { root, views };
}

// --- COMPONENTES DE LINHA ---
export function QuoteRow(item, formattedUnitPrice) {
    const views = {};
    const qtyStepper = createStepperViews("w-16");
    const discStepper = createStepperViews("w-10");
    views.qty = qtyStepper.views;
    views.disc = discStepper.views;
    views.lblTotal = span({ className: "font-bold text-gray-900" });
    views.btnRemove = button({ className: "flex items-center justify-center w-7 h-7 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all no-print" });
    views.btnRemove.appendChild(createIcon(TRASH_ICON, "w-4 h-4"));

    const root = tr({ className: "hover:bg-gray-50 transition-colors text-sm" }).Append(
        td({ className: "px-4 py-3 text-xs text-gray-500 align-middle", textContent: item.ref }),
        td({ className: "px-4 py-3 align-middle" }).Append(div({ className: "font-medium text-gray-900", textContent: item.name })),
        td({ className: "px-4 py-3 align-middle" }).Append(qtyStepper.root),
        td({ className: "px-4 py-3 text-right text-gray-600 align-middle", textContent: formattedUnitPrice }),
        td({ className: "px-4 py-3 align-middle" }).Append(discStepper.root),
        td({ className: "px-4 py-3 text-right align-middle" }).Append(div({ className: "flex items-center justify-end gap-3" }).Append(views.lblTotal, views.btnRemove))
    );

    root.dataset.ref = item.ref;
    return { root, views };
}

export function ProductSearchItem(dbProduct) {
    const views = {};
    const qtyStepper = createStepperViews("w-16");
    const discStepper = createStepperViews("w-10");
    views.qty = qtyStepper.views;
    views.disc = discStepper.views;
    views.lblTotal = span({ className: "text-xs font-bold text-blue-600 mt-1" });
    views.lblStatus = span({ className: "text-[10px] text-blue-600 font-medium px-2 py-0.5 bg-blue-100 rounded mt-1 hidden" });
    views.btnAction = button({});

    const root = div({ className: "group flex flex-col sm:flex-row items-center justify-between p-3 border-b border-gray-100 transition-all hover:bg-gray-50" }).Append(
        div({ className: "flex items-center w-full sm:w-auto mb-3 sm:mb-0" }).Append(
            div({ className: "relative h-12 w-12 flex-shrink-0 mr-3" }).Append(
                img({ src: dbProduct.image || 'https://via.placeholder.com/150', className: "h-12 w-12 rounded-lg object-cover border border-gray-200 bg-white" })
            ),
            div().Append(
                div({ className: "font-medium text-gray-900 text-sm leading-tight mb-1", textContent: dbProduct.name }),
                div({ className: "flex items-center gap-2" }).Append(
                    span({ className: "text-xs font-bold text-gray-700 mt-0.5", textContent: new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(dbProduct.unitPrice) }),
                    span({ className: "text-xs text-gray-500 bg-gray-100/50 px-1 rounded", textContent: dbProduct.ref })
                )
            )
        ),
        div({ className: "flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto sm:justify-end" }).Append(
            div({ className: "flex flex-col items-center gap-0.5" }).Append(span({ className: "text-[9px] text-gray-400 uppercase tracking-wide", textContent: "Qtd" }), qtyStepper.root),
            div({ className: "flex flex-col items-center gap-0.5" }).Append(span({ className: "text-[9px] text-gray-400 uppercase tracking-wide", textContent: "Desc %" }), discStepper.root),
            div({ className: "flex flex-col items-end min-w-[70px]" }).Append(views.lblTotal, views.lblStatus),
            views.btnAction
        )
    );

    root.dataset.ref = dbProduct.ref;
    return { root, views };
}

// --- MODAL & LOADERS ---
export function ItemsModal(events) {
    const views = {};
    const btnClose = button({ className: "text-gray-400 hover:text-gray-600", onclick: events.onCloseModal });
    btnClose.appendChild(createIcon(CLOSE_ICON, "w-6 h-6"));

    // O fundo preto foi removido conforme solicitado (usando apenas o backdrop e uma cor de fundo muito leve caso o browser não suporte blur)
    const root = (views.modalOverlay = div({
        className: "fixed inset-0 bg-gray-800/10 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50 no-print",
        onclick: events.onCloseModal
    }).Append(
        div({
            className: "bg-white w-full max-w-4xl rounded-xl shadow-2xl flex flex-col overflow-hidden h-[85vh]",
            onclick: e => e.stopPropagation()
        }).Append(
            header({ className: "p-4 border-b border-gray-200 flex items-center gap-4 bg-white sticky top-0 z-10" }).Append(
                (views.searchInput = input({ type: "text", placeholder: "Pesquisar produtos por nome ou referência...", className: "flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:ring-blue-500 focus:border-blue-500", oninput: events.onSearchInput })),
                btnClose
            ),
            (views.listContainer = div({ className: "flex-1 overflow-y-auto bg-gray-50 relative", onscroll: events.onSearchScroll })),
            div({ className: "p-4 border-t border-gray-200 bg-white flex justify-end" }).Append(
                button({ className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors", textContent: "Concluir Seleção", onclick: events.onCloseModal })
            )
        )
    ));
    return { root, views };
}

export function LoadingState() {
    return div({ className: "flex flex-col items-center justify-center py-12 space-y-4 bg-white w-full h-full" }).Append(
        div({ className: "animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-blue-600" }),
        span({ className: "text-sm text-gray-500 font-medium animate-pulse", textContent: "A procurar produtos..." })
    );
}

export function BottomLoader() {
    return div({ id: "infinite-scroll-loader", className: "flex items-center justify-center py-4 w-full border-t border-gray-50 mt-2" }).Append(
        div({ className: "animate-spin rounded-full h-5 w-5 border-2 border-gray-200 border-t-blue-600 mr-2" }),
        span({ className: "text-xs text-gray-400", textContent: "Carregando mais..." })
    );
}

export function EmptyTableState() {
    return tr().Append(td({ colSpan: "6", className: "text-center py-12 text-gray-400 italic", textContent: "Nenhum produto adicionado à cotação." }));
}

export function EmptySearchState(msg = "Nenhum produto encontrado.") {
    return div({ className: "p-8 text-center text-gray-400 italic", textContent: msg });
}