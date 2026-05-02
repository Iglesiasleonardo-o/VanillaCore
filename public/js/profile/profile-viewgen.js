import { PrimaryButton, PrimaryFAB } from "../shared/widgets.js";
import { div, span, header, main, aside, nav, form, h1, h2, h3, p, button, label, input, textarea, RichElement } from "../vanilla-core/viewgencore.js";

// ==========================================
// HEADER E FAB (MANTIDOS INTACTOS)
// ==========================================

export function ProfileHeader(viewModel, events) {
    return header({
        className: "mb-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 sticky top-0 z-30 bg-white shadow-sm px-4 md:px-8 py-4 border-b border-gray-200"
    }).Append(
        h1({
            className: "text-2xl font-bold text-gray-800 shrink-0",
            textContent: "Perfil"
        }),
        PrimaryButton("saveProfileButton", "Guardar Alterações", "save", events.onTriggerSave)
    );
}


// ==========================================
// MAIN & SIDEBAR
// ==========================================

export function ProfileMain(viewModel, events) {
    return main({ className: "py-4 px-4 md:px-8 max-w-7xl mx-auto" }).Append(
        div({ className: "md:flex gap-8" }).Append(
            ProfileSidebar(events),
            div({ className: "md:w-3/4" }).Append(
                form({ id: "profileForm", onsubmit: events.onSave }).Append(
                    CompanyTab(viewModel, events),
                    PaymentTab(viewModel, events),
                    CurrencyTab(viewModel),
                    SecurityTab()
                )
            )
        ),
        PrimaryFAB("saveProfileFAB", "Guardar Alterações", "save", events.onTriggerSave)
    );
}

function ProfileSidebar(events) {
    return aside({ className: "md:w-1/4 mb-6 md:mb-0 sticky top-[100px] z-20 md:self-start" }).Append(
        nav({ className: "flex flex-row md:flex-col gap-3 overflow-x-auto pb-4 md:pb-0" }).Append(
            TabLink("empresa", "building-2", "Informações da Empresa", true, events.onTabClick),
            TabLink("pagamento", "landmark", "Métodos de Pagamento", false, events.onTabClick),
            TabLink("moeda", "coins", "Moeda e Impostos", false, events.onTabClick),
            TabLink("seguranca", "shield-check", "Segurança", false, events.onTabClick)
        )
    );
}

function TabLink(tabId, iconName, labelText, isActive, onClick) {
    const activeClasses = 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-100';
    const inactiveClasses = 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-800';

    const stateClasses = isActive ? activeClasses : inactiveClasses;

    return RichElement("a", {
        href: "#",
        dataset: { tab: tabId },
        onclick: (e) => onClick(e, tabId),
        className: `profile-nav-link group flex flex-col items-center gap-3 px-4 py-5 text-sm font-semibold border shadow-sm rounded-2xl transition-all w-40 md:w-full flex-shrink-0 ${stateClasses}`
    }).Append(
        RichElement("i", { dataset: { lucide: iconName }, className: "w-7 h-7 opacity-80 group-hover:opacity-100 transition-opacity" }),
        span({ className: "text-center", textContent: labelText })
    );
}

// ==========================================
// TABS
// ==========================================

// Classes reutilizáveis para polimento máximo
const inputClass = "mt-1.5 block w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-4 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-800 font-medium";
const labelClass = "block text-sm font-semibold text-gray-700";
const cardClass = "bg-white rounded-2xl shadow-sm border border-gray-200";
const cardHeaderClass = "p-6 lg:p-8 border-b border-gray-100 sticky top-[240px] md:top-[85px] bg-white/90 backdrop-blur-sm z-10 rounded-t-2xl";

function CompanyTab(viewModel, events) {
    return div({ id: "tab-empresa", className: "profile-tab-panel block" }).Append(
        div({ className: cardClass }).Append(
            div({ className: cardHeaderClass }).Append(
                h2({ className: "text-2xl font-bold text-gray-900", textContent: "Informações da Empresa" }),
                p({ className: "text-gray-500 mt-1", textContent: "Dados fiscais e de localização da sua empresa." })
            ),
            div({ className: "p-6 lg:p-8 space-y-8" }).Append(
                div({ className: "flex flex-col lg:flex-row gap-8" }).Append(
                    div({ className: "lg:w-1/3" }).Append(
                        label({ htmlFor: "logoImageInput", className: labelClass, textContent: "Logotipo" }),
                        input({ type: "file", id: "logoImageInput", onchange: events.onLogoUpload, className: "hidden", accept: "image/*" }),
                        label({ htmlFor: "logoImageInput", className: "mt-1.5 cursor-pointer flex flex-col items-center justify-center w-full h-48 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all" }).Append(
                            div({ id: "logoPreview", className: "w-full h-full rounded-2xl flex flex-col items-center justify-center bg-contain bg-center bg-no-repeat" }).Append(
                                div({ id: "logoUploadIcon", className: "flex flex-col items-center" }).Append(
                                    RichElement("i", { dataset: { lucide: "image-plus" }, className: "w-10 h-10 mb-3" }),
                                    span({ className: "text-sm font-semibold", textContent: "Carregar logotipo" })
                                )
                            )
                        )
                    ),
                    div({ className: "lg:w-2/3 space-y-5" }).Append(
                        div({ className: "grid grid-cols-1 lg:grid-cols-2 gap-5" }).Append(
                            div().Append(
                                label({ htmlFor: "input-company-name", className: labelClass, textContent: "Nome da Empresa" }),
                                input({ id: "input-company-name", type: "text", name: "companyName", value: viewModel.companyName, placeholder: "O nome legal da empresa", className: inputClass })
                                
                            ),
                            div().Append(
                                label({ htmlFor: "input-company-nuit", className: labelClass, textContent: "NUIT" }),
                                input({ id: "input-company-nuit", type: "text", name: "companyNuit", value: viewModel.companyNuit, className: inputClass })
                            )
                        ),
                        div({ className: "grid grid-cols-1 lg:grid-cols-2 gap-5" }).Append(
                            div().Append(
                                label({ htmlFor: "input-company-email", className: labelClass, textContent: "Email Principal" }),
                                input({ id: "input-company-email", type: "email", name: "companyEmail", value: viewModel.companyEmail, placeholder: "contacto@empresa.com", className: inputClass })
                            ),
                            div().Append(
                                label({ htmlFor: "input-company-phone", className: labelClass, textContent: "Telefone" }),
                                input({ id: "input-company-phone", type: "tel", name: "companyPhone", value: viewModel.companyPhone, placeholder: "+258 84 123 4567", className: inputClass })
                            )
                        ),
                        div().Append(
                            label({ htmlFor: "input-company-fax", className: labelClass, textContent: "Fax (Opcional)" }),
                            input({ id: "input-company-fax", type: "tel", name: "companyFax", value: viewModel.companyFax, placeholder: "Deixe em branco se não aplicável", className: inputClass })
                        )
                    )
                ),
                div({ className: "pt-8 border-t border-gray-100" }).Append(
                    h3({ className: "text-lg font-bold text-gray-900", textContent: "Endereço Fiscal" }),
                    div({ className: "mt-5 space-y-5" }).Append(
                        div({ className: "grid grid-cols-1 md:grid-cols-2 gap-5" }).Append(
                            div().Append(
                                label({ htmlFor: "input-company-country", className: labelClass, textContent: "País" }),
                                input({ id: "input-company-country", type: "text", name: "companyCountry", value: viewModel.companyCountry, readOnly: true, className: "mt-1.5 block w-full border border-gray-200 rounded-xl shadow-sm py-2.5 px-4 bg-gray-100 text-gray-500 font-semibold focus:outline-none cursor-not-allowed" })
                            ),
                            div().Append(
                                label({ htmlFor: "input-company-province", className: labelClass, textContent: "Província / Cidade" }),
                                input({ id: "input-company-province", type: "text", name: "companyProvince", value: viewModel.companyProvince, className: inputClass })
                            )
                        ),
                        div({ className: "grid grid-cols-1 md:grid-cols-2 gap-5" }).Append(
                            div().Append(
                                label({ htmlFor: "input-company-district", className: labelClass, textContent: "Bairro ou Distrito" }),
                                input({ id: "input-company-district", type: "text", name: "companyDistrict", value: viewModel.companyDistrict, className: inputClass })
                            ),
                            div().Append(
                                label({ htmlFor: "input-company-postal", className: labelClass, textContent: "Código Postal" }),
                                input({ id: "input-company-postal", type: "text", name: "companyPostalCode", value: viewModel.companyPostalCode, placeholder: "Ex: 1101", className: inputClass })
                            )
                        ),
                        div().Append(
                            label({ htmlFor: "input-company-street", className: labelClass, textContent: "Rua ou Avenida" }),
                            input({ id: "input-company-street", type: "text", name: "companyStreet", value: viewModel.companyStreet, placeholder: "Av. Principal, Edifício...", className: inputClass })
                        )
                    )
                )
            )
        )
    );
}

function PaymentTab(viewModel, events) {
    return div({ id: "tab-pagamento", className: "profile-tab-panel hidden" }).Append(
        div({ className: cardClass }).Append(
            div({ className: cardHeaderClass }).Append(
                h2({ className: "text-2xl font-bold text-gray-900", textContent: "Métodos de Pagamento" }),
                p({ className: "text-gray-500 mt-1", textContent: "Configure as informações bancárias a apresentar nas facturas." })
            ),
            div({ className: "p-6 lg:p-8 space-y-6" }).Append(
                div({ id: "paymentMethodsContainer", className: "space-y-6" }),
                button({
                    type: "button",
                    onclick: events.onAddPaymentMethod,
                    className: "flex items-center justify-center gap-2 w-full py-4 bg-gray-50 border-2 border-dashed border-gray-300 text-gray-500 font-semibold rounded-2xl hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-colors"
                }).Append(
                    RichElement("i", { dataset: { lucide: "plus-circle" }, className: "w-5 h-5" }),
                    span({ textContent: "Adicionar Nova Conta Bancária" })
                )
            )
        )
    );
}

export function PaymentMethodItem(events) {
    const randomId = Math.random().toString(36).substr(2, 9);
    return div({ className: "relative payment-method-item animate-fade-in border border-gray-200 p-6 rounded-2xl bg-white shadow-sm" }).Append(
        button({
            type: "button",
            onclick: events.onRemovePaymentMethod,
            className: "absolute top-4 right-4 p-2 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors focus:outline-none"
        }).Append(
            RichElement("i", { dataset: { lucide: "trash-2" }, className: "w-4 h-4" })
        ),
        div({ className: "grid grid-cols-1 gap-5" }).Append(
            div({ className: "pr-10" }).Append( // pr-10 para não encostar no botão de lixo
                label({ htmlFor: `input-title-${randomId}`, className: labelClass, textContent: "Título do Método" }),
                input({ id: `input-title-${randomId}`, type: "text", name: "paymentMethodTitle[]", placeholder: "Ex: Millennium BIM / M-Pesa", className: inputClass })
            ),
            div().Append(
                label({ htmlFor: `input-details-${randomId}`, className: labelClass, textContent: "Detalhes (NIB, Conta, Número, etc.)" }),
                textarea({ id: `input-details-${randomId}`, name: "paymentMethodDetails[]", rows: "3", placeholder: "Ex:\nNIB: 0001 0000 12345678901 23", className: inputClass })
            )
        )
    );
}

function CurrencyTab(viewModel) {
    return div({ id: "tab-moeda", className: "profile-tab-panel hidden" }).Append(
        div({ className: cardClass }).Append(
            div({ className: cardHeaderClass }).Append(
                h2({ className: "text-2xl font-bold text-gray-900", textContent: "Moeda e Impostos" }),
                p({ className: "text-gray-500 mt-1", textContent: "Defina os valores padrão para transações financeiras." })
            ),
            div({ className: "p-6 lg:p-8 space-y-6" }).Append(
                div({ className: "grid grid-cols-1 md:grid-cols-2 gap-8" }).Append(
                    // Símbolo da Moeda Fixo (Visualmente Embebido)
                    div().Append(
                        label({ className: labelClass, textContent: "Símbolo da Moeda Padrão" }),
                        div({ className: "relative mt-1.5" }).Append(
                            span({ className: "absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-bold", textContent: "MZN" }),
                            input({
                                type: "text", name: "currencySymbol", value: "Metical Moçambicano", readOnly: true,
                                className: "pl-16 pr-4 py-2.5 block w-full border border-gray-200 rounded-xl shadow-sm bg-gray-50 focus:outline-none font-semibold text-gray-600 cursor-not-allowed"
                            })
                        )
                    ),
                    // Taxa de IVA Fixa (Visualmente Embebido)
                    div().Append(
                        label({ className: labelClass, textContent: "Taxa de IVA Aplicada" }),
                        div({ className: "relative mt-1.5" }).Append(
                            span({ className: "absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-bold", textContent: "%" }),
                            input({
                                type: "text", value: `${viewModel.taxRate} (Dezasseis porcento)`, readOnly: true,
                                className: "pl-12 pr-4 py-2.5 block w-full border border-gray-200 rounded-xl shadow-sm bg-gray-50 focus:outline-none font-semibold text-gray-600 cursor-not-allowed"
                            }),
                            input({ type: "hidden", name: "taxRate", value: viewModel.taxRate })
                        )
                    )
                ),
                div({ className: "pt-4" }).Append(
                    label({ className: "relative flex items-start cursor-pointer group" }).Append(
                        div({ className: "flex items-center h-5 mt-0.5" }).Append(
                            input({ id: "pricesIncludeTax", name: "pricesIncludeTax", type: "checkbox", checked: viewModel.pricesIncludeTax, className: "h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors cursor-pointer" })
                        ),
                        div({ className: "ml-3" }).Append(
                            span({ className: "block text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors", textContent: "Os preços já incluem IVA" }),
                            span({ className: "block text-sm text-gray-500 mt-1", textContent: "Marque esta opção se os valores inseridos no inventário já contemplam o imposto." })
                        )
                    )
                )
            )
        )
    );
}

function SecurityTab() {
    return div({ id: "tab-seguranca", className: "profile-tab-panel hidden" }).Append(
        div({ className: cardClass }).Append(
            div({ className: cardHeaderClass }).Append(
                h2({ className: "text-2xl font-bold text-gray-900", textContent: "Segurança" }),
                p({ className: "text-gray-500 mt-1", textContent: "Gerencie as credenciais de acesso da conta." })
            ),
            div({ className: "p-6 lg:p-8 space-y-5 lg:w-1/2" }).Append(
                div().Append(
                    label({ htmlFor: "input-current-pass", className: labelClass, textContent: "Palavra-passe Actual" }),
                    input({ id: "input-current-pass", type: "password", name: "currentPassword", className: inputClass })
                ),
                div({ className: "pt-4" }).Append(
                    label({ htmlFor: "input-new-pass", className: labelClass, textContent: "Nova Palavra-passe" }),
                    input({ id: "input-new-pass", type: "password", name: "newPassword", className: inputClass })
                ),
                div().Append(
                    label({ htmlFor: "input-confirm-pass", className: labelClass, textContent: "Confirmar Nova Palavra-passe" }),
                    input({ id: "input-confirm-pass", type: "password", name: "confirmPassword", className: inputClass })
                )
            )
        )
    );
}

// ==========================================
// ESTADOS DA UI
// ==========================================

export function LoadingState() {
    return div({ id: "loadingScreen", className: "flex flex-col items-center justify-center w-full min-h-screen bg-gray-50" }).Append(
        div({ className: "animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4" }),
        p({ className: "text-gray-500 font-medium", textContent: "A carregar perfil da empresa..." })
    );
}

export function ProfileNotFound() {
    return div({ id: "notFoundState", className: "flex flex-col items-center justify-center w-full min-h-screen bg-gray-50 px-4 text-center" }).Append(
        div({ className: "bg-red-50 p-5 rounded-full mb-6 border border-red-100 shadow-sm" }).Append(
            RichElement("i", { dataset: { lucide: "file-warning" }, className: "w-12 h-12 text-red-500" })
        ),
        h2({ className: "text-2xl font-bold text-gray-900 mb-2", textContent: "Perfil Não Encontrado" }),
        p({ className: "text-gray-500 mb-8 max-w-sm", textContent: "Ocorreu um erro ao carregar as definições. Verifique a sua ligação ou tente novamente mais tarde." }),
        button({
            className: "px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl shadow-sm hover:bg-gray-50 transition font-medium",
            onclick: () => history.back()
        }).Append(
            span({ textContent: "Voltar Atrás" })
        )
    );
}