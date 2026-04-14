// Here lives the html core elements
// The sidebar, the header, the footer, the main content

import { a, div, nav, RichElement, span } from './viewgencore.js';

export function createMainView(user, onRouteChange) {
    return div({ id: "body-wrapper", className: "bg-gray-100 flex" }).Append(
        createSidebar(user, onRouteChange),
        div({ id: "main-wrapper", className: "ml-20 print:ml-0 flex-1 h-screen overflow-y-auto" })
    );
}

function createSidebar(user, onRouteChange) {
    return nav({
        className: "fixed top-0 left-0 h-screen w-20 bg-gray-900 text-white flex flex-col items-center py-6 space-y-4 z-40 no-print"
    }).Append(
        a({
            id: "-nav",
            href: "/",
            className: "p-2.5 bg-blue-600 rounded-lg cursor-pointer mb-6",
            onclick: e => onRouteChange(e, "")
        }).Append(
            RichElement("i", { className: "w-8 h-8", dataset: { lucide: "blocks" } })
        ),
        div({ className: "flex flex-col space-y-3 pt-6" }).Append(
            createNavItem("clipboard-list", "Cotações", "text-white", "quotations", onRouteChange),
            createNavItem("package", "Produtos", "text-emerald-400", "products", onRouteChange),
            createNavItem("users", "Clientes", "text-sky-400", "customers", onRouteChange),
            createNavItem("user-cog", "Perfil", "text-rose-400", "profile", onRouteChange)
        )
    );
}

// Função auxiliar para não repetir código de botões
function createNavItem(iconName, label, colors, route, onRouteChange) {
    return a({
        id: `${route}-nav`,
        href: `/${route}`,
        className: `group relative flex items-center justify-center p-3 rounded-lg transition-colors hover:bg-gray-800 ${colors}`,
        onclick: (e) => onRouteChange(e, route)
    }).Append(
        RichElement("i", { className: "w-6 h-6", dataset: { lucide: iconName } }),
        span({
            className: "sidebar-tooltip absolute left-full ml-4 px-3 py-1.5 bg-gray-700 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none",
            textContent: label
        })
    );
}