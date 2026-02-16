import {
    div, header, footer, section, h1, h2, h3, h4, p,
    button, span, i, a, img, input, select, option, textarea,
    table, thead, tbody, tr, th, td, RichElement
} from "../../shared/viewgencore.js";

export function createQuotationView(
    quotationId,
    executePrint, handleSaveClick, handleOptionsClick,
    handlePaymentTermsUpdate, updatePrintText
) {
    return div({ id: "app", className: "md:px-8 md:pb-8" }).Append(
        createMainHeader(quotationId, executePrint, handleSaveClick, handleOptionsClick),
        createA4Page(quotationId, handlePaymentTermsUpdate, updatePrintText),
        createPrintFAB(executePrint)
    );
}

function createMainHeader(quotationId, executePrint, handleSaveClick, handleOptionsClick) {
    return header({
        id: "mainHeader",
        className: "sticky top-0 bg-gray-100 border-gray-200 z-30 pt-4 md:pt-8 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-200"
    }).Append(
        // Back Button
        div({ className: "md:flex-1" }).Append(
            a({
                href: "/cotacoes",
                className: "flex items-center gap-1 text-base font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg py-2 px-3 transition-colors"
            }).Append(
                RichElement("i", { dataset: { lucide: "chevron-left" }, className: "w-5 h-5 -ml-1" }),
                span({ textContent: "Lista de Cotações" })
            )
        ),
        // Title
        div({ className: "md:flex-1 md:text-center" }).Append(
            h1({ className: "text-3xl font-bold text-gray-800", textContent: `Cotação Nº ${quotationId}` })
        ),
        // Toolbar
        div({ className: "md:flex-1 flex md:justify-end" }).Append(
            div({ className: "flex items-center gap-3" }).Append(
                button({
                    id: "printButton",
                    className: "no-print flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200",
                    onclick: executePrint
                }).Append(
                    RichElement("i", { dataset: { lucide: "printer" }, className: "w-5 h-5" }),
                    span({ textContent: "Imprimir" })
                ),
                button({
                    id: "saveQuoteButton",
                    className: "no-print flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200",
                    onclick: handleSaveClick
                }).Append(
                    RichElement("i", { dataset: { lucide: "save" }, className: "w-5 h-5" }),
                    span({ id: "saveButtonText", textContent: "Guardar" })
                ),
                div({ className: "relative no-print" }).Append(
                    button({
                        id: "optionsMenuButton",
                        className: "p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200",
                        onclick: handleOptionsClick
                    }).Append(
                        RichElement("i", { dataset: { lucide: "more-vertical" }, className: "w-5 h-5" })
                    ),
                    div({
                        id: "optionsMenuDropdown",
                        className: "hidden absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                    }).Append(
                        RichElement("button", {
                            id: "saveButton",
                            className: "action-button flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100",
                            dataset: { action: "save" },
                            style: "width: 100%;"
                        }).Append(
                            RichElement("i", { dataset: { lucide: "save" }, className: "w-5 h-5 text-blue-600" }),
                            span({ textContent: "Clonar cotação" })
                        )
                    )
                )
            )
        )
    );
}

function createA4Page(quotationId, handlePaymentTermsUpdate, updatePrintText) {
    return div({
        id: "a4Page",
        className: "mt-10 w-[210mm] min-h-[297mm] bg-white rounded-lg shadow-lg mx-auto p-12 border border-gray-200 border-t"
    }).Append(
        createDocumentHeader(),
        createCustomerAndTitleSection(quotationId),
        createProductManagerButton(),
        createItemsTable(),
        createDocumentFooter(handlePaymentTermsUpdate, updatePrintText)
    );
}

function createDocumentHeader() {
    return header({ className: "flex justify-between items-start border-gray-200" }).Append(
        div().Append(
            div({ className: "text-xs text-gray-700" }).Append(
                h2({ id: "company_name_", className: "font-bold text-lg text-gray-900 mb-2", textContent: "Inovitek, Lda" }),
                p({ id: "company_address", textContent: "Rua da Mocargo, Talhão 2A, Parcela 728" }),
                p({ id: "company_district", textContent: "Fomento" }),
                p({ id: "company_city_province", textContent: "Matola, Maputo Província 1102" }),
                p({ id: "company_country", textContent: "Moçambique" }),
                p({ id: "company_nuit", className: "mt-2 font-semibold", textContent: "NUIT: 401956298" })
            )
        ),
        div({ className: "flex flex-col items-end text-right" }).Append(
            img({
                src: "../../../img/inovitek-logo.svg",
                alt: "Logo da Empresa",
                className: "w-56 object-contain mb-4",
                onerror: "this.src='https://placehold.co/224x60/CCCCCC/333333?text=INOVITEK+LOGO'"
            }),
            div({ className: "mt-0 space-y-1 text-sm" }).Append(
                div({ className: "grid grid-cols-2 gap-2" }).Append(
                    RichElement("strong", { className: "text-gray-700", textContent: "Data:" }),
                    div({ className: "text-gray-600" }).Append(
                        span({ id: "quoteDate", className: "print-only hidden" }),
                        input({ type: "date", id: "quoteDateInput", className: "no-print mb-2 text-sm border border-gray-300 rounded-md py-0 px-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500" })
                    )
                ),
                div({ className: "grid grid-cols-2 gap-2" }).Append(
                    RichElement("strong", { className: "text-gray-700", textContent: "Válida até:" }),
                    div({ className: "text-gray-600" }).Append(
                        span({ id: "quoteExpiryDate", className: "print-only hidden" }),
                        div({ className: "no-print -mt-1.5" }).Append(
                            select({ id: "quoteValidityDays", className: "w-full text-sm border border-gray-300 rounded-md py-0.5 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500" }).Append(
                                option({ value: "7", textContent: "7 dias" }),
                                option({ value: "15", textContent: "15 dias" }),
                                option({ value: "30", selected: true, textContent: "30 dias" }),
                                option({ value: "120", textContent: "120 dias" }),
                                option({ value: "outro", textContent: "Outro (dias)" })
                            ),
                            input({ type: "number", id: "quoteValidityOther", className: "hidden mt-1 w-full text-sm border border-gray-300 rounded-md py-0.5 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500", placeholder: "Ex: 45" }),
                            span({ id: "quoteExpiryDateUI", className: "mt-0.5 text-xs text-gray-500" })
                        )
                    )
                ),
                div({ className: "grid grid-cols-2 gap-2" }).Append(
                    RichElement("strong", { className: "text-gray-700", textContent: "Vendedor:" }),
                    span({ id: "quoteSeller", className: "text-gray-600", textContent: "Cristiana Razaque" })
                )
            )
        )
    );
}

function createCustomerAndTitleSection(quotationId) {
    return div({ className: "flex justify-between items-end" }).Append(
        section({ className: "pt-1 border-t w-1/2" }).Append(
            h3({ className: "text-sm font-bold text-gray-500 uppercase tracking-wide", textContent: "Cliente" }),
            div({ className: "w-full no-print" }).Append(
                div({ className: "relative mb-2" }).Append(
                    input({
                        type: "text",
                        id: "customerSearch",
                        placeholder: "-- Clique para selecionar ou criar cliente --",
                        className: "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                        readonly: true
                    }),
                    button({
                        id: "clearCustomerButton",
                        className: "absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 hidden"
                    }).Append(
                        RichElement("i", { dataset: { lucide: "x-circle" }, className: "w-5 h-5" })
                    )
                )
            ),
            div({ id: "customerDetails", className: "border-l border-gray-200 pl-2 text-xs text-gray-700 min-h-[100px]" }).Append(
                p({ className: "text-gray-400", textContent: "Nenhum cliente selecionado." })
            )
        ),
        div({ className: "flex flex-col items-end text-right flex-shrink-0 ml-8" }).Append(
            h1({ className: "text-3xl font-bold text-gray-900 -mb-1", textContent: "COTAÇÃO" }),
            p({ id: "quoteNumber", className: "text-lg font-semibold text-blue-600", textContent: `Nº ${quotationId}` })
        )
    );
}

function createProductManagerButton() {
    return div({ className: "my-6 text-center no-print" }).Append(
        button({
            id: "manageProductsButton",
            className: "w-full px-6 py-3 bg-blue-600 text-white text-base font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
        }).Append(
            RichElement("i", { dataset: { lucide: "plus-circle" }, className: "w-5 h-5" }),
            span({ textContent: "Adicionar Produtos à Cotação" })
        )
    );
}

function createItemsTable() {
    return section({ className: "mt-2" }).Append(
        table({ className: "w-full text-left text-sm" }).Append(
            thead({ className: "bg-gray-50 text-gray-700 uppercase tracking-wider" }).Append(
                tr().Append(
                    th({ className: "p-3 font-semibold", textContent: "ID" }),
                    th({ className: "p-3 font-semibold", textContent: "Descrição" }),
                    th({ className: "p-3 font-semibold text-center w-10", textContent: "Qtd." }),
                    th({ className: "p-3 font-semibold text-right w-20" }).Append(
                        span({ textContent: "Preço" }),
                        RichElement("br"),
                        span({ textContent: "Unit." })
                    ),
                    th({ className: "p-3 font-semibold text-center w-16" }).Append(
                        span({ textContent: "Desc." }),
                        RichElement("br"),
                        span({ textContent: "(%)" })
                    ),
                    th({ className: "p-3 font-semibold text-center w-16", textContent: "Total" })
                )
            ),
            tbody({ id: "quoteItemsTableBody", className: "divide-y divide-gray-200" }).Append(
                tr({ id: "emptyRow" }).Append(
                    td({ colspan: "7", className: "p-6 text-center text-gray-400", textContent: "Nenhum produto adicionado." })
                )
            )
        )
    );
}

function createDocumentFooter(handlePaymentTermsUpdate, updatePrintText) {
    const paymentTermsPrint = span({
        id: "paymentTermsPrintValue", className: "print-only hidden",
        textContent: "Pronto Pagamento"
    });

    const otherTermsInput = input({
        type: "text", id: "paymentTermsOther", className: "hidden mt-1 block w-full max-w-xs text-sm border border-gray-300 rounded-md py-1.5 px-2", placeholder: "Especificar termos...",
        oninput: e => updatePrintText(paymentTermsPrint, e)
    });

    const paymentTerms = select({
        id: "paymentTerms", className: "block w-full max-w-xs text-sm border border-gray-300 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
        onchange: e => handlePaymentTermsUpdate(e, otherTermsInput, paymentTermsPrint)
    });

    const generalConditionsPrint = div({ id: "generalConditionsExtraPrint", className: "text-xs text-gray-600 mt-2 print-pre-line print-only hidden" });

    const generalConditionsTextArea = textarea({
        id: "generalConditionsExtra", rows: "3", className: "block w-full text-xs border border-gray-300 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500", placeholder: "Acrescente aqui outras condições...",
        oninput: e => updatePrintText(generalConditionsPrint, e)
    });

    return footer({ className: "pt-4 border-t border-gray-200" }).Append(
        div({ className: "flex justify-between items-start gap-8" }).Append(
            // General Conditions
            div({ className: "w-1/2" }).Append(
                h4({ className: "font-bold text-gray-800 mb-2", textContent: "Condições Gerais" }),
                div({ className: "text-xs text-gray-600 space-y-1" }).Append(
                    div({ className: "no-print flex items-center gap-1" }).Append(
                        span({ textContent: "1. Garantia de" }),
                        input({ type: "text", id: "warrantyMonths", value: "12", className: "w-12 border border-gray-300 rounded-md py-0.5 px-1 text-center text-xs" }),
                        span({ textContent: "meses contra defeitos de fabrico." })
                    ),
                    p({ className: "print-only hidden" }).Append(
                        span({ textContent: "1. Garantia de " }),
                        span({ id: "warrantyMonthsPrint", textContent: "12" }),
                        span({ textContent: " meses contra defeitos de fabrico." })
                    ),
                    p({ textContent: "2. IVA à taxa legal em vigor (16%)." })
                ),
                div({ className: "mt-2 no-print" }).Append(
                    RichElement("label", { for: "generalConditionsExtra", className: "block text-xs font-medium text-gray-600 mb-1", textContent: "Condições Adicionais" }),
                    generalConditionsTextArea
                ),
                generalConditionsPrint
            ),
            // Totals
            div({ className: "w-1/2 max-w-xs text-sm" }).Append(
                div({ className: "space-y-2" }).Append(
                    div({ className: "flex items-center justify-between border-b border-gray-200 pb-2 mb-2 no-print" }).Append(
                        div({ className: "flex items-center gap-2" }).Append(
                            input({ type: "checkbox", id: "toggleGlobalDiscount", className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" }),
                            RichElement("label", { for: "toggleGlobalDiscount", className: "text-xs font-medium text-gray-600 select-none cursor-pointer", textContent: "Desconto Global" })
                        ),
                        div({ className: "flex items-center gap-1" }).Append(
                            input({ type: "number", id: "globalDiscountInput", placeholder: "0", min: "0", max: "100", disabled: true, className: "w-12 text-right text-xs border border-gray-300 rounded py-0.5 px-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400" }),
                            span({ className: "text-xs text-gray-500", textContent: "%" })
                        )
                    ),
                    div({ className: "flex justify-between" }).Append(
                        span({ className: "text-gray-600", textContent: "Subtotal:" }),
                        div().Append(span({ id: "subtotalAmount", className: "font-medium text-gray-800", textContent: "0,00" }))
                    ),
                    div({ className: "flex justify-between" }).Append(
                        span({ className: "text-gray-600", textContent: "IVA (16%):" }),
                        div().Append(span({ id: "vatAmount", className: "font-medium text-gray-800", textContent: "0,00" }))
                    ),
                    div({ className: "flex justify-between border-t border-gray-300 pt-2 mt-2" }).Append(
                        span({ className: "font-bold text-lg text-gray-900", textContent: "Total:" }),
                        div().Append(span({ id: "totalAmount", className: "font-bold text-lg text-blue-600", textContent: "0,00" }))
                    )
                )
            )
        ),
        // Payment Methods Section
        div({ className: "mt-8 pt-8 border-t border-gray-200" }).Append(
            h4({ className: "font-bold text-gray-800 mb-1", textContent: "Métodos de Pagamento" }),
            div({ className: "mb-2" }).Append(
                div({ className: "mb-3 no-print" }).Append(
                    RichElement("label", { for: "paymentTerms", className: "block text-sm font-medium text-gray-700 mb-1", textContent: "Termos de Pagamento" }),
                    paymentTerms.Append(
                        option({ value: "Pronto Pagamento", selected: true, textContent: "Pronto Pagamento" }),
                        option({ value: "15 Dias", textContent: "15 Dias" }),
                        option({ value: "30 Dias", textContent: "30 Dias" }),
                        option({ value: "outro", textContent: "Outro (especificar)" })
                    ),
                    otherTermsInput
                ),
                div({ id: "paymentTermsPrint", className: "text-xs text-gray-600 space-y-1" }).Append(
                    p().Append(
                        RichElement("strong", { textContent: "Termos de Pagamento: " }),
                        paymentTermsPrint
                    )
                )
            ),
            div({ className: "mb-4 no-print" }).Append(
                button({
                    id: "managePaymentMethodsButton",
                    className: "w-full px-6 py-3 bg-gray-100 text-gray-700 text-base font-medium rounded-lg shadow-sm border border-gray-300 hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2"
                }).Append(
                    RichElement("i", { dataset: { lucide: "wallet" }, className: "w-5 h-5" }),
                    span({ textContent: "Gerir Contas Bancárias" })
                )
            ),
            div({ id: "paymentMethodsPrint", className: "grid grid-cols-2 gap-x-8 gap-y-4 text-xs text-gray-600" }).Append(
                p({ id: "noPaymentMethod", className: "col-span-2 text-gray-400", textContent: "Nenhuma conta bancária selecionada." })
            )
        )
    );
}

function createPrintFAB(executePrint) {
    return div({
        id: "fabPrintButtonWrapper",
        className: "group no-print fixed bottom-6 right-6 z-40"
    }).Append(
        // The Main Button
        button({
            id: "fabPrintButton",
            className: "w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform duration-200 hover:scale-105",
            onclick: executePrint
        }).Append(
            RichElement("i", {
                dataset: { lucide: "printer" },
                className: "w-6 h-6"
            })
        ),
        // The Tooltip (Shown on group-hover)
        span({
            className: "sidebar-tooltip absolute right-full top-1/2 -translate-y-1/2 mr-4 px-3 py-1.5 bg-gray-700 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50",
            textContent: "Imprimir Cotação"
        })
    );
}