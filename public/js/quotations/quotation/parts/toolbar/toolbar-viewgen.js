import { a, button, div, h1, header, RichElement, span } from "../../../../shared/viewgencore.js";

export function createNavigationHeader(quotationNumber, handleSaveClick, handleCloneClick) {
    return header({
        id: "mainHeader",
        className: "sticky top-0 md:px-8 md:pb-8 bg-gray-100 border-gray-200 z-30 pt-4 md:pt-8 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-200"
    }).Append(
        createBackLink(),
        createPageTitle(quotationNumber),
        createActionToolbar(handleSaveClick, handleCloneClick)
    );
}

function createBackLink() {
    return div({ className: "md:flex-1" }).Append(
        a({
            href: "/cotacoes",
            className: "flex items-center gap-1 text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg py-2 px-3 transition-colors"
        }).Append(
            RichElement("i", { dataset: { lucide: "chevron-left" }, className: "w-5 h-5 -ml-1" }),
            span({ textContent: "Lista de Cotações" })
        )
    );
}

function createPageTitle(quotationNumber) {
    return div({ className: "md:flex-1 md:text-center" }).Append(
        h1({ className: "text-3xl font-bold text-gray-800", textContent: `Cotação Nº ${quotationNumber}` })
    );
}
function createActionToolbar(handleSaveClick, handleCloneClick) {
    return div({ className: "md:flex-1 flex md:justify-end" }).Append(
        div({ className: "flex items-center gap-3" }).Append(
            button({
                id: "printButton",
                className: "no-print flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 hover:text-blue-600 transition-all active:scale-95",
                onclick: () => window.print()
            }).Append(
                RichElement("i", { dataset: { lucide: "printer" }, className: "w-4 h-4" }),
                span({ textContent: "Imprimir" })
            ),
            button({
                id: "saveQuoteButton",
                className: "no-print flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95",
                onclick: handleSaveClick
            }).Append(
                RichElement("i", { dataset: { lucide: "save" }, className: "w-4 h-4" }),
                span({ id: "saveButtonText", textContent: "Guardar" })
            ),
            createOptionsDropdown(handleCloneClick)
        )
    );
}

function createOptionsDropdown(handleCloneClick) {
    return div({ className: "dropdown relative no-print inline-block" }).Append(
        // Gatilho: 3 pontos
        button({
            className: "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-100",
        }).Append(
            RichElement("i", { dataset: { lucide: "more-vertical" }, className: "w-6 h-6" })
        ),
        // Menu: O "Card" flutuante
        div({
            className: "dropdown-menu hidden absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200"
        }).Append(
            // Opção: Clonar
            button({
                className: "w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group/item",
                onclick: handleCloneClick
            }).Append(
                RichElement("i", {
                    dataset: { lucide: "copy" },
                    className: "w-4 h-4 text-gray-400 group-hover/item:text-blue-600"
                }),
                span({ className: "font-medium", textContent: "Clonar cotação" })
            )
        )
    );
}