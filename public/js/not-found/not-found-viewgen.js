import { div, h1, h2, p, button } from "../vanilla-core/viewgencore.js";

export function NotFoundView(onGoHome) {
    return div({ className: "min-h-screen flex items-center justify-center bg-gray-50 p-4" }).Append(
        div({ className: "text-center p-8 bg-white rounded-2xl shadow-md max-w-md w-full" }).Append(
            h1({
                innerText: "Oops!",
                className: "text-6xl font-extrabold text-gray-800 mb-4"
            }),

            h2({
                innerText: "Página não encontrada",
                className: "text-2xl font-bold text-gray-700 mb-2"
            }),

            p({
                innerText: "A página que você está procurando não existe ou foi removida.",
                className: "text-gray-500 mb-6"
            }),

            button({
                innerText: "Voltar à página principal",
                className: "px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition",
                onclick: onGoHome
            })
        )
    );
}