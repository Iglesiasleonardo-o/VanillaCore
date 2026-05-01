import {
    button,
    div,
    footer,
    header,
    RichElement,
    span,
} from "../vanilla-core/viewgencore.js";
import { deepmerge } from "./deepmerge.js";

export function PrimaryFAB(id, text, lucideIcon, onclick) {
    return StandardFAB(
        id,
        text,
        lucideIcon,
        onclick,
        "bg-gradient-to-r from-blue-600 to-blue-700 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all duration-200 shrink-0 border border-blue-500"
    );
}

export function StandardFAB(id, text, lucideIcon, onclick, colorClasses) {
    return button({
        id,
        type: "button",
        onclick,
        className:
            "fixed bottom-8 right-8 flex items-center justify-center gap-2 px-6 py-4 text-white font-bold rounded-full shadow-2xl hover:scale-105 transition-all duration-200 z-50 " +
            colorClasses,
    }).Append(
        div({
            className: "flex items-center gap-2 pointer-events-none",
        }).Append(
            RichElement("i", {
                dataset: { lucide: lucideIcon },
                className: "w-5 h-5",
            }),
            span({ textContent: text })
        )
    );
}

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

export function ConfirmModal(props = {}) {
    const defaultProps = {
        confirmButtonProps: {
            textContent: "Confirmar",
            onclick: () => {},
        },
        cancelButtonProps: {
            textContent: "Cancelar",
            onclick: () => {},
        },
        mode: "footer",
    };

    const mergedProps = deepmerge(defaultProps, props);

    const buttonsContainerComponent =
        mergedProps.mode === "footer" ? footer : header;

    const mainComponent = div({
        className:
            "fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50",
        onclick: mergedProps.onclick || function () {},
        id: mergedProps.id ?? "",
    });

    const originalAppend = mainComponent.Append;

    function appendOnInnerContent(...args) {
        return originalAppend.bind(
            mainComponent,
            div({
                className:
                    "bg-white w-full max-w-4xl h-full max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-auto relative",
            }).Append(
                ...args,
                buttonsContainerComponent({
                    className: `p-4 border-gray-200 flex items-center justify-end gap-3 bg-white z-10 sticky w-full ${mergedProps.mode === "footer" ? "border-t top-[100%]" : "border-b top-0"}`,
                }).Append(
                    button({
                        id: "cancelButton",
                        type: "button",
                        className:
                            "px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition duration-200",
                        onclick: mergedProps.onCancel,
                        ...mergedProps.cancelButtonProps,
                    }),
                    button({
                        id: "confirButton",
                        type: "button",
                        className:
                            "px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200",
                        onclick: mergedProps.onConfirm,
                        ...mergedProps.confirmButtonProps,
                    })
                )
            )
        )();
    }

    mainComponent.Append = appendOnInnerContent;

    return mainComponent;
}

export function LazyList(offset, length) {}
