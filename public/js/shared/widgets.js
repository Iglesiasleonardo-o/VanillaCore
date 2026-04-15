import { button, RichElement, span } from "../vanilla-core/viewgencore.js";

export function FAB() {
    
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

export function LazyList(offset, length) {
    
}