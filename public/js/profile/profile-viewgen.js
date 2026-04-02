import { div, span, header, main, aside, nav, form, h1, h2, h3, p, button, label, input, textarea, RichElement } from "../vanilla-core/viewgencore.js";

export function ProfileHeader(viewModel, events) {
    return header({ className: "flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30 bg-gray-100 shadow-sm px-4 md:px-8 py-4" }).Append(
        h1({ className: "text-3xl font-bold text-gray-800", textContent: "Perfil" }),
        div({ className: "w-full md:w-auto flex flex-col md:flex-row gap-2" }).Append(
            button({
                id: "saveProfileButton",
                type: "button", // Passa a ser button para não submeter sozinho
                onclick: events.onTriggerSave, // Novo evento
                className: "flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
            }).Append(
                SaveButtonDefault()
            )
        )
    );
}

// Estados do botão isolados na Viewgen
export function SaveButtonDefault() {
    return div({ className: "flex items-center gap-2 pointer-events-none" }).Append(
        RichElement("i", { dataset: { lucide: "save" }, className: "w-5 h-5" }),
        span({ textContent: "Guardar Alterações" })
    );
}

export function SaveButtonSuccess() {
    return div({ className: "flex items-center gap-2 pointer-events-none" }).Append(
        RichElement("i", { dataset: { lucide: "check" }, className: "w-5 h-5" }),
        span({ textContent: "Guardado!" })
    );
}

export function ProfileMain(viewModel, events) {
    return main({ className: "py-8 px-4 md:px-8" }).Append(
        div({ className: "md:flex gap-8" }).Append(
            ProfileSidebar(events),
            div({ className: "md:w-2/3" }).Append(
                form({ id: "profileForm", onsubmit: events.onSave }).Append(
                    CompanyTab(viewModel, events),
                    PaymentTab(viewModel, events),
                    CurrencyTab(viewModel),
                    SecurityTab()
                )
            )
        )
    );
}

function ProfileSidebar(events) {
    return aside({ className: "md:w-1/4 mb-6 md:mb-0 sticky top-[120px] md:top-[68px] z-20 md:self-start bg-gray-100" }).Append(
        nav({ className: "flex flex-row md:flex-col gap-3 md:space-y-3 overflow-x-auto pb-4 md:pb-0" }).Append(
            TabLink("empresa", "building-2", "Informações da Empresa", true, events.onTabClick),
            TabLink("pagamento", "landmark", "Métodos de Pagamento", false, events.onTabClick),
            TabLink("moeda", "coins", "Moeda e Impostos", false, events.onTabClick),
            TabLink("seguranca", "shield-check", "Segurança", false, events.onTabClick)
        )
    );
}

function TabLink(tabId, iconName, labelText, isActive, onClick) {
    return RichElement("a", {
        href: "#",
        dataset: { tab: tabId },
        onclick: (e) => onClick(e, tabId),
        className: `profile-nav-link ${isActive ? 'active' : ''} group flex flex-col items-center gap-3 px-4 py-6 text-base font-semibold text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 rounded-lg transition-all w-36 md:w-full flex-shrink-0`
    }).Append(
        RichElement("i", { dataset: { lucide: iconName }, className: "w-8 h-8 text-gray-500 group-hover:text-gray-800" }),
        span({ className: "text-center", textContent: labelText })
    );
}

function CompanyTab(viewModel, events) {
    return div({ id: "tab-empresa", className: "profile-tab-panel block" }).Append(
        div({ className: "bg-white rounded-lg shadow-md" }).Append(
            div({ className: "p-6 border-b sticky top-[240px] md:top-[68px] bg-white z-10 rounded-t-lg" }).Append(
                h2({ className: "text-xl font-semibold text-gray-800", textContent: "Informações da Empresa" }),
                p({ className: "text-gray-500 mt-1", textContent: "Dados fiscais e de localização da sua empresa." })
            ),
            div({ className: "p-6 space-y-6" }).Append(
                div({ className: "flex flex-col lg:flex-row gap-6" }).Append(
                    div({ className: "lg:w-1/3" }).Append(
                        label({ className: "block text-sm font-medium text-gray-700 mb-1", textContent: "Logotipo" }),
                        input({ type: "file", id: "logoImageInput", onchange: events.onLogoUpload, className: "hidden", accept: "image/*" }),
                        label({ htmlFor: "logoImageInput", className: "image-upload-area cursor-pointer flex flex-col items-center justify-center w-full h-40 rounded-lg bg-gray-50 text-gray-400 hover:text-blue-600 transition" }).Append(
                            div({ id: "logoPreview", className: "w-full h-full rounded-lg flex flex-col items-center justify-center" }).Append(
                                div({ id: "logoUploadIcon", className: "flex flex-col items-center" }).Append(
                                    RichElement("i", { dataset: { lucide: "upload-cloud" }, className: "w-10 h-10" }),
                                    span({ className: "mt-2 text-sm font-medium", textContent: "Carregar logotipo" })
                                )
                            )
                        )
                    ),
                    div({ className: "lg:w-2/3 space-y-4" }).Append(
                        div({ className: "grid grid-cols-1 lg:grid-cols-2 gap-4" }).Append(
                            div().Append(
                                label({ className: "block text-sm font-medium text-gray-700", textContent: "Nome da Empresa" }),
                                input({ type: "text", name: "companyName", value: viewModel.companyName, placeholder: "O nome legal da sua empresa", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                            ),
                            div().Append(
                                label({ className: "block text-sm font-medium text-gray-700", textContent: "NUIT" }),
                                input({ type: "text", name: "companyNuit", value: viewModel.companyNuit, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                            )
                        ),
                        div({ className: "grid grid-cols-1 lg:grid-cols-3 gap-4" }).Append(
                            div().Append(
                                label({ className: "block text-sm font-medium text-gray-700", textContent: "Email" }),
                                input({ type: "email", name: "companyEmail", value: viewModel.companyEmail, placeholder: "contacto@empresa.com", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                            ),
                            div().Append(
                                label({ className: "block text-sm font-medium text-gray-700", textContent: "Telefone" }),
                                input({ type: "tel", name: "companyPhone", value: viewModel.companyPhone, placeholder: "+258 84 123 4567", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                            ),
                            div().Append(
                                label({ className: "block text-sm font-medium text-gray-700", textContent: "Fax" }),
                                input({ type: "tel", name: "companyFax", value: viewModel.companyFax, placeholder: "(Opcional)", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                            )
                        )
                    )
                ),
                div({ className: "pt-6 border-t border-gray-200 mt-6" }).Append(
                    h3({ className: "text-md font-medium text-gray-800", textContent: "Endereço Fiscal" }),
                    div({ className: "mt-4 space-y-4" }).Append(
                        div({ className: "grid grid-cols-1 md:grid-cols-2 gap-4" }).Append(
                            div().Append(
                                label({ className: "block text-sm font-medium text-gray-700", textContent: "País" }),
                                input({ type: "text", name: "companyCountry", value: viewModel.companyCountry, readOnly: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 focus:outline-none" })
                            ),
                            div().Append(
                                label({ className: "block text-sm font-medium text-gray-700", textContent: "Província" }),
                                input({ type: "text", name: "companyProvince", value: viewModel.companyProvince, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                            )
                        ),
                        div({ className: "grid grid-cols-1 md:grid-cols-2 gap-4" }).Append(
                            div().Append(
                                label({ className: "block text-sm font-medium text-gray-700", textContent: "Bairro ou Distrito" }),
                                input({ type: "text", name: "companyDistrict", value: viewModel.companyDistrict, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                            ),
                            div().Append(
                                label({ className: "block text-sm font-medium text-gray-700", textContent: "Código Postal" }),
                                input({ type: "text", name: "companyPostalCode", value: viewModel.companyPostalCode, placeholder: "Ex: 1101", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                            )
                        ),
                        div().Append(
                            label({ className: "block text-sm font-medium text-gray-700", textContent: "Rua ou Avenida" }),
                            input({ type: "text", name: "companyStreet", value: viewModel.companyStreet, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                        )
                    )
                )
            )
        )
    );
}

function PaymentTab(viewModel, events) {
    return div({ id: "tab-pagamento", className: "profile-tab-panel hidden" }).Append(
        div({ className: "bg-white rounded-lg shadow-md" }).Append(
            div({ className: "p-6 border-b sticky top-[240px] md:top-[68px] bg-white z-10 rounded-t-lg" }).Append(
                h2({ className: "text-xl font-semibold text-gray-800", textContent: "Métodos de Pagamento" }),
                p({ className: "text-gray-500 mt-1", textContent: "Configure as informações bancárias a apresentar nas facturas." })
            ),
            div({ className: "p-6 space-y-4" }).Append(
                div({ id: "paymentMethodsContainer", className: "space-y-5" }),
                button({
                    type: "button",
                    onclick: events.onAddPaymentMethod,
                    className: "flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
                }).Append(
                    RichElement("i", { dataset: { lucide: "plus" }, className: "w-4 h-4" }),
                    span({ textContent: "Adicionar Método de Pagamento" })
                )
            )
        )
    );
}

function CurrencyTab(viewModel) {
    return div({ id: "tab-moeda", className: "profile-tab-panel hidden" }).Append(
        div({ className: "bg-white rounded-lg shadow-md" }).Append(
            div({ className: "p-6 border-b sticky top-[240px] md:top-[68px] bg-white z-10 rounded-t-lg" }).Append(
                h2({ className: "text-xl font-semibold text-gray-800", textContent: "Moeda e Impostos" }),
                p({ className: "text-gray-500 mt-1", textContent: "Defina a sua moeda principal e taxas de imposto." })
            ),
            div({ className: "p-6 space-y-4" }).Append(
                div().Append(
                    label({ className: "block text-sm font-medium text-gray-700", textContent: "Símbolo da Moeda" }),
                    input({ type: "text", name: "currencySymbol", value: viewModel.currencySymbol, className: "mt-1 block w-full md:w-2/3 lg:w-1/3 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                ),
                div().Append(
                    label({ className: "block text-sm font-medium text-gray-700", textContent: "Taxa de IVA Padrão (%)" }),
                    p({ className: "mt-1 block w-full md:w-2/3 lg:w-1/3 rounded-md py-2 px-3 bg-gray-100 text-gray-600 border border-gray-200 font-medium", textContent: `${viewModel.taxRate}%` }),
                    input({ type: "hidden", name: "taxRate", value: viewModel.taxRate })
                ),
                div({ className: "relative flex items-start" }).Append(
                    div({ className: "flex items-center h-5" }).Append(
                        input({ id: "pricesIncludeTax", name: "pricesIncludeTax", type: "checkbox", checked: viewModel.pricesIncludeTax, className: "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" })
                    ),
                    div({ className: "ml-3 text-sm" }).Append(
                        label({ htmlFor: "pricesIncludeTax", className: "font-medium text-gray-700", textContent: "Os preços dos produtos já incluem IVA" })
                    )
                )
            )
        )
    );
}

function SecurityTab() {
    return div({ id: "tab-seguranca", className: "profile-tab-panel hidden" }).Append(
        div({ className: "bg-white rounded-lg shadow-md" }).Append(
            div({ className: "p-6 border-b sticky top-[240px] md:top-[68px] bg-white z-10 rounded-t-lg" }).Append(
                h2({ className: "text-xl font-semibold text-gray-800", textContent: "Segurança" }),
                p({ className: "text-gray-500 mt-1", textContent: "Altere a sua palavra-passe." })
            ),
            div({ className: "p-6 space-y-4" }).Append(
                div().Append(
                    label({ className: "block text-sm font-medium text-gray-700", textContent: "Palavra-passe Actual" }),
                    input({ type: "password", name: "currentPassword", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                ),
                div().Append(
                    label({ className: "block text-sm font-medium text-gray-700", textContent: "Nova Palavra-passe" }),
                    input({ type: "password", name: "newPassword", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                ),
                div().Append(
                    label({ className: "block text-sm font-medium text-gray-700", textContent: "Confirmar Nova Palavra-passe" }),
                    input({ type: "password", name: "confirmPassword", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                )
            )
        )
    );
}

export function PaymentMethodItem(events) {
    return div({ className: "relative payment-method-item animate-fade-in border p-4 rounded-lg bg-gray-50" }).Append(
        button({
            type: "button",
            onclick: events.onRemovePaymentMethod,
            className: "absolute top-3 right-3 p-1.5 bg-gray-100 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
        }).Append(
            RichElement("i", { dataset: { lucide: "trash-2" }, className: "w-4 h-4" })
        ),
        div({ className: "grid grid-cols-1 gap-4" }).Append(
            div().Append(
                label({ className: "block text-sm font-medium text-gray-700", textContent: "Título do Método" }),
                input({ type: "text", name: "paymentMethodTitle[]", placeholder: "Ex: Transferência Bancária (BIM) ou M-Pesa", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
            ),
            div().Append(
                label({ className: "block text-sm font-medium text-gray-700", textContent: "Detalhes (NIB, Conta, Número, etc.)" }),
                textarea({ name: "paymentMethodDetails[]", rows: "4", placeholder: "Ex:\nNome do Banco: Millennium BIM\nNIB: 0001 0000 12345678901 23", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
            )
        )
    );
}

export function LoadingState() {
    return div({
        id: "loadingScreen",
        className: "flex flex-col items-center justify-center w-full min-h-screen"
    }).Append(
        div({ className: "animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4" }),
        p({ className: "text-gray-500 font-medium", textContent: "A carregar o perfil da empresa..." })
    );
}

export function ProfileNotFound() {
    return div({
        id: "notFoundState",
        className: "flex flex-col items-center justify-center w-full min-h-screen bg-gray-50 px-4 text-center"
    }).Append(
        div({ className: "bg-red-100 p-4 rounded-full mb-6" }).Append(
            RichElement("i", { dataset: { lucide: "file-warning" }, className: "w-12 h-12 text-red-600" })
        ),
        h2({ className: "text-2xl font-bold text-gray-800 mb-2", textContent: "Perfil Não Encontrado" }),
        p({ className: "text-gray-500 mb-6", textContent: "Ocorreu um erro ao localizar o perfil." }),
        button({
            className: "px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium",
            onclick: () => history.back()
        }).Append(
            span({ textContent: "Voltar Atrás" })
        )
    );
}