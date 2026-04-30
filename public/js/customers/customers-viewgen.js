import { button, div, form, h1, h3, header, input, p, span, main, nav, label, select, option, a, fieldset, RichElement } from "../vanilla-core/viewgencore.js";

export function CustomersPageLayout(mainContent) {
    return div({ className: "bg-gray-50 min-h-screen flex flex-col font-sans text-gray-900" }).Append(mainContent);
}

export function CustomersMainWidget(events) {
    return main({ id: "clientListContainer", className: "px-4 md:px-8 pb-12 flex-1 flex flex-col relative" }).Append(
        CustomersHeader(events),
        div({ className: "flex-1 flex flex-col" }).Append(
            div({ id: "clientGrid", className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" })
        )
    );
}

export function BottomLoader() {
    return div({ id: "bottomLoader", className: "col-span-full py-10 flex justify-center items-center w-full hidden" }).Append(
        div({ className: "bg-white p-3 rounded-2xl shadow-sm border border-gray-100" }).Append(
            RichElement("i", { dataset: { lucide: "loader-2" }, className: "w-6 h-6 text-blue-600 animate-spin" })
        )
    );
}

export function CustomersHeader(events) {
    // Header com layout idêntico ao de Produtos: Título à esquerda, Pesquisa ao centro, Botão à direita
    return header({ className: "mb-6 flex flex-col md:flex-row items-center gap-4 sticky top-0 z-30 bg-white backdrop-blur-sm px-4 md:px-8 py-4 -mx-4 md:-mx-8 border-b border-gray-200" }).Append(
        h1({ className: "text-2xl font-bold text-gray-800 shrink-0", textContent: "Clientes" }),

        // Pesquisa Centrada
        div({ className: "flex-1 w-full max-w-2xl mx-auto relative group" }).Append(
            span({ className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" }).Append(
                RichElement("i", { dataset: { lucide: "search" }, className: "w-5 h-5" })
            ),
            input({
                id: "searchInput", type: "text", placeholder: "Pesquisar por nome, email ou NUIT...",
                oninput: events.onSearchInput,
                className: "pl-12 pr-4 py-2.5 w-full border border-gray-300 bg-gray-50 rounded-xl shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-700"
            })
        ),

        button({
            onclick: events.onOpenNewModal,
            className: "flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition duration-200 shrink-0"
        }).Append(
            RichElement("i", { dataset: { lucide: "plus" }, className: "w-5 h-5" }),
            span({ textContent: "Novo Cliente" })
        )
    );
}

export function ClientCard(vm, events) {
    return div({ className: "bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col overflow-hidden" }).Append(
        div({ className: "p-5 flex-grow" }).Append(
            div({ className: "flex justify-between items-start mb-3 gap-2" }).Append(
                h3({ className: "text-lg font-bold text-gray-800 line-clamp-1", title: vm.name, textContent: vm.name }),
                span({ className: `flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded ${vm.badgeClass}` }).Append(
                    RichElement("i", { dataset: { lucide: vm.icon }, className: "w-3.5 h-3.5" }),
                    span({ textContent: vm.typeText })
                )
            ),
            p({ className: "text-sm text-gray-500 mb-4", title: vm.positionValue }).Append(
                span({ className: "font-medium text-gray-700", textContent: `${vm.positionLabel}: ` }),
                span({ textContent: vm.positionValue })
            ),
            div({ className: "space-y-2 text-sm" }).Append(
                div({ className: "flex items-center gap-2 text-gray-600" }).Append(
                    RichElement("i", { dataset: { lucide: "mail" }, className: "w-4 h-4 flex-shrink-0 text-gray-400" }),
                    a({ href: vm.mailto, className: "truncate hover:text-blue-600 hover:underline", title: vm.email, textContent: vm.email })
                ),
                div({ className: "flex items-center gap-2 text-gray-600" }).Append(
                    RichElement("i", { dataset: { lucide: "phone" }, className: "w-4 h-4 flex-shrink-0 text-gray-400" }),
                    a({ href: vm.tel, className: "truncate hover:text-blue-600 hover:underline", title: vm.phone, textContent: vm.phone })
                )
            )
        ),
        div({ className: "p-3 bg-gray-50 border-t border-gray-100 flex gap-2" }).Append(
            button({
                onclick: () => events.onEditClient(vm.id),
                className: "flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition duration-200 text-sm"
            }).Append(
                RichElement("i", { dataset: { lucide: "pencil" }, className: "w-4 h-4" }),
                span({ textContent: "Editar" })
            )
        )
    );
}

export function EmptyStateGrid() {
    return div({ className: "p-12 text-center w-full col-span-full" }).Append(
        div({ className: "flex flex-col items-center justify-center bg-white border border-gray-200 rounded-2xl py-16 shadow-sm" }).Append(
            RichElement("i", { dataset: { lucide: "users" }, className: "w-16 h-16 text-gray-300 mb-4" }),
            h3({ className: "text-xl font-bold text-gray-700", textContent: "Nenhum Cliente Encontrado" }),
            p({ className: "text-gray-500 mt-2", textContent: "Tente ajustar a sua pesquisa ou adicione um novo cliente." })
        )
    );
}

export function ClientModal(events) {
    return div({
        id: "clientModal",
        onclick: events.onBackdropClick,
        className: "fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50 transition-opacity"
    }).Append(
        div({
            id: "clientModalPanel",
            className: "bg-white w-full max-w-4xl h-full max-h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-auto transition-transform transform scale-95"
        }).Append(

            header({ className: "p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-20" }).Append(
                div({ className: "flex items-center gap-3" }).Append(
                    button({
                        id: "saveButtonHeader",
                        type: "button",
                        onclick: () => $('clientForm').requestSubmit(),
                        className: "px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200",
                        textContent: "Guardar Cliente"
                    }),
                    button({ type: "button", onclick: events.onRequestClose, className: "px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition duration-200", textContent: "Cancelar" })
                ),
                button({ type: "button", onclick: events.onRequestClose, className: "text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-lg transition-colors" }).Append(
                    RichElement("i", { dataset: { lucide: "x" }, className: "w-5 h-5" })
                )
            ),

            form({ id: "clientForm", onsubmit: events.onSaveModal, oninput: events.onFormInput, className: "flex-grow p-6 overflow-y-auto" }).Append(

                div({ className: "border-b border-gray-200 mb-6" }).Append(
                    nav({ className: "-mb-px flex space-x-6" }).Append(
                        // CORREÇÃO: Remoção de 'dataset'. Utilização de 'id'.
                        button({ type: "button", id: "btn-tab-general", onclick: (e) => events.onSwitchTab('general', e.currentTarget), className: "tab-button whitespace-nowrap py-3 px-1 font-medium text-sm border-b-2 border-blue-600 text-blue-600 transition-colors", textContent: "Informação Principal" }),
                        button({ type: "button", id: "btn-tab-address", onclick: (e) => events.onSwitchTab('address', e.currentTarget), className: "tab-button whitespace-nowrap py-3 px-1 font-medium text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors", textContent: "Morada" })
                    )
                ),

                div({ id: "tab-general", className: "tab-panel space-y-6 block" }).Append(
                    div().Append(
                        label({ className: "block text-sm font-medium text-gray-700 mb-2", textContent: "Tipo de Cliente" }),
                        fieldset({ className: "mt-2" }).Append(
                            div({ className: "flex items-center space-x-6" }).Append(
                                div({ className: "flex items-center gap-2 cursor-pointer" }).Append(
                                    input({ id: "type-pessoa", name: "clientType", type: "radio", value: "pessoa", onchange: events.onTypeChange, className: "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer" }),
                                    label({ htmlFor: "type-pessoa", className: "text-sm text-gray-700 cursor-pointer", textContent: "Pessoa Singular" })
                                ),
                                div({ className: "flex items-center gap-2 cursor-pointer" }).Append(
                                    input({ id: "type-empresa", name: "clientType", type: "radio", value: "empresa", onchange: events.onTypeChange, className: "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer", checked: true }),
                                    label({ htmlFor: "type-empresa", className: "text-sm text-gray-700 cursor-pointer", textContent: "Empresa" })
                                )
                            )
                        )
                    ),
                    div().Append(
                        label({ htmlFor: "clientName", className: "block text-sm font-medium text-gray-700", textContent: "Nome / Razão Social" }),
                        input({ type: "text", id: "clientName", name: "clientName", required: true, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                    ),
                    div({ id: "jobPositionContainer", className: "hidden transition-all duration-300" }).Append(
                        label({ htmlFor: "jobPosition", className: "block text-sm font-medium text-gray-700", textContent: "Posição / Cargo" }),
                        input({ type: "text", id: "jobPosition", name: "jobPosition", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                    ),
                    div({ className: "grid grid-cols-1 md:grid-cols-2 gap-6" }).Append(
                        div().Append(label({ htmlFor: "clientEmail", className: "block text-sm font-medium text-gray-700", textContent: "Email" }), input({ type: "email", id: "clientEmail", name: "clientEmail", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })),
                        div().Append(label({ htmlFor: "clientPhone", className: "block text-sm font-medium text-gray-700", textContent: "Telefone" }), input({ type: "tel", id: "clientPhone", name: "clientPhone", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" }))
                    ),
                    div({ className: "grid grid-cols-1 md:grid-cols-2 gap-6" }).Append(
                        div().Append(label({ htmlFor: "clientNuit", className: "block text-sm font-medium text-gray-700", textContent: "NUIT" }), input({ type: "text", id: "clientNuit", name: "clientNuit", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })),
                        div().Append(label({ htmlFor: "clientWebsite", className: "block text-sm font-medium text-gray-700", textContent: "Website" }), input({ type: "url", id: "clientWebsite", name: "clientWebsite", placeholder: "https://", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" }))
                    ),
                    div().Append(
                        label({ htmlFor: "clientLanguage", className: "block text-sm font-medium text-gray-700", textContent: "Idioma" }),
                        select({ id: "clientLanguage", name: "clientLanguage", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" }).Append(
                            option({ value: "pt", textContent: "Português" }), option({ value: "en", textContent: "Inglês" })
                        )
                    )
                ),

                div({ id: "tab-address", className: "tab-panel hidden space-y-6" }).Append(
                    div().Append(label({ htmlFor: "addressStreet", className: "block text-sm font-medium text-gray-700", textContent: "Avenida / Rua" }), input({ type: "text", id: "addressStreet", name: "addressStreet", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })),
                    div({ className: "grid grid-cols-1 md:grid-cols-2 gap-6" }).Append(
                        div().Append(label({ htmlFor: "addressZip", className: "block text-sm font-medium text-gray-700", textContent: "Código Postal" }), input({ type: "text", id: "addressZip", name: "addressZip", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })),
                        div().Append(label({ htmlFor: "addressDistrict", className: "block text-sm font-medium text-gray-700", textContent: "Bairro / Distrito" }), input({ type: "text", id: "addressDistrict", name: "addressDistrict", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" }))
                    ),
                    div({ className: "grid grid-cols-1 md:grid-cols-2 gap-6" }).Append(
                        div().Append(label({ htmlFor: "addressState", className: "block text-sm font-medium text-gray-700", textContent: "Província" }), input({ type: "text", id: "addressState", name: "addressState", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })),
                        div().Append(label({ htmlFor: "addressCountry", className: "block text-sm font-medium text-gray-700", textContent: "País" }), input({ type: "text", id: "addressCountry", name: "addressCountry", value: "Moçambique", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" }))
                    )
                )
            )
        )
    );
}

export function ConfirmExitModal(events) {
    return div({ id: "confirmExitModal", className: "fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 hidden z-[60]" }).Append(
        div({ className: "bg-white w-full max-w-md rounded-xl shadow-2xl p-6" }).Append(
            h3({ className: "text-lg font-bold text-gray-900", textContent: "Sair sem Guardar?" }),
            p({ className: "text-gray-600 mt-2", textContent: "Tem a certeza de que quer fechar? Todas as alterações não guardadas serão perdidas." }),
            div({ className: "flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100" }).Append(
                button({ onclick: events.onCancelExit, className: "px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors", textContent: "Continuar a Editar" }),
                button({ onclick: events.onConfirmExit, className: "px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow-sm hover:bg-red-700 transition-colors", textContent: "Sair" })
            )
        )
    );
}