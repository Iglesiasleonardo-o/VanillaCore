import { a, button, div, h1, header, RichElement, span } from "../../../../shared/viewgencore.js";

export function NavigationHeader(quotationNumber, events) {
    const views = {}; // 1. Create the empty container for our references

    const root = header({
        id: "mainHeader",
        className: "sticky top-0 md:px-8 md:pb-8 bg-gray-100 border-gray-200 z-30 pt-4 md:pt-8 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-200"
    }).Append(
        BackLink(),
        PageTitle(quotationNumber),
        // 2. Pass the views object down so the helper can attach buttons to it
        ActionToolbar(events, views),
        PrintFAB(events)
    );

    // 3. Return both the fully built HTML and the captured references
    return { root, views };
}

function BackLink() {
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

function PageTitle(quotationNumber) {
    return div({ className: "md:flex-1 md:text-center" }).Append(
        h1({ className: "text-3xl font-bold text-gray-800", textContent: `Cotação Nº ${quotationNumber}` })
    );
}

function ActionToolbar(events, views) {
    return div({ className: "md:flex-1 flex md:justify-end" }).Append(
        div({ className: "flex items-center gap-3" }).Append(
            button({
                id: "printButton",
                className: "no-print flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 hover:text-blue-600 transition-all active:scale-95",
                onclick: events.onPrintClick
            }).Append(
                RichElement("i", { dataset: { lucide: "printer" }, className: "w-4 h-4" }),
                span({ textContent: "Imprimir" })
            ),

            // Capture the Save Button and Text directly into the views object
            (views.saveButton = button({
                id: "saveQuoteButton",
                className: "no-print flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95",
                onclick: events.onSaveClick
            }).Append(
                RichElement("i", { dataset: { lucide: "save" }, className: "w-4 h-4" }),
                (views.saveButtonText = span({ id: "saveButtonText", textContent: "Guardar" }))
            )),

            // Pass views down one more level for the dropdown menu
            OptionsDropdown(events, views)
        )
    );
}

function OptionsDropdown(events, views) {
    return div({ className: "dropdown relative no-print inline-block" }).Append(
        // Gatilho: 3 pontos
        button({
            className: "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-100",
            onclick: events.onToggleDropdown // Added event for toggling
        }).Append(
            RichElement("i", { dataset: { lucide: "more-vertical" }, className: "w-6 h-6" })
        ),
        // Menu: O "Card" flutuante (Captured into views)
        (views.dropdownMenu = div({
            className: "dropdown-menu hidden absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200"
        }).Append(
            // Opção: Clonar
            button({
                className: "w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group/item",
                onclick: events.onCloneClick
            }).Append(
                RichElement("i", {
                    dataset: { lucide: "copy" },
                    className: "w-4 h-4 text-gray-400 group-hover/item:text-blue-600"
                }),
                span({ className: "font-medium", textContent: "Clonar cotação" })
            )
        ))
    );
}

function PrintFAB(events) {
    return div({
        id: "fabPrintButtonWrapper",
        className: "group no-print fixed bottom-6 right-6 z-40"
    }).Append(
        button({
            id: "fabPrintButton",
            className: "w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform duration-200 hover:scale-105",
            onclick: events.onPrintClick
        }).Append(
            RichElement("i", { dataset: { lucide: "printer" }, className: "w-6 h-6" })
        ),
        span({
            className: "sidebar-tooltip absolute right-full top-1/2 -translate-y-1/2 mr-4 px-3 py-1.5 bg-gray-700 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50",
            textContent: "Imprimir Cotação"
        })
    );
}
