import { div, h4, span, input, p, label, textarea } from "../../../../vanilla-core/viewgencore.js";

export function GeneralConditionsWidget(vm, events) {
    return div({ className: "w-1/2" }).Append(
        h4({ className: "font-bold text-gray-800 mb-2", textContent: "Condições Gerais" }),

        div({ className: "text-xs text-gray-600 space-y-2" }).Append(
            // --- 1. Warranty Section ---
            div({ className: "flex items-center gap-1 flex-wrap" }).Append(
                span({ textContent: "1. Garantia de " }),
                // Input for Screen
                input({
                    id: "warrantyMonths",
                    type: "text",
                    value: vm.warrantyMonths,
                    className: "no-print w-10 border border-gray-300 rounded py-0.5 px-1 text-center text-xs focus:ring-1 focus:ring-blue-500",
                    oninput: events.onWarrantyInput
                }),
                // Span for Print
                span({
                    id: "warrantyMonthsPrint",
                    className: "print-only hidden font-semibold",
                    textContent: vm.warrantyMonths
                }),
                span({ className: "whitespace-nowrap", textContent: " meses contra defeitos de fabrico." })
            ),

            // --- 2. Tax Label (Static/Printable) ---
            p({ textContent: `2. ${vm.taxRateLabel}` }),

            // --- 3. Additional Notes ---
            div({ className: "mt-3" }).Append(
                label({
                    htmlFor: "generalConditionsExtra",
                    className: "no-print block text-[10px] font-medium text-gray-500 mb-1",
                    textContent: "Condições Adicionais"
                }),
                // Textarea for Screen
                textarea({
                    id: "generalConditionsExtra",
                    rows: 3,
                    className: "no-print block w-full text-xs border border-gray-300 rounded-md py-1.5 px-2 focus:ring-blue-500 focus:border-blue-500",
                    placeholder: "Acrescente aqui outras condições...",
                    textContent: vm.additionalNotes,
                    oninput: events.onNotesInput
                }),
                // Div for Print
                div({
                    id: "generalConditionsExtraPrint",
                    className: "print-only hidden text-xs text-gray-600 whitespace-pre-line mt-1",
                    textContent: vm.additionalNotes
                })
            )
        )
    );
}