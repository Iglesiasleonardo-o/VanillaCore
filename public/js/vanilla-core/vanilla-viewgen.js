// Here lives the html core elements
// The sidebar, the header, the footer, the main content

import { button, div, nav, RichElement, span } from '../shared/viewgencore.js';

export function createMainView(user) {
    return div({ id: "body-wrapper", className: "bg-gray-100 flex" }).Append(
        createSidebar(user),
        div({ id: "main-wrapper", className: "flex-1 ml-20" })
    );
}

function createSidebar() {
    return nav({
        className: "fixed top-0 left-0 h-screen w-20 bg-gray-900 text-white flex flex-col items-center py-6 z-40"
    }).Append(
        // LOGO
        div({
            className: "p-2.5 bg-blue-600 rounded-lg cursor-pointer mb-6",
            // onclick: () => Router.go('dashboard')
        }).Append(
            RichElement("i", { className: "w-8 h-8", dataset: { lucide: "blocks" } })
        ),
        div({ className: "flex flex-col space-y-3 pt-6" }).Append(
            createNavItem("clipboard-list", "Cotações", "text-blue-400", "cotacoes"),
            createNavItem("shopping-cart", "Ponto de Venda", "text-green-400", "pos"),
            createNavItem("package", "Produtos", "text-blue-400", "produtos"),
            createNavItem("warehouse", "Inventário", "text-yellow-400", "inventario"),
            createNavItem("users", "Clientes", "text-white bg-blue-600 shadow-lg", "clientes"),
            createNavItem("user-cog", "Utilizadores", "text-red-400", "usuarios")
        )
    );
}

// Função auxiliar para não repetir código de botões
function createNavItem(iconName, label, colors, route) {
    return button({
        className: `group relative flex items-center justify-center p-3 rounded-lg transition-colors hover:bg-gray-800 ${colors}`,
        // onclick: () => Router.go(route)
    }).Append(
        RichElement("i", { className: "w-6 h-6", dataset: { lucide: iconName } }),
        span({
            className: "sidebar-tooltip absolute left-full ml-4 px-3 py-1.5 bg-gray-700 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none",
            textContent: label
        })
    );
}