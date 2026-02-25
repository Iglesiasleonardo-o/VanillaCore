import { div, h2, header, img, input, option, p, RichElement, select, span } from "../../../../shared/viewgencore.js";

export function HeaderView(quotation, events) {
    const { issuer, metadata } = quotation;

    // 1. Declare local references
    let printDate, printExpiry, uiExpiry, dateInput, otherInput, validitySelect, sellerSpan;

    // 2. The Unbroken Tree (Captured Inline)
    const root = header({ className: "flex justify-between items-start border-gray-200" }).Append(
        CompanyInfo(issuer),
        div({ className: "flex flex-col items-end text-right" }).Append(
            img({
                src: "../../../img/inovitek-logo.svg", className: "w-56 object-contain mb-4",
                onerror: e => { e.target.src = 'https://placehold.co/224x60/CCCCCC/333333?text=INOVITEK+LOGO'; }
            }),
            div({ className: "mt-0 space-y-1 text-sm" }).Append(
                // Data Row
                MetadataRow("Data:",
                    (printDate = span({ className: "print-only hidden" })),
                    (dateInput = input({ type: "date", onchange: events.onDateChange, className: "no-print text-sm border-gray-300 rounded-md py-0 px-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500" }))
                ),
                // Validade Row
                MetadataRow("Válida até:",
                    (printExpiry = span({ className: "print-only hidden" })),
                    div({ className: "no-print -mt-1.5" }).Append(
                        (validitySelect = select({ onchange: (e) => events.onValidityChange(e, otherInput), className: "w-full text-sm border-gray-300 rounded-md py-0.5 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500" }).Append(
                            option({ value: "7", textContent: "7 dias" }),
                            option({ value: "15", textContent: "15 dias" }),
                            option({ value: "30", textContent: "30 dias" }),
                            option({ value: "120", textContent: "120 dias" }),
                            option({ value: "outro", textContent: "Outro" })
                        )),
                        (otherInput = input({ type: "number", placeholder: "Ex: 45", oninput: events.onOtherInput, className: "mt-1 w-full text-sm border-gray-300 rounded-md py-0.5 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500" })),
                        (uiExpiry = span({ className: "mt-0.5 text-xs text-gray-500 block" }))
                    )
                ),
                // Vendedor Row
                MetadataRow("Vendedor:",
                    (sellerSpan = span({ className: "text-gray-600" }))
                )
            )
        )
    );

    return { root, views: { printDate, printExpiry, uiExpiry, dateInput, otherInput, validitySelect, sellerSpan } };
}

// --- STATIC HELPERS ---
function CompanyInfo(issuer) {
    return div({ className: "text-xs text-gray-700" }).Append(
        h2({ className: "font-bold text-lg text-gray-900 mb-2", textContent: issuer.name }),
        p({ textContent: issuer.address }),
        p({ textContent: "Fomento" }),
        p({ textContent: `${issuer.city}, ${issuer.province} ${issuer.zipCode}` }),
        p({ textContent: issuer.country }),
        p({ className: "mt-2 font-semibold", textContent: `NUIT: ${issuer.nuit}` })
    );
}

function MetadataRow(label, ...children) {
    return div({ className: "grid grid-cols-2 gap-2" }).Append(
        RichElement("strong", { className: "text-gray-700", textContent: label }),
        div({ className: "text-gray-600" }).Append(...children)
    );
}