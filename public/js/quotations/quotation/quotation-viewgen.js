import {
    div, header, footer, section, h1, h2, h3, h4, p,
    button, span, i, a, img, input, select, option, textarea,
    table, thead, tbody, tr, th, td, RichElement
} from "../../shared/viewgencore.js";

export function createLoadingState() {
    return div({
        id: "loadingScreen",
        className: "flex flex-col items-center justify-center w-full min-h-screen"
    }).Append(
        div({
            className: "animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"
        }),
        p({
            className: "text-gray-500 font-medium",
            textContent: "A carregar a cotação..."
        })
    );
}

export function createQuotationNotFound() {
    return div({
        id: "notFoundState",
        className: "flex flex-col items-center justify-center w-full min-h-screen bg-gray-50 px-4 text-center"
    }).Append(
        // Ícone de alerta ou erro (usando Lucide)
        div({ className: "bg-red-100 p-4 rounded-full mb-6" }).Append(
            RichElement("i", { dataset: { lucide: "file-warning" }, className: "w-12 h-12 text-red-600" })
        ),
        h2({
            className: "text-2xl font-bold text-gray-800 mb-2",
            textContent: "Cotação não encontrada"
        }),
        p({
            className: "text-gray-600 mb-8 max-w-md",
            textContent: "A cotação que procura não existe no sistema."
        }),
        div({ className: "flex flex-col sm:flex-row gap-4" }).Append(
            a({
                href: "/quotations",
                className: "flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition shadow-sm",
                onclick: () => { console.log("OPEN UP Quotations route without changing app") }
            }).Append(
                RichElement("i", { dataset: { lucide: "list" }, className: "w-5 h-5" }),
                span({ textContent: "Abrir Lista de Cotações" })
            ),
            button({
                className: "flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md",
                onclick: () => {
                    console.log("CRIAR NOVA COTACAO NA BASE DE DADOS e enviar o novo data state")
                }
            }).Append(
                RichElement("i", { dataset: { lucide: "plus" }, className: "w-5 h-5" }),
                span({ textContent: "Criar Nova Cotação" })
            )
        )
    );
}

// 2. A4 DOCUMENT STRUCTURE
export function createA4Sheet(quotationNumber) {
    return div({
        id: "a4Page",
        className: "mt-10 w-[210mm] min-h-[297mm] bg-white rounded-lg shadow-lg mx-auto p-12 border border-gray-200 border-t"
    }).Append(
        createDocumentHeader(),
        createCustomerAndTitleSection(quotationNumber),
        createProductManagerButton(),
        createItemsTable(),
    );
}

// 3. DOCUMENT HEADER (Company Info & Metadata)
function createDocumentHeader() {
    return header({ className: "flex justify-between items-start border-gray-200" }).Append(
        createCompanyInfo(),
        createQuoteMetadata()
    );
}

function createCompanyInfo() {
    return div().Append(
        div({ className: "text-xs text-gray-700" }).Append(
            h2({ id: "company_name_", className: "font-bold text-lg text-gray-900 mb-2", textContent: "Inovitek, Lda" }),
            p({ id: "company_address", textContent: "Rua da Mocargo, Talhão 2A, Parcela 728" }),
            p({ id: "company_district", textContent: "Fomento" }),
            p({ id: "company_city_province", textContent: "Matola, Maputo Província 1102" }),
            p({ id: "company_country", textContent: "Moçambique" }),
            p({ id: "company_nuit", className: "mt-2 font-semibold", textContent: "NUIT: 401956298" })
        )
    );
}

function createQuoteMetadata() {
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
                input({ type: "date", id: "quoteDateInput", className: "no-print mb-2 text-sm border border-gray-300 rounded-md py-0 px-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500" })
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

// 4. CUSTOMER & TITLE SECTION
function createCustomerAndTitleSection(quotationNumber) {
    return div({ className: "flex justify-between items-end" }).Append(
        createCustomerSearchSection(),
        div({ className: "flex flex-col items-end text-right flex-shrink-0 ml-8" }).Append(
            h1({ className: "text-3xl font-bold text-gray-900 -mb-1", textContent: "COTAÇÃO" }),
            p({ id: "quoteNumber", className: "text-lg font-semibold text-blue-600", textContent: `Nº ${quotationNumber}` })
        )
    );
}

function createCustomerSearchSection() {
    return section({ className: "pt-1 border-t border-gray-300 w-1/2" }).Append(
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
    );
}

// 5. PRODUCTS & TABLES
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
                    th({ className: "p-3 font-semibold text-right w-20" }).Append(span({ textContent: "Preço" }), RichElement("br"), span({ textContent: "Unit." })),
                    th({ className: "p-3 font-semibold text-center w-16" }).Append(span({ textContent: "Desc." }), RichElement("br"), span({ textContent: "(%)" })),
                    th({ className: "p-3 font-semibold text-center w-16", textContent: "Total" })
                )
            ),
            tbody({ id: "quoteItemsTableBody", className: "divide-y divide-gray-200" }).Append(
                tr({ id: "emptyRow" }).Append(
                    td({ colSpan: "7", className: "p-6 text-center text-gray-400", textContent: "Nenhum produto adicionado." })
                )
            )
        )
    );
}

// 6. DOCUMENT FOOTER (Conditions, Totals, Payments)
export function createDocumentFooter(paymentMethodModal, printEl) {
    return footer({ className: "pt-4 border-t border-gray-200" }).Append(
        div({ className: "flex justify-between items-start gap-8" }).Append(
            createConditionsColumn(), // Left side: Warranty, Notes
            createTotalsColumn()      // Right side: Math, Discounts
        ),
        createPaymentDetailsSection(paymentMethodModal, printEl)
    );
}

// --- Footer Sub-Component: General Conditions (Left) ---

function createConditionsColumn() {
    const generalConditionsPrint = div({ id: "generalConditionsExtraPrint", className: "text-xs text-gray-600 mt-2 print-pre-line print-only hidden" });
    const warrantyMonthsPrint = span({ id: "warrantyMonthsPrint", textContent: "12" });

    return div({ className: "w-1/2" }).Append(
        h4({ className: "font-bold text-gray-800 mb-2", textContent: "Condições Gerais" }),
        div({ className: "text-xs text-gray-600 space-y-1" }).Append(
            // Warranty Input (Editable)
            div({ className: "no-print flex items-center gap-1" }).Append(
                span({ textContent: "1. Garantia de" }),
                input({
                    type: "text", id: "warrantyMonths", value: "12", className: "w-12 border border-gray-300 rounded-md py-0.5 px-1 text-center text-xs",
                    oninput: e => { warrantyMonthsPrint.textContent = e.target.value; }
                }),
                span({ textContent: "meses contra defeitos de fabrico." })
            ),
            // Warranty Text (Print)
            p({ className: "print-only hidden" }).Append(
                span({ textContent: "1. Garantia de " }),
                warrantyMonthsPrint,
                span({ textContent: " meses contra defeitos de fabrico." })
            ),
            p({ textContent: "2. IVA à taxa legal em vigor (16%)." })
        ),
        // Extra Conditions Textarea
        div({ className: "mt-2 no-print" }).Append(
            RichElement("label", { for: "generalConditionsExtra", className: "block text-xs font-medium text-gray-600 mb-1", textContent: "Condições Adicionais" }),
            textarea({
                id: "generalConditionsExtra", rows: "3", className: "block w-full text-xs border border-gray-300 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500", placeholder: "Acrescente aqui outras condições...",
                oninput: e => { generalConditionsPrint.textContent = e.target.value; }
            })
        ),
        generalConditionsPrint
    );
}

// --- Footer Sub-Component: Totals (Right) ---
function createTotalsColumn() {
    return div({ className: "w-1/2 max-w-xs text-sm" }).Append(
        div({ className: "space-y-2" }).Append(
            // Global Discount Toggle
            div({ className: "flex items-center justify-between border-b border-gray-200 pb-2 mb-2 no-print" }).Append(
                div({ className: "flex items-center gap-2" }).Append(
                    input({
                        type: "checkbox", id: "toggleGlobalDiscount", className: "w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500",
                        onchange: e => {
                            const input = document.getElementById('globalDiscountInput');
                            if (input) input.disabled = !e.target.checked;
                        }
                    }),
                    RichElement("label", { for: "toggleGlobalDiscount", className: "text-xs font-medium text-gray-600 select-none cursor-pointer", textContent: "Desconto Global" })
                ),
                div({ className: "flex items-center gap-1" }).Append(
                    input({ type: "number", id: "globalDiscountInput", placeholder: "0", min: "0", max: "100", disabled: true, className: "w-12 text-right text-xs border border-gray-300 rounded py-0.5 px-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400" }),
                    span({ className: "text-xs text-gray-500", textContent: "%" })
                )
            ),
            // Calculations
            createTotalRow("Subtotal:", "subtotalAmount", "font-medium text-gray-800"),
            createTotalRow("IVA (16%):", "vatAmount", "font-medium text-gray-800"),
            div({ className: "flex justify-between border-t border-gray-300 pt-2 mt-2" }).Append(
                span({ className: "font-bold text-lg text-gray-900", textContent: "Total:" }),
                div().Append(span({ id: "totalAmount", className: "font-bold text-lg text-blue-600", textContent: "0,00" }))
            )
        )
    );
}

function createTotalRow(label, valueId, valueClass) {
    return div({ className: "flex justify-between" }).Append(
        span({ className: "text-gray-600", textContent: label }),
        div().Append(span({ id: valueId, className: valueClass, textContent: "0,00" }))
    );
}

// --- Footer Sub-Component: Payment Details (Bottom) ---
function createPaymentDetailsSection(paymentMethodModal, paymentMethodsPrint) {
    return div({ className: "mt-8 pt-8 border-t border-gray-200" }).Append(
        h4({ className: "font-bold text-gray-800 mb-1", textContent: "Métodos de Pagamento" }),
        createPaymentTermsControls(),
        div({ className: "mb-4 no-print" }).Append(
            button({
                id: "managePaymentMethodsButton",
                className: "w-full px-6 py-3 bg-gray-100 text-gray-700 text-base font-medium rounded-lg shadow-sm border border-gray-300 hover:bg-gray-200 transition duration-200 flex items-center justify-center gap-2",
                onclick: () => { paymentMethodModal.classList.remove('hidden'); }
            }).Append(
                RichElement("i", { dataset: { lucide: "wallet" }, className: "w-5 h-5" }),
                span({ textContent: "Gerir Contas Bancárias" })
            )
        ),
        paymentMethodsPrint
    );
}

// Funções puras para criar as referências

function createPaymentTermsControls() {
    // Elements need to be defined before return so the closure works
    const paymentTermsPrint = span({
        id: "paymentTermsPrintValue", className: "print-only hidden",
        textContent: "Pronto Pagamento"
    });

    const otherTermsInput = input({
        type: "text", id: "paymentTermsOther", className: "hidden mt-1 block w-full max-w-xs text-sm border border-gray-300 rounded-md py-1.5 px-2", placeholder: "Especificar termos...",
        oninput: e => { paymentTermsPrint.textContent = e.target.value; }
    });

    const paymentSelect = select({
        id: "paymentTerms", className: "block w-full max-w-xs text-sm border border-gray-300 rounded-md shadow-sm py-1.5 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
        onchange: e => {
            if (e.target.value === 'outro') {
                otherTermsInput.classList.remove('hidden');
                otherTermsInput.focus();
                otherTermsInput.select();
                paymentTermsPrint.textContent = otherTermsInput.value;
            } else {
                otherTermsInput.classList.add('hidden');
                paymentTermsPrint.textContent = e.target.value;
            }
        }
    }).Append(
        option({ value: "Pronto Pagamento", selected: true, textContent: "Pronto Pagamento" }),
        option({ value: "15 Dias", textContent: "15 Dias" }),
        option({ value: "30 Dias", textContent: "30 Dias" }),
        option({ value: "outro", textContent: "Outro (especificar)" })
    );

    return div({ className: "mb-2" }).Append(
        div({ className: "mb-3 no-print" }).Append(
            RichElement("label", { for: "paymentTerms", className: "block text-sm font-medium text-gray-700 mb-1", textContent: "Termos de Pagamento" }),
            paymentSelect,
            otherTermsInput
        ),
        div({ id: "paymentTermsPrint", className: "text-xs text-gray-600 space-y-1" }).Append(
            p().Append(
                RichElement("strong", { textContent: "Termos de Pagamento: " }),
                paymentTermsPrint
            )
        )
    );
}

// 7. UTILITIES
export function createPrintFAB() {
    return div({
        id: "fabPrintButtonWrapper",
        className: "group no-print fixed bottom-6 right-6 z-40"
    }).Append(
        button({
            id: "fabPrintButton",
            className: "w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform duration-200 hover:scale-105",
            onclick: () => window.print()
        }).Append(
            RichElement("i", { dataset: { lucide: "printer" }, className: "w-6 h-6" })
        ),
        span({
            className: "sidebar-tooltip absolute right-full top-1/2 -translate-y-1/2 mr-4 px-3 py-1.5 bg-gray-700 text-white text-sm rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50",
            textContent: "Imprimir Cotação"
        })
    );
}

