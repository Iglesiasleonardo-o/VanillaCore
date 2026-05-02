import { div, h2, p, i, RichElement, Icon } from "../vanilla-core/viewgencore.js";

export function DashboardView() {
    return div({ className: "flex items-center justify-center h-full px-6" }).Append(
        div({ className: "text-center max-w-md" }).Append(
            div({ className: "mb-4" }).Append(
                Icon(
                    "M13.73 21a2 2 0 0 1-3.46 0m10-10V7a7 7 0 0 0-13.32-3.03m1.37 1.37A7 7 0 0 0 6 7v4m14 4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h1m11-7v1m-7 8H4m16 0h-1m-6.38-6.38L3 21",
                    "w-10 h-10 mx-auto text-blue-500"
                )
            ),
            h2({
                innerText: "Nada por aqui... ainda 👀",
                className: "text-xl font-semibold text-gray-800 mb-2"
            }),

            p({
                innerText: "Estou a preparar uma área de notificações para ti. Por agora, podes explorar as opções no menu à esquerda.",
                className: "text-gray-500 text-sm leading-relaxed"
            })
        )
    );
}