import { div, span, header, h1, h2, h3, h4, p, button, select, option, input, a, RichElement } from "../vanilla-core/viewgencore.js";

export function QuotationsPageLayout(mainContent) {
    return div({ className: "bg-gray-50/50 min-h-screen flex flex-col text-gray-900" }).Append(
        mainContent
    );
}

// 1. Header Premium (Translucidez, Sombras suaves, Botão com Gradiente)
export function QuotationsHeader(events) {
    return header({ className: "mb-6 flex flex-col md:flex-row items-center gap-4 md:gap-8 sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm px-4 md:px-8 py-4 border-b border-gray-200/80 transition-all" }).Append(
        h1({ className: "text-2xl font-extrabold text-gray-900 tracking-tight shrink-0", textContent: "Cotações" }),
        div({ className: "flex-1 w-full max-w-4xl relative mx-auto flex flex-col md:flex-row gap-3" }).Append(
            div({ className: "relative flex-1 group" }).Append(
                span({ className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" }).Append(
                    RichElement("i", { dataset: { lucide: "search" }, className: "w-5 h-5" })
                ),
                input({
                    id: "quoteSearchInput", type: "text", placeholder: "Pesquisar por N°, Cliente, NUIT...",
                    oninput: events.onSearchInput,
                    className: "pl-11 pr-4 py-2.5 w-full border border-gray-200 bg-white rounded-xl shadow-sm hover:border-gray-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-gray-700 font-medium placeholder:font-normal"
                })
            ),
            div({ className: "flex-shrink-0 w-full md:w-52 relative" }).Append(
                select({
                    id: "statusFilter", onchange: events.onFilterChange,
                    className: "pl-4 pr-10 py-2.5 w-full border border-gray-200 bg-white rounded-xl shadow-sm hover:border-gray-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-gray-700 font-medium appearance-none cursor-pointer"
                }).Append(
                    option({ value: "", textContent: "Todos os Estados" }),
                    option({ value: "Pendente", textContent: "Pendente" }),
                    option({ value: "Aprovada", textContent: "Aprovada" }),
                    option({ value: "Expirada", textContent: "Expirada" }),
                    option({ value: "Rascunho", textContent: "Rascunho" }),
                    option({ value: "Cancelada", textContent: "Cancelada" })
                ),
                span({ className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" }).Append(
                    RichElement("i", { dataset: { lucide: "chevron-down" }, className: "w-4 h-4" })
                )
            )
        ),
        button({
            id: "showNewQuoteModal", onclick: () => console.log("ROUTER: Ir para Nova Cotação"),
            className: "flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-200 shrink-0 border border-blue-500"
        }).Append(
            RichElement("i", { dataset: { lucide: "plus" }, className: "w-5 h-5" }),
            span({ textContent: "Nova Cotação" })
        )
    );
}

// 2. Card de Cotação (Elevação, Arredondamento 2xl, Tipografia refinada)
export function QuoteCard(quoteVM, events) {
    const card = div({ className: "bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 flex flex-col relative group overflow-hidden" });

    // Link overlay
    if (quoteVM.isEditable) {
        card.Append(a({ href: quoteVM.editUrl, title: `Editar Cotação Nº ${quoteVM.number}`, className: "absolute inset-0 z-0 outline-none focus:ring-4 focus:ring-blue-500/20 rounded-2xl" }));
    }

    card.Append(
        // Header do Card
        div({ className: "p-5 border-b border-gray-50 flex justify-between items-start z-10 bg-white" }).Append(
            div({ className: "flex flex-col gap-1" }).Append(
                h3({ className: "text-xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight leading-none", textContent: `Nº ${quoteVM.number}` })
            ),
            span({ className: `status-badge ${quoteVM.badgeClass} shadow-sm border border-black/5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg`, textContent: quoteVM.status })
        ),
        
        // Corpo do Card
        div({ className: "p-5 flex-grow z-10 bg-white pointer-events-none" }).Append(
            h4({ className: "text-base font-bold text-gray-800 line-clamp-1 mb-1.5", title: quoteVM.customer, textContent: quoteVM.customer }),
            div({ className: "inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-100 rounded-md" }).Append(
                RichElement("i", { dataset: { lucide: "building-2" }, className: "w-3.5 h-3.5 text-gray-400" }),
                p({ className: "text-xs font-semibold text-gray-600 uppercase tracking-wide", textContent: `NUIT: ${quoteVM.nuit}` })
            ),
            
            // Datas com Ícones
            div({ className: "mt-5 space-y-2" }).Append(
                div({ className: "flex items-center gap-2 text-sm text-gray-500" }).Append(
                    RichElement("i", { dataset: { lucide: "calendar" }, className: "w-4 h-4 text-gray-400" }),
                    span({ textContent: "Emissão:" }), 
                    span({ className: "font-semibold text-gray-700", textContent: quoteVM.date })
                ),
                div({ className: `flex items-center gap-2 text-sm ${quoteVM.expiryColor}` }).Append(
                    RichElement("i", { dataset: { lucide: "clock" }, className: "w-4 h-4 opacity-70" }),
                    span({ className: "font-medium", textContent: quoteVM.expiryText })
                )
            )
        ),
        
        // Footer do Card
        div({ className: "px-5 py-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/50 z-10" }).Append(
            span({ className: "text-xl font-black text-gray-900 tracking-tight", textContent: quoteVM.formattedTotal }),
            div({ className: "flex items-center gap-2" }).Append(
                MainActionButton(quoteVM, events),
                KebabMenu(quoteVM, events)
            )
        )
    );
    return card;
}

function MainActionButton(quoteVM, events) {
    if (!quoteVM.isEditable) {
        return button({
            type: "button", title: "Renovar Cotação", onclick: (e) => { e.preventDefault(); e.stopPropagation(); events.onRenewQuote(quoteVM.id); },
            className: "relative z-20 flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl active:scale-95"
        }).Append(
            RichElement("i", { dataset: { lucide: "refresh-cw" }, className: "w-4 h-4" }),
            span({ textContent: "Renovar" })
        );
    }
    return a({
        href: quoteVM.editUrl, title: "Editar Cotação",
        className: "relative z-20 flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 rounded-xl shadow-sm active:scale-95"
    }).Append(
        RichElement("i", { dataset: { lucide: "pencil" }, className: "w-4 h-4" }),
        span({ textContent: "Editar" })
    );
}

function KebabMenu(quoteVM, events) {
    const hasItems = quoteVM.canBeDrafted || quoteVM.canBeCancelled || quoteVM.isDraft;
    if (!hasItems) return span();

    const menuItems = div({ className: "flex flex-col p-1", role: "none" });

    if (quoteVM.canBeDrafted) {
        menuItems.Append(ActionLink("save", "Guardar Rascunho", "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900", (e) => events.onCloneToDraft(e, quoteVM.id)));
    }
    if (quoteVM.canBeCancelled) {
        menuItems.Append(ActionLink("x-circle", "Cancelar", "text-red-600 hover:bg-red-50 hover:text-red-700", (e) => events.onCancelQuote(e, quoteVM.id)));
    }
    if (quoteVM.isDraft) {
        if (quoteVM.canBeDrafted || quoteVM.canBeCancelled) menuItems.Append(div({ className: "border-t border-gray-100 my-1 mx-2" }));
        menuItems.Append(ActionLink("trash-2", "Apagar Rascunho", "text-red-600 bg-red-50 hover:bg-red-100 font-bold", (e) => events.onDeleteDraft(e, quoteVM.id)));
    }

    return div({ className: "relative inline-block text-left z-20" }).Append(
        button({
            type: "button", id: `dropdown-toggle-${quoteVM.id}`,
            onclick: (e) => { e.preventDefault(); e.stopPropagation(); events.onToggleKebab(quoteVM.id); },
            className: "dropdown-toggle p-2 rounded-xl hover:bg-gray-200/70 text-gray-400 hover:text-gray-700 transition-colors active:bg-gray-300"
        }).Append(RichElement("i", { dataset: { lucide: "more-vertical" }, className: "w-5 h-5" })),

        div({
            id: `dropdown-menu-${quoteVM.id}`,
            className: "dropdown-menu hidden origin-top-right absolute right-0 bottom-full mb-2 w-52 rounded-2xl shadow-xl shadow-black/5 bg-white border border-gray-100 ring-1 ring-black/5 focus:outline-none"
        }).Append(menuItems)
    );
}

function ActionLink(icon, text, classes, onClick) {
    return button({
        type: "button",
        onclick: (e) => { e.preventDefault(); e.stopPropagation(); onClick(e); },
        className: `w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${classes}`
    }).Append(
        RichElement("i", { dataset: { lucide: icon }, className: "w-4 h-4 mr-3" }),
        span({ textContent: text })
    );
}

export function BottomLoader() {
    return div({ id: "bottomLoader", className: "py-10 flex justify-center items-center w-full hidden" }).Append(
        div({ className: "bg-white p-3 rounded-2xl shadow-sm border border-gray-100" }).Append(
            RichElement("i", { dataset: { lucide: "loader-2" }, className: "w-6 h-6 text-blue-600 animate-spin" })
        )
    );
}

export function EmptyStateGrid() {
    return div({ id: "noResults", className: "p-8 text-center w-full col-span-full" }).Append(
        div({ className: "flex flex-col items-center justify-center bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-3xl py-20 transition-all hover:bg-gray-50" }).Append(
            div({ className: "bg-white p-5 rounded-full shadow-sm border border-gray-100 mb-5" }).Append(
                RichElement("i", { dataset: { lucide: "folder-search" }, className: "w-10 h-10 text-gray-400" })
            ),
            h3({ className: "text-xl font-extrabold text-gray-800 tracking-tight", textContent: "Nenhuma Cotação Encontrada" }),
            p({ className: "text-gray-500 mt-2 font-medium max-w-md", textContent: "Tente ajustar os seus filtros de pesquisa ou limpe a caixa de texto para ver todos os resultados." })
        )
    );
}

export function ModalWidget(events) {
    return div({
        id: "modalOverlay",
        className: "modal-hidden fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 opacity-0 pointer-events-none transition-all duration-300"
    }).Append(
        div({
            id: "modalContainer",
            className: "bg-white w-full max-w-md rounded-3xl shadow-2xl p-7 transition-all duration-300 transform scale-95 opacity-0 border border-gray-100"
        }).Append(
            div({ className: "flex items-start justify-between" }).Append(
                h2({ id: "modalTitle", className: "text-2xl font-extrabold text-gray-900 tracking-tight" }),
                button({
                    type: "button",
                    id: "modalClose",
                    onclick: events.onCloseModal,
                    className: "text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors -mt-2 -mr-2"
                }).Append(
                    RichElement("i", { dataset: { lucide: "x" }, className: "w-5 h-5" })
                )
            ),
            p({ id: "modalMessage", className: "text-gray-600 mt-3 text-base leading-relaxed font-medium" }),

            div({ className: "flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100" }).Append(
                button({
                    type: "button",
                    id: "modalCancel",
                    onclick: events.onCloseModal,
                    className: "px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-colors active:scale-95",
                    textContent: "Cancelar"
                }),
                button({
                    type: "button",
                    id: "modalConfirm",
                    className: "px-5 py-2.5 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
                })
            )
        )
    );
}