import {
    div, header, footer, section, h1, h2, h3, h4, p,
    button, span, i, a, img, input, select, option, textarea,
    table, thead, tbody, tr, th, td, RichElement
} from "../../shared/viewgencore.js";

export function LoadingState() {
    return div({
        id: "loadingScreen",
        className: "flex flex-col items-center justify-center w-full min-h-screen"
    }).Append(
        div({
            className: "animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"
        }),
        p({
            className: "text-gray-500 font-medium",
            textContent: "A carregar a cotação..."
        })
    );
}

export function QuotationNotFound() {
    return div({
        id: "notFoundState",
        className: "flex flex-col items-center justify-center w-full min-h-screen bg-gray-50 px-4 text-center"
    }).Append(
        // Ícone de alerta ou erro (usando Lucide)
        div({ className: "bg-red-100 p-4 rounded-full mb-6" }).Append(
            RichElement("i", { dataset: { lucide: "file-warning" }, className: "w-12 h-12 text-red-600" })
        ),
        h2({
            className: "text-2xl font-bold text-gray-800 mb-2",
            textContent: "Cotação não encontrada"
        }),
        p({
            className: "text-gray-600 mb-8 max-w-md",
            textContent: "A cotação que procura não existe no sistema."
        }),
        div({ className: "flex flex-col sm:flex-row gap-4" }).Append(
            a({
                href: "/quotations",
                className: "flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm",
                onclick: () => { console.log("OPEN UP Quotations route without changing app") }
            }).Append(
                RichElement("i", { dataset: { lucide: "list" }, className: "w-5 h-5" }),
                span({ textContent: "Abrir Lista de Cotações" })
            ),
            button({
                className: "flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md",
                onclick: () => {
                    console.log("CRIAR NOVA COTACAO NA BASE DE DADOS e enviar o novo data state")
                }
            }).Append(
                RichElement("i", { dataset: { lucide: "plus" }, className: "w-5 h-5" }),
                span({ textContent: "Criar Nova Cotação" })
            )
        )
    );
}

// 2. A4 DOCUMENT STRUCTURE
export function A4Sheet(headerView, customerView, itemsView) {
    return div({
        id: "a4Page",
        className: "mt-10 mb-20 w-[210mm] min-h-[297mm] bg-white rounded-lg shadow-lg mx-auto p-12 border border-gray-200 border-t"
    }).Append(
        headerView,
        customerView,
        itemsView.tableWidget,
        footer({ className: "pt-4 border-t border-gray-200" }).Append(
            div({ className: "flex justify-between items-start gap-8" }).Append(
                // Condicoes gerais aqui
                div({ className: "w-1/2" }).Append(),
                itemsView.totalsWidget
            )
            // Metodos de pagamento aqui
        )
    );
}