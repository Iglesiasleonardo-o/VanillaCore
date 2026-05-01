import {
    button,
    div,
    footer,
    RichElement,
    span,
} from "../vanilla-core/viewgencore.js";

export function FAB() {}

export function PrimaryButton(id, text, lucideIcon, onclick) {
    return button({
        id,
        onclick,
        className:
            "flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-200 shrink-0 border border-blue-500",
    }).Append(
        RichElement("i", {
            dataset: { lucide: lucideIcon },
            className: "w-5 h-5",
        }),
        span({ textContent: text })
    );
}

export function LazyList(offset, length) {}

export function ConfirmModal(events) {
    return div({
        id: "productModal",
        className:
            "fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50",
        onclick: events.onBackdropClick,
    }).Append(
        div({
            className:
                "bg-white w-full max-w-4xl h-full max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-auto",
        }).Append(
            header({
                className:
                    "p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-20",
            }).Append(
                div({ className: "flex items-center gap-3" }).Append(
                    button({
                        id: "saveButtonHeader",
                        type: "button",
                        onclick: () =>
                            document
                                .getElementById("clientForm")
                                .requestSubmit(),
                        className:
                            "px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200",
                        textContent: "Guardar Cliente",
                    }),
                    button({
                        type: "button",
                        onclick: events.onRequestClose,
                        className:
                            "px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition duration-200",
                        textContent: "Cancelar",
                    })
                ),
                button({
                    type: "button",
                    onclick: events.onRequestClose,
                    className:
                        "text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-lg transition-colors",
                }).Append(
                    RichElement("i", {
                        dataset: { lucide: "x" },
                        className: "w-5 h-5",
                    })
                )
            ),
            footer({
                className:
                    "p-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white z-10",
            }).Append(
                button({
                    id: "cancelButton",
                    type: "button",
                    className:
                        "px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition duration-200",
                    onclick: events.onRequestClose,
                    textContent: "Cancelar",
                }),
                button({
                    id: "saveButton",
                    type: "submit",
                    className:
                        "px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200",
                    textContent: "Guardar Produto",
                })
            )
        )
    );
}
