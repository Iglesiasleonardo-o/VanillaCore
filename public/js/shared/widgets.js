import { button, div, footer, form, header, RichElement, span } from "../vanilla-core/viewgencore.js";

export function PrimaryFAB(id, text, lucideIcon, onclick) {
    return StandardFAB(id, text, lucideIcon, onclick,
        "bg-gradient-to-r from-blue-600 to-blue-700 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-200 shrink-0 border border-blue-500"
    );
}

export function StandardFAB(id, text, lucideIcon, onclick, colorClasses) {
    return button({
        id,
        type: "button",
        onclick,
        className: "fixed bottom-8 right-8 flex items-center justify-center gap-2 px-6 py-4 text-white font-bold rounded-full shadow-2xl hover:scale-105 transition-all duration-200 z-50 " + colorClasses
    }).Append(
        div({ className: "flex items-center gap-2 pointer-events-none" }).Append(
            RichElement("i", { dataset: { lucide: lucideIcon }, className: "w-5 h-5" }),
            span({ textContent: text })
        )
    );
}

export function PrimaryButton(id, text, lucideIcon, onclick) {
    return button({
        id, onclick,
        className: "flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-200 shrink-0 border border-blue-500"
    }).Append(
        RichElement("i", { dataset: { lucide: lucideIcon }, className: "w-5 h-5" }),
        span({ textContent: text })
    )
}

export function ClearButton(id, text, onclick) {
    return button({
        id, type: "button",
        className: "px-5 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition duration-200",
        onclick,
        textContent: text
    })
}

export function FormModal(name, confirmText, mainFormContent, events) {
    const createSaveButton = (id) => {
        const btn = PrimaryButton(id, confirmText, "save");
        btn.type = "submit";
        return btn;
    };

    return div({
        id: name + "Modal",
        // className: "fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50", onclick: events.onBackdropClick
        className: "fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all opacity-0 hidden"
    }).Append(
        form({
            id: name + "Form",
            onsubmit: events.onSaveModal,
            // oninput: events.onFormInput,
            className: "bg-white w-full max-w-4xl h-full max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-auto"
        }).Append(
            header({ className: "p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10" }).Append(
                div({ className: "flex items-center gap-3" }).Append(
                    createSaveButton(name + "SaveButtonHeader"),
                    ClearButton(name + "CancelButton", "Cancelar", events.onRequestClose)
                ),
                button({
                    id: "closeModalButton", type: "button", className: "text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors",
                    onclick: events.onRequestClose
                }).Append(
                    RichElement("i", { dataset: { lucide: "x" }, className: "w-6 h-6" })
                )
            ),

            div({ className: "flex-grow p-6 overflow-y-auto bg-gray-50/30" }).Append(
                mainFormContent,
            ),

            footer({ className: "p-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white z-10" }).Append(
                createSaveButton(name + "SaveButtonFooter"),
                ClearButton(name + "CancelButton", "Cancelar", events.onRequestClose)
            )
        )
    );
}

export function ConfirmationModal(id, title, text, events) {
    // TODO
    return div({ id, className: "fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 hidden z-[60]" }).Append(
        div({ className: "bg-white w-full max-w-md rounded-2xl shadow-2xl p-6" }).Append(
            h3({ className: "text-xl font-bold text-gray-800", textContent: title }),
            p({ className: "text-gray-600 mt-2", textContent: text }),
            div({ className: "flex justify-end gap-3 mt-8" }).Append(
                button({
                    id: "cancelExitButton",
                    className: "px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl shadow-sm hover:bg-gray-50",
                    onclick: events.onCancelExit,
                    textContent: "Continuar a Editar"
                }),
                button({
                    id: "confirmExitButton",
                    className: "px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl shadow-md hover:bg-red-700",
                    onclick: events.onConfirmExit,
                    textContent: "Sair"
                })
            )
        )
    );
}

export function LazyList(offset, length) {

}

export function StringInput(id, textContent, value, placeholder, minLength, maxLength) {
    return div().Append(
        label({
            htmlFor: id,
            className: "block text-sm font-semibold text-gray-700",
            textContent
        }), input({
            id, type: "text",
            name: "companyName",
            value,
            placeholder,
            className: "mt-1.5 block w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-4 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-800 font-medium",
            minLength, maxLength
        })
    )
}

export function NumberInput(id, textContent, value, placeholder, min, max) {
    return div().Append(
        label({
            htmlFor: id,
            className: "block text-sm font-semibold text-gray-700",
            textContent
        }),
        input({
            id, type: "number",
            name: "companyName",
            value,
            placeholder,
            className: "mt-1.5 block w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-4 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-800 font-medium",
            min, max
        })
    )
}