import {
    button,
    div,
    h1,
    h2,
    h3,
    header,
    input,
    p,
    span,
    main,
    label,
    select,
    option,
    RichElement,
    form,
} from "../../vanilla-core/viewgencore.js";

export function StockPageLayout(mainContent) {
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
                textContent: "A carregar stock...",
            })
        )
    );
}

export function StockErrorState(error) {
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
                textContent: "Erro ao carregar.",
            }),
            p({
                className: "text-gray-600",
                textContent:
                    error.message ||
                    "Não foi possível carregar a página de stock.",
            })
        )
    );
}

export function StockMainWidget(events) {
    return main({
        className: "flex-1 w-full bg-gray-50 flex flex-col relative",
    }).Append(
        StockPageHeader(events),
        div({
            className: "px-4 md:px-8 pb-8 flex-1 flex flex-col gap-0",
        }).Append(
            StockTabsNav(events),
            div({
                id: "stockLoadingIndicator",
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
                    textContent: "A carregar...",
                })
            ),
            // Tab panels
            BalanceTab(),
            EntradasTab(),
            SaidasTab(),
            ControleTab()
        )
    );
}

function StockPageHeader(events) {
    return header({
        className:
            "mb-0 flex flex-col md:flex-row items-center gap-4 md:gap-8 sticky top-0 z-30 bg-white shadow-sm px-4 md:px-8 py-4 border-b border-gray-200",
    }).Append(
        h1({
            className: "text-2xl font-bold text-gray-800 shrink-0",
            textContent: "Controlo de Stock",
        }),
        div({ className: "flex-1 w-full max-w-2xl relative mx-auto" }).Append(
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
                id: "stockSearchInput",
                type: "text",
                placeholder: "Pesquisar por produto ou referência...",
                className:
                    "pl-12 pr-4 py-2.5 w-full border border-gray-300 bg-gray-50 rounded-xl shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-gray-700",
                oninput: events.onSearchInput,
                onfocus: (e) => setTimeout(() => e.target.select(), 0),
            })
        ),
        div({ className: "flex gap-2 shrink-0" }).Append(
            button({
                className:
                    "flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition",
                onclick: events.onOpenEntryModal,
            }).Append(
                RichElement("i", {
                    dataset: { lucide: "arrow-down-to-line" },
                    className: "w-4 h-4",
                }),
                span({ textContent: "Entrada" })
            ),
            button({
                className:
                    "flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white font-medium rounded-xl shadow-md hover:bg-gray-700 transition",
                onclick: events.onOpenExitModal,
            }).Append(
                RichElement("i", {
                    dataset: { lucide: "arrow-up-from-line" },
                    className: "w-4 h-4",
                }),
                span({ textContent: "Saída" })
            )
        )
    );
}

function StockTabsNav(events) {
    const Tab = (id, label, active = false) =>
        RichElement("button", {
            type: "button",
            dataset: { tab: id },
            className: `stock-tab-button whitespace-nowrap py-3 px-1 font-medium text-sm transition-colors ${active ? "border-b-2 border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`,
            textContent: label,
            onclick: () => events.onSwitchTab(id),
        });

    return div({ className: "border-b border-gray-200 mb-6 bg-white" }).Append(
        RichElement("nav", {
            className: "-mb-px flex space-x-6 px-4 md:px-0",
        }).Append(
            Tab("balanco", "Balanço", true),
            Tab("entradas", "Entradas"),
            Tab("saidas", "Saídas"),
            Tab("controle", "Controle")
        )
    );
}

function BalanceTab() {
    return div({
        id: "stock-tab-balanco",
        className: "stock-tab-panel",
    }).Append(
        div({
            className:
                "bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden",
        }).Append(
            // Table header
            div({
                className:
                    "grid grid-cols-7 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200",
            }).Append(
                label({
                    className:
                        "text-xs font-semibold uppercase text-gray-500 col-span-1",
                    textContent: "SKU/Cód.",
                }),
                label({
                    className:
                        "text-xs font-semibold uppercase text-gray-500 col-span-2",
                    textContent: "Produto",
                }),
                label({
                    className:
                        "text-xs font-semibold uppercase text-gray-500 text-right",
                    textContent: "Est. Automático",
                }),
                label({
                    className:
                        "text-xs font-semibold uppercase text-gray-500 text-right",
                    textContent: "Est. REAL",
                }),
                label({
                    className:
                        "text-xs font-semibold uppercase text-gray-500 text-right",
                    textContent: "Est. Mínimo",
                }),
                label({
                    className:
                        "text-xs font-semibold uppercase text-gray-500 text-right",
                    textContent: "Valor em Stock",
                })
            ),
            div({
                id: "balanceTableBody",
                className: "divide-y divide-gray-50",
            })
        )
    );
}

export function BalanceRow(vm) {
    return div({
        className:
            "grid grid-cols-7 gap-4 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors",
    }).Append(
        span({
            className: "text-xs font-mono text-gray-500 col-span-1 truncate",
            textContent: vm.sku,
        }),
        span({
            className: "text-sm font-medium text-gray-800 col-span-2 truncate",
            textContent: vm.name,
        }),
        span({
            className: "text-sm text-gray-600 text-right",
            textContent: String(vm.autoStock),
        }),
        span({
            className: "text-sm font-semibold text-gray-800 text-right",
            textContent: String(vm.realStock),
        }),
        span({
            className: "text-sm text-gray-500 text-right",
            textContent: String(vm.minStock),
        }),
        div({
            className: "text-right flex items-center justify-end gap-2",
        }).Append(
            span({
                className: "text-sm text-gray-700",
                textContent: vm.stockValueFormatted,
            }),
            span({
                className: `text-xs font-bold px-2 py-0.5 rounded-full ${vm.statusColor}`,
                textContent: vm.status,
            })
        )
    );
}

function EntradasTab() {
    return div({
        id: "stock-tab-entradas",
        className: "stock-tab-panel hidden",
    }).Append(
        div({
            className:
                "bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden",
        }).Append(
            div({
                className:
                    "grid grid-cols-8 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200",
            }).Append(
                label({
                    className: "text-xs font-semibold uppercase text-gray-500",
                    textContent: "Data",
                }),
                label({
                    className:
                        "text-xs font-semibold uppercase text-gray-500 col-span-2",
                    textContent: "Produto",
                }),
                label({
                    className: "text-xs font-semibold uppercase text-gray-500",
                    textContent: "Fornecedor",
                }),
                label({
                    className:
                        "text-xs font-semibold uppercase text-gray-500 text-right",
                    textContent: "Qtd. Entrada",
                }),
                label({
                    className:
                        "text-xs font-semibold uppercase text-gray-500 text-right",
                    textContent: "Qtd/Caixa",
                }),
                label({
                    className:
                        "text-xs font-semibold uppercase text-gray-500 text-right",
                    textContent: "Fator",
                }),
                label({
                    className:
                        "text-xs font-semibold uppercase text-gray-500 text-right",
                    textContent: "Custo Unit.",
                })
            ),
            div({
                id: "entriesTableBody",
                className: "divide-y divide-gray-50",
            })
        )
    );
}

export function EntryRow(vm) {
    return div({
        className:
            "grid grid-cols-8 gap-4 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors",
    }).Append(
        span({ className: "text-sm text-gray-500", textContent: vm.date }),
        span({
            className: "text-sm font-medium text-gray-800 col-span-2 truncate",
            textContent: vm.productName,
        }),
        span({
            className: "text-sm text-gray-600 truncate",
            textContent: vm.supplier,
        }),
        span({
            className: "text-sm text-gray-800 text-right font-semibold",
            textContent: String(vm.qtyIn),
        }),
        span({
            className: "text-sm text-gray-500 text-right",
            textContent: String(vm.qtyPerBox),
        }),
        span({
            className: "text-sm text-gray-500 text-right",
            textContent: String(vm.factor),
        }),
        span({
            className: "text-sm text-gray-700 text-right",
            textContent: vm.costFormatted,
        })
    );
}

function SaidasTab() {
    return div({
        id: "stock-tab-saidas",
        className: "stock-tab-panel hidden",
    }).Append(
        div({
            className:
                "bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden",
        }).Append(
            div({
                className:
                    "grid grid-cols-5 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200",
            }).Append(
                label({
                    className: "text-xs font-semibold uppercase text-gray-500",
                    textContent: "Data",
                }),
                label({
                    className:
                        "text-xs font-semibold uppercase text-gray-500 col-span-2",
                    textContent: "Produto",
                }),
                label({
                    className: "text-xs font-semibold uppercase text-gray-500",
                    textContent: "Cliente/Destino",
                }),
                label({
                    className:
                        "text-xs font-semibold uppercase text-gray-500 text-right",
                    textContent: "Qtd.",
                })
            ),
            div({ id: "exitsTableBody", className: "divide-y divide-gray-50" })
        )
    );
}

export function ExitRow(vm) {
    return div({
        className:
            "grid grid-cols-5 gap-4 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors",
    }).Append(
        span({ className: "text-sm text-gray-500", textContent: vm.date }),
        span({
            className: "text-sm font-medium text-gray-800 col-span-2 truncate",
            textContent: vm.productName,
        }),
        span({
            className: "text-sm text-gray-600 truncate",
            textContent: vm.destination,
        }),
        span({
            className: "text-sm font-semibold text-gray-800 text-right",
            textContent: String(vm.qty),
        })
    );
}

function ControleTab() {
    return div({
        id: "stock-tab-controle",
        className: "stock-tab-panel hidden",
    }).Append(
        div({
            className:
                "flex flex-col items-center justify-center py-20 text-center",
        }).Append(
            RichElement("i", {
                dataset: { lucide: "settings-2" },
                className: "w-12 h-12 text-gray-300 mb-4",
            }),
            h3({
                className: "text-xl font-semibold text-gray-600",
                textContent: "Controle de Stock",
            }),
            p({
                className: "text-gray-400 mt-1 max-w-sm",
                textContent:
                    "Configuração de alertas, stocks mínimos e rastreio por armazém — em breve.",
            })
        )
    );
}

export function EmptyState() {
    return div({
        className: "flex flex-col items-center justify-center py-16",
    }).Append(
        RichElement("i", {
            dataset: { lucide: "package-search" },
            className: "w-16 h-16 text-gray-300 mb-4",
        }),
        h3({
            className: "text-xl font-semibold text-gray-600",
            textContent: "Sem registos",
        }),
        p({
            className: "text-gray-400 mt-1",
            textContent: "Não foram encontrados resultados.",
        })
    );
}

export function EntryModal(events) {
    return div({
        id: "entryModal",
        className:
            "fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50",
    }).Append(
        div({
            className:
                "bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden",
            onclick: (e) => e.stopPropagation(),
        }).Append(
            // Header
            div({
                className:
                    "flex items-center justify-between px-6 py-4 border-b border-gray-200",
            }).Append(
                h3({
                    className: "text-lg font-bold text-gray-800",
                    textContent: "Registar Entrada de Stock",
                }),
                button({
                    className: "text-gray-400 hover:text-gray-600",
                    onclick: events.onCloseEntryModal,
                }).Append(
                    RichElement("i", {
                        dataset: { lucide: "x" },
                        className: "w-5 h-5",
                    })
                )
            ),
            // Form
            div({ className: "p-6 space-y-5" }).Append(
                // Produto
                div().Append(
                    label({
                        htmlFor: "entry-product",
                        className:
                            "block text-sm font-medium text-gray-700 mb-1",
                    }).Append(
                        span({ textContent: "Produto " }),
                        span({ className: "text-red-500", textContent: "*" })
                    ),
                    select({
                        id: "entry-product",
                        name: "productId",
                        className:
                            "block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                    })
                ),
                // Fornecedor
                div().Append(
                    label({
                        htmlFor: "entry-supplier",
                        className:
                            "block text-sm font-medium text-gray-700 mb-1",
                        textContent: "Fornecedor",
                    }),
                    input({
                        type: "text",
                        id: "entry-supplier",
                        name: "supplier",
                        className:
                            "block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                    })
                ),
                // Quantidade + Custo
                div({ className: "grid grid-cols-2 gap-4" }).Append(
                    div().Append(
                        label({
                            htmlFor: "entry-qty",
                            className:
                                "block text-sm font-medium text-gray-700 mb-1",
                        }).Append(
                            span({ textContent: "Quantidade " }),
                            span({
                                className: "text-red-500",
                                textContent: "*",
                            })
                        ),
                        input({
                            type: "number",
                            id: "entry-qty",
                            name: "qty",
                            min: "1",
                            className:
                                "block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                        })
                    ),
                    div().Append(
                        label({
                            htmlFor: "entry-cost",
                            className:
                                "block text-sm font-medium text-gray-700 mb-1",
                            textContent: "Custo Unitário (MZN)",
                        }),
                        input({
                            type: "text",
                            inputmode: "decimal",
                            id: "entry-cost",
                            name: "unitCost",
                            placeholder: "0,00",
                            className:
                                "block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                        })
                    )
                ),
                // Qtd por Caixa + Fator
                div({ className: "grid grid-cols-2 gap-4" }).Append(
                    div().Append(
                        label({
                            htmlFor: "entry-qty-box",
                            className:
                                "block text-sm font-medium text-gray-700 mb-1",
                            textContent: "Qtd. por Caixa",
                        }),
                        input({
                            type: "number",
                            id: "entry-qty-box",
                            name: "qtyPerBox",
                            min: "1",
                            className:
                                "block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                        })
                    ),
                    div().Append(
                        label({
                            htmlFor: "entry-factor",
                            className:
                                "block text-sm font-medium text-gray-700 mb-1",
                            textContent: "Fator / Conteúdo",
                        }),
                        input({
                            type: "text",
                            id: "entry-factor",
                            name: "factor",
                            className:
                                "block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                        })
                    )
                ),
                // Data
                div().Append(
                    label({
                        htmlFor: "entry-date",
                        className:
                            "block text-sm font-medium text-gray-700 mb-1",
                        textContent: "Data",
                    }),
                    input({
                        type: "date",
                        id: "entry-date",
                        name: "date",
                        className:
                            "block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                    })
                )
            ),
            // Footer
            div({
                className:
                    "flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50",
            }).Append(
                button({
                    className:
                        "px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50",
                    onclick: events.onCloseEntryModal,
                    textContent: "Cancelar",
                }),
                button({
                    className:
                        "px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700",
                    onclick: events.onSaveEntry,
                }).Append(
                    RichElement("i", {
                        dataset: { lucide: "save" },
                        className: "w-4 h-4 inline mr-1",
                    }),
                    span({ textContent: "Guardar Entrada" })
                )
            )
        )
    );
}

export function ExitModal(events) {
    return div({
        id: "exitModal",
        className:
            "fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 hidden z-50",
    }).Append(
        div({
            className:
                "bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden",
            onclick: (e) => e.stopPropagation(),
        }).Append(
            div({
                className:
                    "flex items-center justify-between px-6 py-4 border-b border-gray-200",
            }).Append(
                h3({
                    className: "text-lg font-bold text-gray-800",
                    textContent: "Registar Saída de Stock",
                }),
                button({
                    className: "text-gray-400 hover:text-gray-600",
                    onclick: events.onCloseExitModal,
                }).Append(
                    RichElement("i", {
                        dataset: { lucide: "x" },
                        className: "w-5 h-5",
                    })
                )
            ),
            div({ className: "p-6 space-y-5" }).Append(
                div().Append(
                    label({
                        htmlFor: "exit-product",
                        className:
                            "block text-sm font-medium text-gray-700 mb-1",
                    }).Append(
                        span({ textContent: "Produto " }),
                        span({ className: "text-red-500", textContent: "*" })
                    ),
                    select({
                        id: "exit-product",
                        name: "productId",
                        className:
                            "block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                    })
                ),
                div().Append(
                    label({
                        htmlFor: "exit-destination",
                        className:
                            "block text-sm font-medium text-gray-700 mb-1",
                        textContent: "Cliente / Destino",
                    }),
                    input({
                        type: "text",
                        id: "exit-destination",
                        name: "destination",
                        className:
                            "block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                    })
                ),
                div({ className: "grid grid-cols-2 gap-4" }).Append(
                    div().Append(
                        label({
                            htmlFor: "exit-qty",
                            className:
                                "block text-sm font-medium text-gray-700 mb-1",
                        }).Append(
                            span({ textContent: "Quantidade " }),
                            span({
                                className: "text-red-500",
                                textContent: "*",
                            })
                        ),
                        input({
                            type: "number",
                            id: "exit-qty",
                            name: "qty",
                            min: "1",
                            className:
                                "block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                        })
                    ),
                    div().Append(
                        label({
                            htmlFor: "exit-date",
                            className:
                                "block text-sm font-medium text-gray-700 mb-1",
                            textContent: "Data",
                        }),
                        input({
                            type: "date",
                            id: "exit-date",
                            name: "date",
                            className:
                                "block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
                        })
                    )
                )
            ),
            div({
                className:
                    "flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50",
            }).Append(
                button({
                    className:
                        "px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50",
                    onclick: events.onCloseExitModal,
                    textContent: "Cancelar",
                }),
                button({
                    className:
                        "px-5 py-2.5 bg-gray-800 text-white font-medium rounded-xl shadow-md hover:bg-gray-700",
                    onclick: events.onSaveExit,
                }).Append(
                    RichElement("i", {
                        dataset: { lucide: "save" },
                        className: "w-4 h-4 inline mr-1",
                    }),
                    span({ textContent: "Guardar Saída" })
                )
            )
        )
    );
}
