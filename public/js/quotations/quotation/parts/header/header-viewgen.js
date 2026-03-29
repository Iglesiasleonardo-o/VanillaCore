import { div, h2, header, img, input, option, p, RichElement, select, span } from "../../../../shared/viewgencore.js";

export function HeaderView(quotation, viewModel, events) {
    const { issuer } = quotation;

    return header({ className: "flex justify-between items-start border-gray-200" }).Append(
        CompanyInfo(issuer),
        div({ className: "flex flex-col items-end text-right" }).Append(
            img({
                src: "/public/img/inovitek-logo.svg", className: "w-56 object-contain mb-4",
                onerror: e => { e.target.src = 'https://placehold.co/224x60/CCCCCC/333333?text=INOVITEK+LOGO'; }
            }),
            div({ className: "mt-0 space-y-1 text-sm" }).Append(
                MetadataRow("Data:",
                    span({ id: "printDate", className: "print-only hidden", textContent: viewModel.issueDate }),
                    input({
                        id: "dateInput", type: "date",
                        value: quotation.issueDate,
                        onchange: events.onDateChange,
                        className: "no-print w-full text-sm border border-gray-300 rounded-md shadow-sm py-0.5 px-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    })
                ),
                MetadataRow("Válida até:",
                    span({ id: "printExpiry", className: "print-only hidden", textContent: viewModel.expiryDate }),
                    ValidityWrapper(viewModel, events)
                ),
                MetadataRow("Vendedor:",
                    span({ id: "sellerSpan", className: "text-gray-600 block py-0.5", innerText: viewModel.seller })
                )
            )
        )
    );
}

function ValidityWrapper(viewModel, events) {
    const { expiryDays, standardDays } = viewModel;
    
    let isManual = true;

    const validitySelect = select({
        id: "validitySelect",
        onchange: (e) => events.onValidityChange(e),
        className: "w-full text-sm border border-gray-300 rounded-md shadow-sm py-0.5 px-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white cursor-pointer"
    });

    standardDays.forEach(day => {
        const isMatch = (day == expiryDays);
        if (isMatch) isManual = false;

        validitySelect.Append(option({
            id: `validity-${day}`,
            value: day,
            textContent: `${day} dias`,
            selected: isMatch
        }));
    });

    validitySelect.Append(option({
        value: "outro",
        textContent: "Outro",
        selected: isManual
    }));

    return div({ className: "no-print flex flex-col w-full" }).Append(
        validitySelect,
        input({
            id: "otherInput",
            type: "number",
            placeholder: "Ex: 45",
            oninput: events.onOtherInput,
            className: `${isManual ? "" : "hidden"} mt-1.5 w-full text-sm border border-gray-300 rounded-md shadow-sm py-0.5 px-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white`,
            value: isManual ? expiryDays : ""
        }),
        span({ id: "uiExpiry", className: "mt-1 text-xs text-gray-500 block text-right", innerText: viewModel.expiryLabel })
    );
}

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
    return div({ className: "grid grid-cols-[80px_1fr] gap-1 items-center" }).Append(
        RichElement("strong", { className: "text-gray-700 text-right whitespace-nowrap", textContent: label }),
        div({ className: "text-gray-600 w-full" }).Append(...children)
    );
}