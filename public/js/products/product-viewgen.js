import {
    button, div, form, h1, h2, h3, header, img, input, p, span,
    i, main, nav, footer, label, textarea, fieldset, hr, select, option, RichElement
} from "../vanilla-core/viewgencore.js";

// ==========================================
// 1. LAYOUT & ESTADOS DA PÁGINA
// ==========================================

export function ProductsPageLayout(mainContent) {
    return div({ className: "flex bg-gray-100 min-h-screen" }).Append(
        div({ className: "flex-1 ml-20" }).Append(
            div({ id: "app" }).Append(
                mainContent
            )
        )
    );
}

export function LoadingState() {
    return div({ className: "flex items-center justify-center h-screen w-full" }).Append(
        div({ className: "flex flex-col items-center gap-3" }).Append(
            RichElement("i", { dataset: { lucide: "loader-2" }, className: "w-8 h-8 text-blue-600 animate-spin" }),
            p({ className: "text-lg text-gray-600 font-medium", textContent: "A carregar produtos..." })
        )
    );
}

export function ProductErrorState(error) {
    return div({ className: "flex items-center justify-center h-screen w-full" }).Append(
        div({ className: "text-center max-w-md p-6 bg-white rounded-xl shadow-lg" }).Append(
            RichElement("i", { dataset: { lucide: "alert-circle" }, className: "w-12 h-12 text-red-500 mx-auto mb-4" }),
            h2({ className: "text-2xl font-bold text-gray-800 mb-2", textContent: "Oops! Algo correu mal." }),
            p({ className: "text-gray-600", textContent: error.message || "Não foi possível carregar a página de produtos." })
        )
    );
}

// ==========================================
// 2. WIDGET PRINCIPAL (GRELHA + HEADER)
// ==========================================

export function ProductMainWidget(events) {
    return main({ id: "productListContainer", className: "px-4 md:px-8" }).Append(
        ProductPageHeader(events),
        div({ id: "productGrid", className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" })
    );
}

export function ProductPageHeader(events) {
    return header({ className: "mb-6 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30 bg-gray-100 shadow-sm px-4 md:px-8 py-4 -mx-4 md:-mx-8" }).Append(
        h1({ className: "text-3xl font-bold text-gray-800", textContent: "Produtos" }),
        div({ className: "w-full md:w-auto flex flex-col md:flex-row gap-2" }).Append(
            div({ className: "relative w-full md:w-80" }).Append(
                span({ className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }).Append(
                    RichElement("i", { dataset: { lucide: "search" }, className: "w-5 h-5" })
                ),
                input({
                    id: "searchInput",
                    type: "text",
                    placeholder: "Pesquisar produtos...",
                    className: "pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                    oninput: events.onSearchInput
                })
            ),
            button({
                id: "showModalButton",
                className: "flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200",
                onclick: events.onOpenNewModal
            }).Append(
                RichElement("i", { dataset: { lucide: "plus" }, className: "w-5 h-5" }),
                span({ textContent: "Adicionar Produto" })
            )
        )
    );
}

export function ProductCard(viewModel, events) {
    return div({ className: "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl" }).Append(
        img({ src: viewModel.imgSrc, alt: viewModel.name, className: "w-full h-48 object-cover" }),
        div({ className: "p-4" }).Append(
            h3({ className: "text-lg font-semibold text-gray-800 truncate", textContent: viewModel.name }),
            p({ className: "text-2xl font-bold text-blue-600 mt-2", textContent: viewModel.priceFormatted }),
            p({ className: `text-sm font-medium ${viewModel.stockColor} mt-1`, textContent: viewModel.stockText }),
            button({
                className: "edit-button mt-4 w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition duration-200",
                onclick: () => events.onEditProduct(viewModel.id),
                textContent: "Editar"
            })
        )
    );
}

export function EmptyState() {
    return p({ className: "text-gray-500 col-span-full text-center py-10", textContent: "Nenhum produto encontrado." });
}

// ==========================================
// 3. MODAIS
// ==========================================

export function ConfirmExitModal(events) {
    return div({ id: "confirmExitModal", className: "fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 hidden z-[60]" }).Append(
        div({ className: "bg-white w-full max-w-md rounded-xl shadow-2xl p-6" }).Append(
            h3({ className: "text-lg font-bold text-gray-800", textContent: "Sair sem Guardar?" }),
            p({ className: "text-gray-600 mt-2", textContent: "Tem a certeza de que quer fechar? Todas as alterações não guardadas serão perdidas." }),
            div({ className: "flex justify-end gap-3 mt-6" }).Append(
                button({
                    id: "cancelExitButton",
                    className: "px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50",
                    onclick: events.onCancelExit,
                    textContent: "Continuar a Editar"
                }),
                button({
                    id: "confirmExitButton",
                    className: "px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700",
                    onclick: events.onConfirmExit,
                    textContent: "Sair"
                })
            )
        )
    );
}

import { formatCurrency } from "./product-math.js";

export function createProductCardViewModel(product) {
    const hasStock = product.onHand !== null;
    const stockText = hasStock ? `${product.onHand} em mão` : 'Serviço/Sob Demanda';

    let stockColor = 'text-gray-500';

    if (hasStock) {
        if (product.onHand > 20) stockColor = 'text-green-600';
        else if (product.onHand > 0) stockColor = 'text-yellow-600';
        else stockColor = 'text-red-600';
    }

    return {
        id: product.id,
        name: product.name,
        priceFormatted: formatCurrency(product.price),
        stockText: stockText,
        stockColor: stockColor,
        imgSrc: product.img || 'https://placehold.co/400x400/CCCCCC/333333?text=Imagem+Indisponível'
    };
}

export function createProductListViewModel(products) {
    return products.map(createProductCardViewModel);
}

export function ProductModal(events) {
    return div({ id: "productModal", className: "fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50", onclick: events.onBackdropClick }).Append(

        // 1. O painel principal (que engloba o Header, Corpo e Footer) passa a ser a tag <form>
        form({ id: "productForm", className: "bg-white w-full max-w-4xl h-full max-h-[95vh] rounded-xl shadow-2xl flex flex-col overflow-auto" }).Append(

            // CABEÇALHO DO MODAL
            header({ className: "p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10" }).Append(
                div({ className: "flex items-center gap-3" }).Append(
                    // Botão tipo "submit" dentro do formulário não precisa do atributo 'form'
                    button({ id: "saveButtonHeader", type: "submit", className: "px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200", textContent: "Guardar Produto" }),
                    button({ id: "cancelButtonHeader", type: "button", className: "px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition duration-200", textContent: "Cancelar" })
                ),
                button({ id: "closeModalButton", type: "button", className: "text-gray-400 hover:text-gray-600" }).Append(
                    RichElement("i", { dataset: { lucide: "x" }, className: "w-6 h-6" })
                )
            ),

            // CORPO DO MODAL (passa a ser uma div com scroll)
            div({ className: "flex-grow p-6 overflow-y-auto" }).Append(
                ProductTabsNav(),
                ProductFormGeneralTab(),
                ProductFormVariantsTab(),
                ProductFormPricingTab(),
                ProductFormInventoryTab()
            ),

            // RODAPÉ DO MODAL
            footer({ className: "p-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-gray-50 z-10" }).Append(
                button({ id: "cancelButton", type: "button", className: "px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition duration-200", textContent: "Cancelar" }),
                // Botão tipo "submit" sem a necessidade do atributo 'form'
                button({ id: "saveButton", type: "submit", className: "px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200", textContent: "Guardar Produto" })
            )
        )
    );
} 

// ==========================================
// 4. SUBCOMPONENTES DO FORMULÁRIO
// ==========================================

function ProductTabsNav() {
    return div({ className: "border-b border-gray-200 mb-6" }).Append(
        RichElement("nav", { className: "-mb-px flex space-x-6" }).Append(
            RichElement("button", { type: "button", dataset: { tab: "general" }, className: "tab-button whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-blue-500 text-blue-600", textContent: "Informação Geral" }),
            RichElement("button", { type: "button", dataset: { tab: "variants" }, className: "tab-button whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300", textContent: "Atributos e Variantes" }),
            RichElement("button", { type: "button", dataset: { tab: "pricing" }, className: "tab-button whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300", textContent: "Preços por Quantidade" }),
            RichElement("button", { type: "button", dataset: { tab: "inventory" }, className: "tab-button whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300", textContent: "Inventário" })
        )
    );
}

function ProductFormGeneralTab() {
    return div({ id: "tab-general", className: "tab-panel space-y-6" }).Append(

        // Categoria, SKU e EAN
        div({ className: "grid grid-cols-1 md:grid-cols-3 gap-6" }).Append(
            div().Append(
                label({ htmlFor: "category", className: "block text-sm font-medium text-gray-700", textContent: "Categoria" }),
                input({ type: "text", id: "category", name: "category", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
            ),
            div().Append(
                label({ htmlFor: "reference", className: "block text-sm font-medium text-gray-700", textContent: "Referência (SKU)" }),
                input({ type: "text", id: "reference", name: "reference", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
            ),
            div().Append(
                label({ htmlFor: "barcode", className: "block text-sm font-medium text-gray-700", textContent: "Código de Barras (EAN)" }),
                input({ type: "text", id: "barcode", name: "barcode", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
            )
        ),

        hr({ className: "border-gray-200" }),

        // Imagem, Nome e Descrição
        div({ className: "grid grid-cols-1 md:grid-cols-3 gap-6" }).Append(
            div({ className: "md:col-span-1" }).Append(
                label({ className: "block text-sm font-medium text-gray-700 mb-1", textContent: "Imagem do Produto" }),
                input({ type: "file", id: "productImageInput", className: "hidden", accept: "image/*" }),
                label({ htmlFor: "productImageInput", className: "image-upload-area cursor-pointer flex flex-col items-center justify-center w-full h-48 rounded-lg bg-gray-50 text-gray-400 hover:text-blue-600 transition" }).Append(
                    div({ id: "imagePreview", className: "w-full h-full rounded-lg flex flex-col items-center justify-center bg-center bg-cover" }).Append(
                        div({ id: "uploadIcon", className: "flex flex-col items-center" }).Append(
                            RichElement("i", { dataset: { lucide: "upload-cloud" }, className: "w-12 h-12" }),
                            span({ className: "mt-2 text-sm font-medium", textContent: "Carregar imagem" })
                        )
                    )
                )
            ),
            div({ className: "md:col-span-2 space-y-6" }).Append(
                div().Append(
                    label({ htmlFor: "productName", className: "block text-sm font-medium text-gray-700", textContent: "Nome do Produto" }),
                    input({ type: "text", id: "productName", name: "productName", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                ),
                div().Append(
                    label({ htmlFor: "productDescription", className: "block text-sm font-medium text-gray-700", textContent: "Descrição" }),
                    textarea({ id: "productDescription", name: "productDescription", rows: 5, className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                )
            )
        ),

        // Tipo de Produto
        div().Append(
            label({ className: "block text-sm font-medium text-gray-700", textContent: "Tipo de Produto" }),
            fieldset({ className: "mt-2" }).Append(
                div({ className: "flex items-center space-x-6" }).Append(
                    div({ className: "flex items-center gap-2" }).Append(
                        input({ id: "type-mercadoria", name: "productType", type: "radio", value: "mercadoria", className: "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500", checked: true }),
                        label({ htmlFor: "type-mercadoria", className: "text-sm text-gray-700", textContent: "Mercadoria" })
                    ),
                    div({ className: "flex items-center gap-2" }).Append(
                        input({ id: "type-servico", name: "productType", type: "radio", value: "servico", className: "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" }),
                        label({ htmlFor: "type-servico", className: "text-sm text-gray-700", textContent: "Serviço" })
                    ),
                    div({ className: "flex items-center gap-2" }).Append(
                        input({ id: "type-combo", name: "productType", type: "radio", value: "combo", className: "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" }),
                        label({ htmlFor: "type-combo", className: "text-sm text-gray-700", textContent: "Combo" })
                    )
                )
            )
        ),

        // Preço e Custo
        div({ className: "grid grid-cols-1 md:grid-cols-2 gap-6" }).Append(
            div().Append(
                label({ htmlFor: "salesPrice", className: "block text-sm font-medium text-gray-700", textContent: "Preço de Venda" }),
                div({ className: "relative mt-1" }).Append(
                    span({ className: "absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500", textContent: "MZN" }),
                    input({ type: "number", id: "salesPrice", name: "salesPrice", className: "pl-12 pr-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                )
            ),
            div().Append(
                label({ htmlFor: "costPrice", className: "block text-sm font-medium text-gray-700", textContent: "Custo" }),
                div({ className: "relative mt-1" }).Append(
                    span({ className: "absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500", textContent: "MZN" }),
                    input({ type: "number", id: "costPrice", name: "costPrice", className: "pl-12 pr-3 py-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                )
            )
        ),

        // Rastreio de Stock e Unidade de Medida
        div({ className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-2" }).Append(
            div({ className: "space-y-6" }).Append(
                div({ className: "relative flex items-start" }).Append(
                    div({ className: "flex items-center h-5" }).Append(
                        input({ id: "trackInventory", name: "trackInventory", type: "checkbox", className: "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500", checked: true })
                    ),
                    div({ className: "ml-3 text-sm" }).Append(
                        label({ htmlFor: "trackInventory", className: "font-medium text-gray-700", textContent: "Rastrear inventário" }),
                        p({ className: "text-gray-500", textContent: "Produtos cujo estoque é administrado." })
                    )
                ),
                div().Append(
                    label({ htmlFor: "quantityOnHand", className: "block text-sm font-medium text-gray-700", textContent: "Quantidade Em Mão" }),
                    input({ type: "number", id: "quantityOnHand", name: "quantityOnHand", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
                )
            ),
            div({ className: "space-y-4" }).Append(
                div().Append(
                    label({ className: "block text-sm font-medium text-gray-700", textContent: "Unidade de Medida" }),
                    p({ className: "text-xs text-gray-500 mb-2", textContent: "Como este produto é medido e vendido?" }),
                    fieldset().Append(
                        div({ className: "flex flex-col space-y-3" }).Append(
                            div({ className: "flex items-center gap-2" }).Append(
                                input({ id: "measure-unit", name: "measureUnit", type: "radio", value: "unidade", className: "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500", checked: true }),
                                label({ htmlFor: "measure-unit", className: "text-sm text-gray-700", textContent: "Unidade (Ex: Peça, Caixa)" })
                            ),
                            div({ className: "flex items-center gap-2" }).Append(
                                input({ id: "measure-weight", name: "measureUnit", type: "radio", value: "peso", className: "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" }),
                                label({ htmlFor: "measure-weight", className: "text-sm text-gray-700", textContent: "Peso (Ex: Kg, g - Requer balança)" })
                            ),
                            div({ className: "flex items-center gap-2" }).Append(
                                input({ id: "measure-length", name: "measureUnit", type: "radio", value: "metro", className: "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" }),
                                label({ htmlFor: "measure-length", className: "text-sm text-gray-700", textContent: "Comprimento (Ex: Metro, cm)" })
                            )
                        )
                    )
                )
            )
        )
    );
}

function ProductFormVariantsTab() {
    return div({ id: "tab-variants", className: "tab-panel hidden space-y-6" }).Append(
        div({ className: "p-4 bg-blue-50 border border-blue-200 rounded-lg" }).Append(
            p({ className: "text-sm text-blue-700", textContent: "Adicione atributos como Cor ou Tamanho para criar variações do seu produto. Cada variação pode ter seu próprio SKU, preço e estoque." })
        ),
        div().Append(
            label({ htmlFor: "attributeSelector", className: "block text-sm font-medium text-gray-700", textContent: "Adicionar Atributo" }),
            div({ className: "mt-1 flex gap-2" }).Append(
                select({ id: "attributeSelector", className: "block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" }).Append(
                    option({ value: "cor", textContent: "Cor" }),
                    option({ value: "tamanho", textContent: "Tamanho" }),
                    option({ value: "material", textContent: "Material" }),
                    option({ value: "genero", textContent: "Gênero" }),
                    option({ value: "marca", textContent: "Marca" })
                ),
                button({ type: "button", id: "addAttributeButton", className: "px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300", textContent: "Adicionar" })
            )
        ),
        div({ id: "attributesContainer", className: "space-y-4" }),
        div({ id: "variantsListContainer", className: "hidden" }).Append(
            h3({ className: "text-lg font-medium text-gray-800 mb-4", textContent: "Variantes Geradas" }),
            div({ id: "variantsList", className: "border rounded-lg" }).Append(
                div({ className: "grid grid-cols-5 items-center gap-4 p-4 bg-gray-50 rounded-t-lg border-b" }).Append(
                    label({ className: "block text-sm font-medium text-gray-700", textContent: "Variante" }),
                    label({ className: "block text-sm font-medium text-gray-700", textContent: "SKU" }),
                    label({ className: "block text-sm font-medium text-gray-700", textContent: "Preço" }),
                    label({ className: "block text-sm font-medium text-gray-700", textContent: "Estoque" }),
                    label({ className: "block text-sm font-medium text-gray-700", textContent: "Ativa" })
                ),
                div({ id: "variantsListContent" })
            )
        )
    );
}

function ProductFormPricingTab() {
    return div({ id: "tab-pricing", className: "tab-panel hidden space-y-6" }).Append(
        div({ className: "p-4 bg-blue-50 border border-blue-200 rounded-lg" }).Append(
            p({ className: "text-sm text-blue-700", textContent: "Defina preços diferentes para vendas em volume. O preço base (da aba Geral) será usado se nenhuma regra aqui se aplicar." })
        ),
        div({ id: "priceTiersContainer", className: "space-y-4" }).Append(
            div({ className: "grid grid-cols-3 gap-4" }).Append(
                label({ className: "block text-sm font-medium text-gray-700", textContent: "Quantidade Mínima" }),
                label({ className: "block text-sm font-medium text-gray-700", textContent: "Preço por Unidade" }),
                div()
            )
        ),
        button({ type: "button", id: "addPriceTierButton", className: "flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-200" }).Append(
            RichElement("i", { dataset: { lucide: "plus" }, className: "w-4 h-4" }),
            span({ textContent: " Adicionar Faixa de Preço" })
        )
    );
}

function ProductFormInventoryTab() {
    return div({ id: "tab-inventory", className: "tab-panel hidden space-y-6" }).Append(
        div({ className: "grid grid-cols-1 md:grid-cols-2 gap-6" }).Append(
            div().Append(
                label({ htmlFor: "inventoryManager", className: "block text-sm font-medium text-gray-700", textContent: "Responsável pelo Inventário" }),
                input({ type: "text", id: "inventoryManager", name: "inventoryManager", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
            ),
            div().Append(
                label({ htmlFor: "deliveryTime", className: "block text-sm font-medium text-gray-700", textContent: "Tempo de Entrega ao Cliente (dias)" }),
                input({ type: "number", id: "deliveryTime", name: "deliveryTime", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
            ),
            div().Append(
                label({ htmlFor: "weight", className: "block text-sm font-medium text-gray-700", textContent: "Peso (kg)" }),
                input({ type: "number", id: "weight", name: "weight", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
            ),
            div().Append(
                label({ htmlFor: "volume", className: "block text-sm font-medium text-gray-700", textContent: "Volume (m³)" }),
                input({ type: "number", id: "volume", name: "volume", className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500" })
            )
        )
    );
}