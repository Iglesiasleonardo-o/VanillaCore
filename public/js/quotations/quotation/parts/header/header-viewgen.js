export function createDocumentHeader(quotation) {
    const { issuer } = quotation;
    return header({ className: "flex justify-between items-start border-gray-200" }).Append(
        createCompanyInfo(issuer),
        createQuoteMetadata(quotation)
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

function createQuoteMetadata(quotation) {
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
                span({ id: "quoteDate", className: "print-only hidden" }),
                input({
                    type: "date", id: "quoteDateInput", className: "no-print mb-2 text-sm border border-gray-300 rounded-md py-0 px-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500",
                    value: quotation.issue_date
                })
            ),
            // Validity Field
            createMetadataRow("Válida até:",
                span({ id: "quoteExpiryDate", className: "print-only hidden" }),
                createValiditySelector()
            ),
            // Seller Field
            createMetadataRow("Vendedor:",
                span({ id: "quoteSeller", className: "text-gray-600", textContent: "Cristiana Razaque" })
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

function createValiditySelector() {
    return div({ className: "no-print -mt-1.5" }).Append(
        select({ id: "quoteValidityDays", className: "w-full text-sm border border-gray-300 rounded-md py-0.5 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500" }).Append(
            option({ value: "7", textContent: "7 dias" }),
            option({ value: "15", textContent: "15 dias" }),
            option({ value: "30", selected: true, textContent: "30 dias" }),
            option({ value: "120", textContent: "120 dias" }),
            option({ value: "outro", textContent: "Outro (dias)" })
        ),
        input({ type: "number", id: "quoteValidityOther", className: "hidden mt-1 w-full text-sm border border-gray-300 rounded-md py-0.5 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500", placeholder: "Ex: 45" }),
        span({ id: "quoteExpiryDateUI", className: "mt-0.5 text-xs text-gray-500" })
    );
}