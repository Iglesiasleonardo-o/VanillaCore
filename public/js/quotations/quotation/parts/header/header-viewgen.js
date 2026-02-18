import { div, h2, header, img, input, option, p, RichElement, select, span } from "../../../../shared/viewgencore.js";

export function createDocumentHeader(quotation, updateExpiry) {
    const { issuer } = quotation;
    return header({ className: "flex justify-between items-start border-gray-200" }).Append(
        createCompanyInfo(issuer),
        createQuoteMetadata(quotation, updateExpiry)
    );
}

function createCompanyInfo(issuer) {
    return div().Append(
        div({ className: "text-xs text-gray-700" }).Append(
            h2({ id: "company_name_", className: "font-bold text-lg text-gray-900 mb-2", textContent: issuer.name }),
            p({ id: "company_address", textContent: issuer.address }),
            p({ id: "company_district", textContent: "Fomento" }),
            p({ id: "company_city_province", textContent: `${issuer.city}, ${issuer.province} ${issuer.zip_code}` }),
            p({ id: "company_country", textContent: issuer.country }),
            p({ id: "company_nuit", className: "mt-2 font-semibold", textContent: `NUIT: ${issuer.nuit}` })
        )
    );
}

function createQuoteMetadata(quotation, updateExpiry) {
    const sellerName = quotation.metadata?.seller || "Anónimo";
    const expiryDays = quotation.metadata?.expiry_days || 7;

    // Ajustado para bater com o seu schema (issue_date)
    const issueDate = quotation.issue_date;
    const expiryDate = quotation.expiry_date;

    return div({ className: "flex flex-col items-end text-right" }).Append(
        img({
            src: "../../../img/inovitek-logo.svg",
            alt: "Logo da Empresa",
            className: "w-56 object-contain mb-4",
            onerror: e => { e.target.src = 'https://placehold.co/224x60/CCCCCC/333333?text=INOVITEK+LOGO'; }
        }),
        div({ className: "mt-0 space-y-1 text-sm" }).Append(
            // Date Field
            createMetadataRow("Data:",
                span({ id: "quoteDate", className: "print-only hidden", textContent: issueDate }),
                input({
                    type: "date",
                    id: "quoteDateInput",
                    className: "no-print mb-2 text-sm border border-gray-300 rounded-md py-0 px-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    value: issueDate
                })
            ),
            // Validity Field
            createMetadataRow("Válida até",
                span({ id: "quoteExpiryDate", className: "print-only hidden", textContent: expiryDate }),
                createValiditySelector(expiryDays, expiryDate, updateExpiry)
            ),
            // Seller Field
            createMetadataRow("Vendedor:",
                span({ id: "quoteSeller", className: "text-gray-600", textContent: sellerName })
            )
        )
    );
}

function createMetadataRow(label, ...children) {
    return div({ className: "grid grid-cols-2 gap-2" }).Append(
        RichElement("strong", { className: "text-gray-700", textContent: label }),
        div({ className: "text-gray-600" }).Append(...children)
    );
}

function createValiditySelector(selectedDays, currentExpiryDate, updateExpiry) {
    const standardValues = ["7", "15", "30", "120"];
    const isOther = !standardValues.includes(selectedDays.toString());

    // Input para dias personalizados
    const otherInput = input({
        type: "number",
        id: "quoteValidityOther",
        className: `${isOther ? '' : 'hidden'} mt-1 w-full text-sm border border-gray-300 rounded-md py-0.5 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500`,
        placeholder: "Ex: 45",
        value: isOther ? selectedDays : "",
        oninput: (e) => updateExpiry(e.target.value) // Atualiza enquanto digita
    });

    const selectEl = select({
        id: "quoteValidityDays",
        className: "w-full text-sm border border-gray-300 rounded-md py-0.5 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500",
        onchange: (e) => {
            if (e.target.value === "outro") {
                otherInput.classList.remove("hidden");
                otherInput.focus();
                otherInput.select();
                updateExpiry(otherInput.value);
            } else {
                otherInput.classList.add("hidden");
                updateExpiry(e.target.value); // Atualiza com o valor fixo (7, 15, etc)
            }
        }
    }).Append(
        option({ value: "7", textContent: "7 dias", selected: selectedDays == 7 }),
        option({ value: "15", textContent: "15 dias", selected: selectedDays == 15 }),
        option({ value: "30", textContent: "30 dias", selected: selectedDays == 30 }),
        option({ value: "120", textContent: "120 dias", selected: selectedDays == 120 }),
        option({ value: "outro", textContent: "Outro (dias)", selected: isOther })
    );

    const expiryDisplay = span({
        id: "quoteExpiryDateUI",
        className: "mt-0.5 text-xs text-gray-500",
        textContent: `Válida até ${currentExpiryDate}`
    });

    return div({ className: "no-print -mt-1.5" }).Append(
        selectEl,
        otherInput,
        expiryDisplay
    );
}