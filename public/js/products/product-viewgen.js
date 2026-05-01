import { ConfirmModal, PrimaryButton } from "../shared/widgets.js";
import {
    button,
    div,
    form,
    h1,
    h2,
    h3,
    header,
    img,
    input,
    p,
    span,
    main,
    nav,
    footer,
    label,
    textarea,
    fieldset,
    hr,
    select,
    option,
    RichElement,
} from "../vanilla-core/viewgencore.js";

// ==========================================
// 1. WIDGETS E VISUALIZAÇÃO DE LISTAGEM
// ==========================================

export function ProductsPageLayout(mainContent) {
    return div({ className: "bg-gray-50 min-h-screen flex flex-col" }).Append(
        mainContent
    );
}

export function LoadingState() {
    return div({
        className: "flex items-center justify-center h-screen w-full",
    }).Append(
        div({ className: "flex flex-col items-center gap-3" }).Append(
            RichElement("i", {
                dataset: { lucide: "loader-2" },
                className: "w-8 h-8 text-blue-600 animate-spin",
            }),
            p({
                className: "text-lg text-gray-600 font-medium",
                textContent: "A carregar produtos...",
            })
        )
    );
}

export function ProductErrorState(error) {
    console.error(error); // important to log because of debugging
    return div({
        className: "flex items-center justify-center h-screen w-full",
    }).Append(
        div({
            className: "text-center max-w-md p-6 bg-white rounded-xl shadow-lg",
        }).Append(
            RichElement("i", {
                dataset: { lucide: "alert-circle" },
                className: "w-12 h-12 text-red-500 mx-auto mb-4",
            }),
            h2({
                className: "text-2xl font-bold text-gray-800 mb-2",
                textContent: "Oops! Algo correu mal.",
            }),
            p({
                className: "text-gray-600",
                textContent:
                    error.message ||
                    "Não foi possível carregar a página de produtos.",
            })
        )
    );
}

export function ProductMainWidget(events) {
    return main({
        id: "productListContainer",
        className: "flex-1 w-full bg-gray-50 flex flex-col relative",
    }).Append(
        ProductPageHeader(events),
        div({ className: "px-4 md:px-8 pb-8 flex-1 flex flex-col" }).Append(
            div({
                id: "gridLoadingIndicator",
                className:
                    "hidden absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-sm space-y-4",
            }).Append(
                div({
                    className:
                        "animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600",
                }),
                span({
                    className:
                        "text-base text-gray-600 font-medium animate-pulse",
                    textContent: "A procurar produtos...",
                })
            ),
            div({
                id: "productGrid",
                className:
                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
            })
        )
    );
}

export function BottomLoader() {
    return div({ className: "col-span-full flex justify-center py-6" }).Append(
        div({
            className:
                "animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600",
        })
    );
}

export function ProductPageHeader(events) {
    return header({
        className:
            "mb-6 flex flex-col md:flex-row items-center gap-4 md:gap-8 sticky top-0 z-30 bg-white shadow-sm px-4 md:px-8 py-4 border-b border-gray-200",
    }).Append(
        h1({
            className: "text-2xl font-bold text-gray-800 shrink-0",
            textContent: "Produtos",
        }),

        div({ className: "flex-1 w-full max-w-3xl relative mx-auto" }).Append(
            span({
                className:
                    "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400",
            }).Append(
                RichElement("i", {
                    dataset: { lucide: "search" },
                    className: "w-5 h-5",
                })
            ),
            input({
                id: "searchInput",
                type: "text",
                placeholder:
                    "Pesquisar produtos por nome, referência, ou EAN...",
                className:
                    "pl-12 pr-4 py-2.5 w-full border border-gray-300 bg-gray-50 rounded-xl shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-700",
                oninput: events.onSearchInput,
                onfocus: events.onSearchFocus,
            })
        ),
        PrimaryButton(
            "showModalButton",
            "Adicionar Produto",
            "plus",
            events.onOpenNewModal
        )
    );
}

export function ProductCard(viewModel, events) {
    return div({
        className:
            "bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200 group",
    }).Append(
        img({
            src: viewModel.imgSrc,
            alt: viewModel.name,
            className:
                "w-full h-48 object-cover opacity-90 group-hover:opacity-100 transition-opacity",
        }),
        div({ className: "p-5" }).Append(
            h3({
                className: "text-lg font-semibold text-gray-800 truncate",
                textContent: viewModel.name,
            }),
            p({
                className: "text-2xl font-bold text-blue-600 mt-2",
                textContent: viewModel.priceFormatted,
            }),
            p({
                className: `text-sm font-medium ${viewModel.stockColor} mt-1`,
                textContent: viewModel.stockText,
            }),
            button({
                className:
                    "mt-5 w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition duration-200",
                onclick: () => events.onEditProduct(viewModel.id),
                textContent: "Editar",
            })
        )
    );
}

export function EmptyState() {
    return div({
        className:
            "col-span-full flex flex-col items-center justify-center py-16",
    }).Append(
        RichElement("i", {
            dataset: { lucide: "package-search" },
            className: "w-16 h-16 text-gray-300 mb-4",
        }),
        h3({
            className: "text-xl font-semibold text-gray-600",
            textContent: "Nenhum produto encontrado",
        }),
        p({
            className: "text-gray-400 mt-1",
            textContent: "A pesquisa não retornou qualquer resultado.",
        })
    );
}

// ==========================================
// 2. MODAIS
// ==========================================

export function ConfirmExitModal(events) {
    return div({
        id: "confirmExitModal",
        className:
            "fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 hidden z-[60]",
    }).Append(
        div({
            className: "bg-white w-full max-w-md rounded-2xl shadow-2xl p-6",
        }).Append(
            h3({
                className: "text-xl font-bold text-gray-800",
                textContent: "Sair sem Guardar?",
            }),
            p({
                className: "text-gray-600 mt-2",
                textContent:
                    "Tem a certeza de que quer fechar? Todas as alterações não guardadas serão perdidas.",
            }),
            div({ className: "flex justify-end gap-3 mt-8" }).Append(
                button({
                    id: "cancelExitButton",
                    className:
                        "px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl shadow-sm hover:bg-gray-50",
                    onclick: events.onCancelExit,
                    textContent: "Continuar a Editar",
                }),
                button({
                    id: "confirmExitButton",
                    className:
                        "px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl shadow-md hover:bg-red-700",
                    onclick: events.onConfirmExit,
                    textContent: "Sair",
                })
            )
        )
    );
}

export function ProductModal(events) {
    return ConfirmModal({
        id: "productModal",
        className:
            "fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50",
        onclick: events.onBackdropClick,
        confirmButtonProps: {
            textContent: "Guardar Produto",
            id: "saveButton",
            type: "submit",
        },
        cancelButtonProps: {
            id: "cancelButton",
            onclick: events.onRequestClose,
        },
    }).Append(
        form({
            id: "productForm",
            onsubmit: events.onSaveModal,
            oninput: events.onFormInput,
            className:
                "bg-white w-full max-w-4xl h-full max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-auto",
        }).Append(
            // header({
            //     className:
            //         "p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10",
            // }).Append(
            //     div({ className: "flex items-center gap-3" }).Append(
            //         button({
            //             id: "saveButtonHeader",
            //             type: "submit",
            //             className:
            //                 "px-5 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200",
            //             textContent: "Guardar Produto",
            //         }),
            //         button({
            //             id: "cancelButtonHeader",
            //             type: "button",
            //             className:
            //                 "px-5 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition duration-200",
            //             onclick: events.onRequestClose,
            //             textContent: "Cancelar",
            //         })
            //     ),
            //     button({
            //         id: "closeModalButton",
            //         type: "button",
            //         className:
            //             "text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors",
            //         onclick: events.onRequestClose,
            //     }).Append(
            //         RichElement("i", {
            //             dataset: { lucide: "x" },
            //             className: "w-6 h-6",
            //         })
            //     )
            // ),

            div({
                className: "flex-grow p-6 overflow-y-auto bg-gray-50/30",
            }).Append(
                ProductTabsNav(events),
                ProductFormGeneralTab(events),
                ProductFormVariantsTab(events),
                ProductFormPricingTab(events),
                ProductFormInventoryTab(events)
            )

            // footer({
            //     className:
            //         "p-4 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white z-10",
            // }).Append(
            //     button({
            //         id: "cancelButton",
            //         type: "button",
            //         className:
            //             "px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition duration-200",
            //         onclick: events.onRequestClose,
            //         textContent: "Cancelar",
            //     }),
            //     button({
            //         id: "saveButton",
            //         type: "submit",
            //         className:
            //             "px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200",
            //         textContent: "Guardar Produto",
            //     })
            // )
        )
    );
    // return div({
    //     id: "productModal",
    //     className:
    //         "fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50",
    //     onclick: events.onBackdropClick,
    // }).Append(
    // );
}

// ==========================================
// 3. SUBCOMPONENTES DE UI
// ==========================================

function ProductTabsNav(events) {
    const createTab = (id, label, active = false) => {
        return RichElement("button", {
            type: "button",
            dataset: { tab: id },
            className: `tab-button whitespace-nowrap py-3 px-1 font-medium text-sm transition-colors ${active ? "border-b-2 border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`,
            textContent: label,
            onclick: () => events.onSwitchTab(id),
        });
    };

    return div({ className: "border-b border-gray-200 mb-6" }).Append(
        RichElement("nav", { className: "-mb-px flex space-x-6" }).Append(
            createTab("general", "Informação Geral", true),
            createTab("variants", "Atributos e Variantes"),
            createTab("pricing", "Preços por Quantidade"),
            createTab("inventory", "Inventário")
        )
    );
}

function ProductFormGeneralTab(events) {
    return div({ id: "tab-general", className: "tab-panel space-y-8" }).Append(
        // Categoria, SKU e EAN
        div({ className: "grid grid-cols-1 md:grid-cols-3 gap-6" }).Append(
            div().Append(
                label({
                    htmlFor: "category",
                    className: "block text-sm font-medium text-gray-700",
                    textContent: "Categoria",
                }),
                input({
                    type: "text",
                    id: "category",
                    name: "category",
                    className:
                        "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                })
            ),
            div().Append(
                // OBRIGATÓRIO
                label({
                    htmlFor: "reference",
                    className: "block text-sm font-medium text-gray-700",
                }).Append(
                    span({ textContent: "Referência (SKU) " }),
                    span({ className: "text-red-500", textContent: "*" })
                ),
                input({
                    type: "text",
                    id: "reference",
                    name: "reference",
                    required: true,
                    className:
                        "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                })
            ),
            div().Append(
                label({
                    htmlFor: "barcode",
                    className: "block text-sm font-medium text-gray-700",
                    textContent: "Código de Barras (EAN)",
                }),
                input({
                    type: "text",
                    id: "barcode",
                    name: "barcode",
                    className:
                        "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                })
            )
        ),

        hr({ className: "border-gray-200" }),

        // Imagem, Nome e Descrição
        div({ className: "grid grid-cols-1 md:grid-cols-3 gap-6" }).Append(
            div({ className: "md:col-span-1" }).Append(
                label({
                    className: "block text-sm font-medium text-gray-700 mb-1",
                    textContent: "Imagem do Produto",
                }),
                input({
                    type: "file",
                    id: "productImageInput",
                    className: "hidden",
                    accept: "image/*",
                }),
                label({
                    htmlFor: "productImageInput",
                    className:
                        "image-upload-area cursor-pointer flex flex-col items-center justify-center w-full h-48 rounded-xl bg-gray-50 border border-dashed border-gray-300 text-gray-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition",
                }).Append(
                    div({
                        id: "imagePreview",
                        className:
                            "w-full h-full rounded-xl flex flex-col items-center justify-center bg-center bg-cover",
                    }).Append(
                        div({
                            id: "uploadIcon",
                            className: "flex flex-col items-center",
                        }).Append(
                            RichElement("i", {
                                dataset: { lucide: "upload-cloud" },
                                className: "w-10 h-10",
                            }),
                            span({
                                className: "mt-2 text-sm font-medium",
                                textContent: "Carregar imagem",
                            })
                        )
                    )
                )
            ),
            div({ className: "md:col-span-2 space-y-6" }).Append(
                div().Append(
                    // OBRIGATÓRIO
                    label({
                        htmlFor: "productName",
                        className: "block text-sm font-medium text-gray-700",
                    }).Append(
                        span({ textContent: "Nome do Produto " }),
                        span({ className: "text-red-500", textContent: "*" })
                    ),
                    input({
                        type: "text",
                        id: "productName",
                        name: "productName",
                        required: true,
                        className:
                            "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                    })
                ),
                div().Append(
                    // OBRIGATÓRIO
                    label({
                        htmlFor: "productDescription",
                        className: "block text-sm font-medium text-gray-700",
                    }).Append(
                        span({ textContent: "Descrição " }),
                        span({ className: "text-red-500", textContent: "*" })
                    ),
                    textarea({
                        id: "productDescription",
                        name: "productDescription",
                        required: true,
                        rows: 5,
                        className:
                            "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                    })
                )
            )
        ),

        // Tipo de Produto
        div().Append(
            // OBRIGATÓRIO
            label({
                className: "block text-sm font-medium text-gray-700",
            }).Append(
                span({ textContent: "Tipo de Produto " }),
                span({ className: "text-red-500", textContent: "*" })
            ),
            fieldset({ className: "mt-3" }).Append(
                div({ className: "flex items-center space-x-8" }).Append(
                    div({ className: "flex items-center gap-2" }).Append(
                        input({
                            id: "type-mercadoria",
                            name: "productType",
                            type: "radio",
                            value: "mercadoria",
                            className:
                                "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer",
                            checked: true,
                            onchange: events.onTypeChange,
                        }),
                        label({
                            htmlFor: "type-mercadoria",
                            className: "text-sm text-gray-700 cursor-pointer",
                            textContent: "Mercadoria",
                        })
                    ),
                    div({ className: "flex items-center gap-2" }).Append(
                        input({
                            id: "type-servico",
                            name: "productType",
                            type: "radio",
                            value: "servico",
                            className:
                                "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer",
                            onchange: events.onTypeChange,
                        }),
                        label({
                            htmlFor: "type-servico",
                            className: "text-sm text-gray-700 cursor-pointer",
                            textContent: "Serviço",
                        })
                    ),
                    div({ className: "flex items-center gap-2" }).Append(
                        input({
                            id: "type-combo",
                            name: "productType",
                            type: "radio",
                            value: "combo",
                            className:
                                "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer",
                            onchange: events.onTypeChange,
                        }),
                        label({
                            htmlFor: "type-combo",
                            className: "text-sm text-gray-700 cursor-pointer",
                            textContent: "Combo",
                        })
                    )
                )
            )
        ),

        // Preço e Custo
        div({ className: "grid grid-cols-1 md:grid-cols-2 gap-6" }).Append(
            div().Append(
                // OBRIGATÓRIO
                label({
                    htmlFor: "salesPrice",
                    className: "block text-sm font-medium text-gray-700",
                }).Append(
                    span({ textContent: "Preço de Venda " }),
                    span({ className: "text-red-500", textContent: "*" })
                ),
                div({ className: "relative mt-1" }).Append(
                    span({
                        className:
                            "absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium",
                        textContent: "MZN",
                    }),
                    input({
                        type: "text",
                        inputmode: "decimal",
                        placeholder: "0,00",
                        id: "salesPrice",
                        name: "salesPrice",
                        required: true,
                        className:
                            "pl-14 pr-3 py-2.5 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-800",
                    })
                )
            ),
            div().Append(
                label({
                    htmlFor: "costPrice",
                    className: "block text-sm font-medium text-gray-700",
                    textContent: "Custo",
                }),
                div({ className: "relative mt-1" }).Append(
                    span({
                        className:
                            "absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-medium",
                        textContent: "MZN",
                    }),
                    input({
                        type: "text",
                        inputmode: "decimal",
                        placeholder: "0,00",
                        id: "costPrice",
                        name: "costPrice",
                        className:
                            "pl-14 pr-3 py-2.5 block w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-semibold text-gray-800",
                    })
                )
            )
        ),

        // Rastreio de Stock e Unidade de Medida
        div({
            className:
                "grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200",
        }).Append(
            div({ className: "space-y-6" }).Append(
                div({
                    id: "inventory-tracking-container",
                    className:
                        "relative flex items-start transition-opacity duration-200",
                }).Append(
                    div({ className: "flex items-center h-5" }).Append(
                        input({
                            id: "trackInventory",
                            name: "trackInventory",
                            type: "checkbox",
                            className:
                                "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer",
                            checked: true,
                            onchange: events.onTrackChange,
                        })
                    ),
                    div({ className: "ml-3 text-sm" }).Append(
                        label({
                            htmlFor: "trackInventory",
                            className:
                                "font-medium text-gray-700 cursor-pointer",
                            textContent: "Rastrear inventário",
                        }),
                        p({
                            className: "text-gray-500 mt-1",
                            textContent:
                                "Ative para permitir o controlo de quantidades deste produto.",
                        })
                    )
                ),
                div({
                    id: "quantity-container",
                    className: "transition-all duration-300",
                }).Append(
                    label({
                        htmlFor: "quantityOnHand",
                        className: "block text-sm font-medium text-gray-700",
                        textContent: "Quantidade Atual Em Mão",
                    }),
                    input({
                        type: "number",
                        id: "quantityOnHand",
                        name: "quantityOnHand",
                        className:
                            "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                    })
                )
            ),
            div({ className: "space-y-4" }).Append(
                div().Append(
                    // OBRIGATÓRIO
                    label({
                        className: "block text-sm font-medium text-gray-700",
                    }).Append(
                        span({ textContent: "Unidade de Medida " }),
                        span({ className: "text-red-500", textContent: "*" })
                    ),
                    p({
                        className: "text-xs text-gray-500 mb-3",
                        textContent:
                            "Como este produto é contabilizado ao ser faturado?",
                    }),
                    fieldset().Append(
                        div({
                            className:
                                "flex flex-col space-y-4 bg-white p-4 rounded-xl border border-gray-200",
                        }).Append(
                            div({
                                className: "flex items-center gap-2",
                            }).Append(
                                input({
                                    id: "measure-unit",
                                    name: "measureUnit",
                                    type: "radio",
                                    value: "unidade",
                                    className:
                                        "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer",
                                    checked: true,
                                }),
                                label({
                                    htmlFor: "measure-unit",
                                    className:
                                        "text-sm text-gray-700 cursor-pointer",
                                    textContent: "Unidade (Ex: Peça, Caixa)",
                                })
                            ),
                            div({
                                className: "flex items-center gap-2",
                            }).Append(
                                input({
                                    id: "measure-weight",
                                    name: "measureUnit",
                                    type: "radio",
                                    value: "peso",
                                    className:
                                        "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer",
                                }),
                                label({
                                    htmlFor: "measure-weight",
                                    className:
                                        "text-sm text-gray-700 cursor-pointer",
                                    textContent:
                                        "Peso (Ex: Kg, g - Requer balança)",
                                })
                            ),
                            div({
                                className: "flex items-center gap-2",
                            }).Append(
                                input({
                                    id: "measure-length",
                                    name: "measureUnit",
                                    type: "radio",
                                    value: "metro",
                                    className:
                                        "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer",
                                }),
                                label({
                                    htmlFor: "measure-length",
                                    className:
                                        "text-sm text-gray-700 cursor-pointer",
                                    textContent: "Comprimento (Ex: Metro, cm)",
                                })
                            )
                        )
                    )
                )
            )
        )
    );
}

function ProductFormVariantsTab(events) {
    return div({
        id: "tab-variants",
        className: "tab-panel hidden space-y-6",
    }).Append(
        div({
            className:
                "p-4 bg-blue-50/50 border border-blue-100 rounded-lg flex gap-3 items-start",
        }).Append(
            RichElement("i", {
                dataset: { lucide: "network" },
                className: "w-5 h-5 text-blue-500 mt-0.5",
            }),
            p({
                className: "text-sm text-blue-700 leading-relaxed",
                textContent:
                    "Adicione atributos como Cor ou Tamanho para criar variações do seu produto. Cada variação pode ter seu próprio SKU, preço e estoque isolado.",
            })
        ),
        div().Append(
            label({
                htmlFor: "attributeSelector",
                className: "block text-sm font-medium text-gray-700",
                textContent: "Adicionar Atributo",
            }),
            div({ className: "mt-1 flex gap-2" }).Append(
                select({
                    id: "attributeSelector",
                    className:
                        "block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                }).Append(
                    option({ value: "cor", textContent: "Cor" }),
                    option({ value: "tamanho", textContent: "Tamanho" }),
                    option({ value: "material", textContent: "Material" }),
                    option({ value: "genero", textContent: "Gênero" }),
                    option({ value: "marca", textContent: "Marca" })
                ),
                button({
                    type: "button",
                    id: "addAttributeButton",
                    className:
                        "px-5 py-2.5 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 shadow-sm",
                    textContent: "Adicionar",
                })
            )
        ),
        div({ id: "attributesContainer", className: "space-y-4" }),
        div({ id: "variantsListContainer", className: "hidden mt-8" }).Append(
            h3({
                className: "text-lg font-medium text-gray-800 mb-4",
                textContent: "Variantes Geradas",
            }),
            div({
                id: "variantsList",
                className:
                    "border rounded-xl bg-white overflow-hidden shadow-sm",
            }).Append(
                div({
                    className:
                        "grid grid-cols-5 items-center gap-4 p-4 bg-gray-50 border-b border-gray-200",
                }).Append(
                    label({
                        className:
                            "block text-xs font-semibold uppercase text-gray-500",
                        textContent: "Variante",
                    }),
                    label({
                        className:
                            "block text-xs font-semibold uppercase text-gray-500",
                        textContent: "SKU",
                    }),
                    label({
                        className:
                            "block text-xs font-semibold uppercase text-gray-500",
                        textContent: "Preço",
                    }),
                    label({
                        className:
                            "block text-xs font-semibold uppercase text-gray-500",
                        textContent: "Estoque",
                    }),
                    label({
                        className:
                            "block text-xs font-semibold uppercase text-gray-500",
                        textContent: "Ativa",
                    })
                ),
                div({
                    id: "variantsListContent",
                    className: "divide-y divide-gray-100",
                })
            )
        )
    );
}

function ProductFormPricingTab(events) {
    return div({
        id: "tab-pricing",
        className: "tab-panel hidden space-y-6",
    }).Append(
        div({
            className:
                "p-4 bg-blue-50/50 border border-blue-100 rounded-lg flex gap-3 items-start",
        }).Append(
            RichElement("i", {
                dataset: { lucide: "tags" },
                className: "w-5 h-5 text-blue-500 mt-0.5",
            }),
            p({
                className: "text-sm text-blue-700 leading-relaxed",
                textContent:
                    "Defina preços diferentes para vendas em volume. O preço base (da aba Geral) será usado automaticamente caso o cliente não atinja as quantidades definidas aqui.",
            })
        ),
        div({ id: "priceTiersContainer", className: "space-y-4" }).Append(
            div({ className: "grid grid-cols-3 gap-4 px-2" }).Append(
                label({
                    className:
                        "block text-xs font-semibold text-gray-500 uppercase",
                    textContent: "Quantidade Mínima",
                }),
                label({
                    className:
                        "block text-xs font-semibold text-gray-500 uppercase",
                    textContent: "Preço por Unidade",
                }),
                div()
            )
        ),
        button({
            type: "button",
            id: "addPriceTierButton",
            className:
                "flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors",
        }).Append(
            RichElement("i", {
                dataset: { lucide: "plus" },
                className: "w-4 h-4",
            }),
            span({ textContent: "Adicionar Faixa de Preço" })
        )
    );
}

function ProductFormInventoryTab(events) {
    return div({
        id: "tab-inventory",
        className: "tab-panel hidden space-y-6",
    }).Append(
        div({ className: "grid grid-cols-1 md:grid-cols-2 gap-8" }).Append(
            div().Append(
                label({
                    htmlFor: "inventoryManager",
                    className: "block text-sm font-medium text-gray-700",
                    textContent: "Responsável pelo Inventário",
                }),
                input({
                    type: "text",
                    id: "inventoryManager",
                    name: "inventoryManager",
                    className:
                        "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                })
            ),
            div().Append(
                label({
                    htmlFor: "deliveryTime",
                    className: "block text-sm font-medium text-gray-700",
                    textContent: "Tempo de Entrega ao Cliente (dias)",
                }),
                input({
                    type: "number",
                    id: "deliveryTime",
                    name: "deliveryTime",
                    className:
                        "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                })
            ),
            div().Append(
                label({
                    htmlFor: "weight",
                    className: "block text-sm font-medium text-gray-700",
                    textContent: "Peso Embalado (kg)",
                }),
                input({
                    type: "number",
                    id: "weight",
                    name: "weight",
                    className:
                        "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                })
            ),
            div().Append(
                label({
                    htmlFor: "volume",
                    className: "block text-sm font-medium text-gray-700",
                    textContent: "Volume Ocupado (m³)",
                }),
                input({
                    type: "number",
                    id: "volume",
                    name: "volume",
                    className:
                        "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                })
            )
        )
    );
}
