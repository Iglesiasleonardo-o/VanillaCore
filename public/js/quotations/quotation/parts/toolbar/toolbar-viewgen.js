import { a, button, div, h1, header, RichElement, span } from "../../../../vanilla-core/viewgencore.js";

export function NavigationHeader(quotationNumber, events) {
    return header({
        id: "mainHeader",
        // Estilo unificado: Branco, com sombra, sticky e bordas arredondadas em baixo
        className: "sticky no-print top-0 z-30 bg-white border-b border-gray-200 px-4 md:px-8 py-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4"
    }).Append(
        BackLink(),
        PageTitle(quotationNumber),
        ActionToolbar(events),
        PrintFAB(events)
    );
}

function BackLink() {
    return a({
        href: "/quotations",
        className: "group flex items-center gap-3 text-md font-bold text-gray-400 hover:text-blue-600 transition-all duration-300"
    }).Append(
        div({ className: "p-2 rounded-xl group-hover:bg-blue-50 border border-transparent group-hover:border-blue-100 transition-all" }).Append(
            RichElement("i", { dataset: { lucide: "arrow-left" }, className: "w-5 h-5" })
        ),
        span({ className: "hidden lg:inline", textContent: "VOLTAR À LISTA" })
    );
}

function PageTitle(quotationNumber) {
    return div({
        className: "absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2"
    }).Append(
        h1({
            className: "text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2",
        }).Append(
            span({ textContent: "Cotação" }),
            span({ className: "text-blue-600", textContent: `#${quotationNumber}` })
        )
    );
}

function ActionToolbar(events) {
    return div({ className: "md:flex-1 flex items-center justify-end gap-3" }).Append(
        // Botão Imprimir (Estilo Secundário/Branco)
        button({
            id: "printButton",
            className: " flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-95",
            onclick: events.onPrintClick
        }).Append(
            RichElement("i", { dataset: { lucide: "printer" }, className: "w-5 h-5 text-gray-400" }),
            span({ textContent: "Imprimir" })
        ),

        // Botão Guardar (Estilo Primário/Azul)
        button({
            id: "saveQuoteButton",
            className: " flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95",
            onclick: events.onSaveClick
        }).Append(
            RichElement("i", { dataset: { lucide: "save" }, className: "w-5 h-5" }),
            span({ id: "saveButtonText", textContent: "Guardar" })
        ),

        OptionsDropdown(events)
    );
}

function OptionsDropdown(events) {
    return div({ className: "dropdown relative  group" }).Append(
        button({
            className: "p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all focus:outline-none",
            onclick: events.onToggleDropdown
        }).Append(
            RichElement("i", { dataset: { lucide: "more-horizontal" }, className: "w-7 h-7" })
        ),
        div({
            id: "options-dropdown",
            className: "dropdown-menu hidden absolute right-0 top-full pt-4 w-64 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        }).Append(
            div({ className: "bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-2" }).Append(
                // Item Clonar - Ícone e Texto Azuis
                DropdownItem({
                    icon: "copy",
                    label: "Clonar cotação",
                    sublabel: "Duplicar este documento",
                    iconColor: "text-blue-500",
                    hoverColor: "group-hover/item:text-blue-700",
                    onclick: events.onCloneClick
                }),
                div({ className: "h-px bg-gray-50 my-1.5 mx-3" }),
                // Item Eliminar - Ícone e Texto Vermelhos
                DropdownItem({
                    icon: "trash-2",
                    label: "Eliminar",
                    sublabel: "Apagar o conteúdo desta cotação",
                    iconColor: "text-red-500",
                    hoverColor: "group-hover/item:text-red-700",
                    onclick: events.onDeleteClick
                })
            )
        )
    );
}

function DropdownItem({ icon, label, sublabel, onclick, className = "", iconColor = "text-blue-600", hoverColor = "group-hover/item:text-blue-700" }) {
    return button({
        className: `w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all duration-200 group/item hover:bg-gray-50 ${className}`,
        onclick: onclick
    }).Append(
        div({ className: "p-2 bg-gray-50 rounded-lg group-hover/item:bg-white transition-colors" }).Append(
            RichElement("i", {
                dataset: { lucide: icon },
                // Ícone já nasce com cor e brilha mais no hover
                className: `w-4 h-4 ${iconColor} group-hover/item:scale-110 transition-all`
            })
        ),
        div({ className: "flex flex-col" }).Append(
            span({ className: `text-sm font-bold text-gray-700 transition-colors ${hoverColor}`, textContent: label }),
            span({ className: "text-xs text-gray-400", textContent: sublabel })
        )
    );
}

function PrintFAB(events) {
    return div({
        id: "fabPrintButtonWrapper",
        className: "group  fixed bottom-8 right-8 z-40"
    }).Append(
        button({
            id: "fabPrintButton",
            className: "w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-blue-600 hover:scale-110 active:scale-90 transition-all duration-300", onclick: events.onPrintClick
        }).Append(
            RichElement("i", { dataset: { lucide: "printer" }, className: "w-7 h-7" })
        ),
        span({
            className: "absolute right-full top-1/2 -translate-y-1/2 mr-4 px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none",
            textContent: "IMPRIMIR A COTAÇÃO"
        })
    );
}