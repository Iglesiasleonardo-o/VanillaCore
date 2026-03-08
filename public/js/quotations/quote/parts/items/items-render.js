import { globalState } from "../../../../vanilla-core/vanilla-global-state.js";
import { BottomLoader, EmptySearchState, EmptyTableState, ItemsModalWidget, ItemsTableWidget, ModalItem, QuoteRow, TotalsWidget } from "./items-viewgen.js";
import { formatByCurrency, formatByCurrencySymbol, toModalViewModel, toQuoteRowViewModel, toTotalsViewModel } from "./items-viewmodel.js";
import { applyTotalDelta, calculateLineTotals } from "./logic/items-math.js";
import { loadProductsData } from "./logic/items-network.js";

// UI STATE
let modalObserver = null;
let currentCursor = 0;
let currentSearchQuery = "";
let searchTimeout;

export function setupItemsModule(quotation) {
    const quoteItems = quotation.items || [];

    const events = setupEvents(quotation);
    const tableWidget = ItemsTableWidget(events, quoteItems, toQuoteRowViewModel);

    const totalsViewModel = toTotalsViewModel(quotation.totals);
    const totalsWidget = TotalsWidget(events.row, totalsViewModel);
    const modalWidget = ItemsModalWidget(events.modal);

    return { tableWidget, totalsWidget, modalWidget };
}

function setupEvents(quotation) {
    const TAX_RATE = globalState.company.taxRate;
    const ITEMS_LENGTH = 50;

    const setupInfiniteScrollObserver = (targetElement, itemsList) => {
        if (modalObserver) {
            modalObserver.disconnect();
        }

        modalObserver = new IntersectionObserver(async (entries) => {
            const entry = entries[0];
            if (!entry.isIntersecting) return;

            // Disconnect immediately so we don't trigger multiple fetches while loading
            modalObserver.disconnect();

            // 1. Show the Bottom Loader
            const loaderNode = BottomLoader();
            itemsList.appendChild(loaderNode);

            // 2. Fetch using the LAST KNOWN name cursor
            const newResults = await loadProductsData(currentSearchQuery, currentCursor);

            // 3. Remove the Loader
            loaderNode.remove();

            // 4. Render and append new items
            if (newResults.length > 0) {
                currentCursor = newResults[newResults.length - 1].name;

                newResults.forEach(item => {
                    const cartItem = quotation.items.find(i => i.ref === item.ref);
                    const viewData = toModalViewModel(cartItem, item);
                    itemsList.appendChild(ModalItem(!!cartItem, item, viewData, events.modal));
                });
            }

            // Check if we have a full batch to trigger the observer
            if (newResults.length >= ITEMS_LENGTH) {
                const newLastItem = itemsList.lastElementChild;
                if (newLastItem) {
                    modalObserver.observe(newLastItem);
                }
            }
        }, {
            root: itemsList,
            rootMargin: "100px",
            threshold: 0
        });

        modalObserver.observe(targetElement);
    };

    // Helper: Explicitly accepts item to avoid reference errors


    const handleLineUpdate = (item, newQty, newDisc) => {
        // 1. Calculate deltas based on current item object state
        const oldSubtotal = item.totalLine;
        const newVals = calculateLineTotals(item.unitPrice, newQty, newDisc, TAX_RATE);

        // 2. Update item source of truth
        item.quantity = newQty;
        item.discount = newDisc;
        item.totalLine = newVals.subtotal;

        // 3. Update DOM UI
        const itemRef = item.ref;
        $(`qty-${itemRef}`).value = newQty;
        $(`qty-print-${itemRef}`).textContent = newQty;

        $(`disc-${itemRef}`).value = newDisc;
        $(`disc-print-${itemRef}`).textContent = newDisc;

        $(`total-line-${itemRef}`).textContent = formatByCurrency(newVals.subtotal);

        // 4. Update Global Totals (O(1) Delta)
        const quoteTotals = quotation.totals;
        applyTotalDelta(quoteTotals, oldSubtotal, newVals.subtotal, TAX_RATE);
        updateQuotationTotals(quoteTotals);
    };

    const updateUIAndState = (item, newQty, newDisc, initialVals) => {
        // 1. Update DOM Elements
        const itemRef = item.ref;
        // Modal
        $(`modal-qty-${itemRef}`).value = newQty;
        $(`modal-total-line-${itemRef}`).textContent =
            formatByCurrencySymbol(initialVals.subtotal);

        // Main Table
        const quoteQtyInput = $(`qty-${itemRef}`);
        if (quoteQtyInput) {
            quoteQtyInput.value = newQty;
            $(`qty-print-${itemRef}`).textContent = newQty;
            $(`disc-${itemRef}`).value = newDisc;
            $(`disc-print-${itemRef}`).textContent = newDisc;

            $(`total-line-${itemRef}`).textContent = formatByCurrency(initialVals.subtotal);


            // 2. Update Data Source
            const quoteItem = quotation.items.find(i => i.ref === itemRef);
            const oldSubtotal = quoteItem.totalLine;

            quoteItem.quantity = newQty;
            quoteItem.discount = newDisc;
            quoteItem.totalLine = initialVals.subtotal;
            quoteItem.taxRate = initialVals.tax;

            // 3. Update Totals
            const quoteTotals = quotation.totals;
            applyTotalDelta(quoteTotals, oldSubtotal, initialVals.subtotal, TAX_RATE);
            updateQuotationTotals(quoteTotals);
        }
    };

    function updateQuotationTotals(totals) {
        $(`lblSubtotal`).textContent = formatByCurrencySymbol(totals.subtotal);
        $(`lblVat`).textContent = formatByCurrencySymbol(totals.taxTotal);
        $(`lblTotal`).textContent = formatByCurrencySymbol(totals.grandTotal);
    }

    const events = {
        modal: {
            onOpen: async () => {
                $("items-modal-overlay").classList.remove("hidden");
                $("modal-search").focus();

                // Reset pagination state for a fresh open
                currentCursor = "";
                currentSearchQuery = "";

                const loading = $("modal-loading");
                loading.classList.remove("hidden");
                const results = await loadProductsData(currentSearchQuery, currentCursor);
                loading.classList.add("hidden");

                const itemsList = $("items-list");
                itemsList.textContent = "";
                itemsList.scrollTop = 0;

                const cartItems = {};
                quotation.items.forEach(item => {
                    cartItems[item.ref] = item;
                });

                results.forEach(item => {
                    const cartItem = cartItems[item.ref];
                    const viewData = toModalViewModel(cartItem, item);
                    itemsList.appendChild(ModalItem(!!cartItem, item, viewData, events.modal));
                });

                // Capture the first cursor if we have results
                if (results.length > 0) {
                    currentCursor = results[results.length - 1].name;
                }

                // Check if we need to set up the observer
                if (results.length === ITEMS_LENGTH) {
                    const lastItem = itemsList.lastElementChild;
                    setupInfiniteScrollObserver(lastItem, itemsList);
                }
            },
            onClose: () => {
                $("items-modal-overlay").classList.add("hidden");
                $("modal-loading").classList.remove("hidden");
                $("modal-search").value = "";
            },
            onSearchInput: (e) => {
                // if empty, populate initial items
                // 1. Captura o texto escrito pelo utilizador
                const query = e.target.value.trim();

                // 2. Limpa o timer anterior se o utilizador continuar a escrever (Debounce)
                clearTimeout(searchTimeout);

                // 3. Define um novo timer para executar a pesquisa após 300ms de inatividade
                searchTimeout = setTimeout(async () => {
                    // Atualiza os estados para uma nova pesquisa limpa
                    currentSearchQuery = query;
                    currentCursor = "";

                    // Desconecta o observer antigo para evitar conflitos
                    if (modalObserver) modalObserver.disconnect();

                    // Prepara a UI: Limpa a lista e mostra o spinner principal
                    const itemsList = $("items-list");
                    itemsList.textContent = "";
                    itemsList.scrollTop = 0;

                    const loading = $("modal-loading");
                    loading.classList.remove("hidden");

                    // Dispara a pesquisa
                    const results = await loadProductsData(currentSearchQuery, currentCursor);
                    loading.classList.add("hidden");

                    // Se a pesquisa não retornar nada, mostra o EmptySearchState
                    if (results.length === 0) {
                        itemsList.appendChild(EmptySearchState());
                        return; // Sai da função cedo, não há nada para renderizar
                    }

                    // Se encontrou resultados, atualiza o cursor para o último item desta nova lista
                    currentCursor = results[results.length - 1].name;

                    // Mapeia os itens que já estão no carrinho
                    const cartItems = {};
                    quotation.items.forEach(item => {
                        cartItems[item.ref] = item;
                    });

                    // Renderiza e injeta os novos resultados
                    results.forEach(item => {
                        const cartItem = cartItems[item.ref];
                        const viewData = toModalViewModel(cartItem, item);
                        itemsList.appendChild(ModalItem(!!cartItem, item, viewData, events.modal));
                    });

                    // Verifica se precisamos do Observer
                    if (results.length === ITEMS_LENGTH) {
                        const lastItem = itemsList.lastElementChild;
                        setupInfiniteScrollObserver(lastItem, itemsList);
                    }
                }, 300); // 300ms de atraso
            },
            onAddItem: (item) => {
                // 1. Toggle Modal Button States
                $(`modal-item-status-${item.ref}`).classList.toggle("hidden");
                $(`modal-remove-btn-${item.ref}`).classList.toggle("hidden");
                $(`modal-add-btn-${item.ref}`).classList.toggle("hidden");

                // 2. Prepare the new Quote Item object
                const quoteItem = {
                    ...item,
                    quantity: parseFloat($(`modal-qty-${item.ref}`).value) || 1,
                    discount: parseFloat($(`modal-disc-${item.ref}`).value) || 0,
                    taxRate: TAX_RATE
                };

                // 3. Calculate initial values
                const initialVals = calculateLineTotals(quoteItem.unitPrice, quoteItem.quantity, quoteItem.discount, TAX_RATE);
                quoteItem.totalLine = initialVals.subtotal;

                // 4. Update the Modal UI Total
                $(`modal-total-line-${item.ref}`).textContent = formatByCurrencySymbol(initialVals.subtotal);

                // 5. Update Global State
                quotation.items.push(quoteItem);

                // 6. Generate and Append the DOM node
                const newRow = QuoteRow(quoteItem, toQuoteRowViewModel(quoteItem), events.row);
                const tbody = $("items-tbody");

                // Handle Empty State Removal
                if (quotation.items.length === 1) {
                    tbody.textContent = "";
                }
                tbody.appendChild(newRow);

                // 7. Update Global Totals using the Delta Logic
                // We pass 0 as the old subtotal because we are adding a brand new item
                applyTotalDelta(quotation.totals, 0, initialVals.subtotal, TAX_RATE);

                // 8. Update Totals UI
                updateQuotationTotals(quotation.totals);
            },
            onRemoveItem: (item) => {
                // 1. Toggle UI buttons
                $(`modal-item-status-${item.ref}`).classList.toggle("hidden");
                $(`modal-remove-btn-${item.ref}`).classList.toggle("hidden");
                $(`modal-add-btn-${item.ref}`).classList.toggle("hidden");

                // 2. Reset modal inputs visually
                $(`modal-qty-${item.ref}`).value = 1;
                $(`modal-disc-${item.ref}`).value = 0;

                // 3. Reset the modal's line total label back to 1x unit price
                const defaultVals = calculateLineTotals(item.unitPrice, 1, 0, TAX_RATE);
                $(`modal-total-line-${item.ref}`).textContent =
                    formatByCurrencySymbol(defaultVals.subtotal);

                // 4. THE FIX: Find the actual stateful item that has the quantity/discount data
                const cartItem = quotation.items.find(i => i.ref === item.ref);

                // 5. Pass the cartItem to the row logic, not the raw database item
                events.row.onRemove(cartItem);
            },
            onQtyAdd: (item) => {
                const newQty = Number($(`modal-qty-${item.ref}`).value) + 1;
                const newDisc = Number($(`modal-disc-${item.ref}`).value);
                const initialVals = calculateLineTotals(item.unitPrice, newQty, newDisc, TAX_RATE);

                updateUIAndState(item, newQty, newDisc, initialVals);
            },

            onQtyRemove: (item) => {
                const currentQty = Number($(`modal-qty-${item.ref}`).value);

                if (currentQty <= 1) return;

                const newQty = currentQty - 1;
                const newDisc = Number($(`modal-disc-${item.ref}`).value);
                const initialVals = calculateLineTotals(item.unitPrice, newQty, newDisc, TAX_RATE);

                updateUIAndState(item, newQty, newDisc, initialVals);
            },
            onQtyChange: (e, item) => {
                const input = e.target;
                const safeQty = sanitizeQuantity(input.value);
                input.value = safeQty; // Update UI first

                const newDisc = Number($(`modal-disc-${item.ref}`).value);
                const initialVals = calculateLineTotals(item.unitPrice, safeQty, newDisc, TAX_RATE);

                updateUIAndState(item, safeQty, newDisc, initialVals);
            },
            onDiscAdd: (item) => {
                const currentDisc = Number($(`modal-disc-${item.ref}`).value);

                if (currentDisc < 100) {
                    const newDisc = currentDisc + 1;
                    const newQty = Number($(`modal-qty-${item.ref}`).value);
                    const initialVals = calculateLineTotals(item.unitPrice, newQty, newDisc, TAX_RATE);

                    $(`modal-disc-${item.ref}`).value = newDisc;
                    updateUIAndState(item, newQty, newDisc, initialVals);
                }
            },
            onDiscChange: (e, item) => {
                const input = e.target;
                const safeDisc = sanitizeDiscount(input.value);
                input.value = safeDisc; // Update UI first
                const newQty = Number($(`modal-qty-${item.ref}`).value);
                const initialVals = calculateLineTotals(item.unitPrice, newQty, safeDisc, TAX_RATE);
                updateUIAndState(item, newQty, safeDisc, initialVals);
            },
            onDiscRemove: (item) => {
                const currentDisc = Number($(`modal-disc-${item.ref}`).value);
                if (currentDisc > 0) {
                    const newDisc = currentDisc - 1;
                    const newQty = Number($(`modal-qty-${item.ref}`).value);
                    const initialVals = calculateLineTotals(item.unitPrice, newQty, newDisc, TAX_RATE);

                    $(`modal-disc-${item.ref}`).value = newDisc;
                    updateUIAndState(item, newQty, newDisc, initialVals);
                }
            },
        },
        row: {
            onQtyChange: (e, item) => {
                const input = e.target;
                const safeQty = sanitizeQuantity(input.value);
                input.value = safeQty; // Update UI first
                handleLineUpdate(item, safeQty, item.discount);
            },
            onQtyAdd: (item) => {
                handleLineUpdate(item, item.quantity + 1, item.discount)
            },
            onQtyRemove: (item) => {
                if (item.quantity <= 1) return;
                handleLineUpdate(item, item.quantity - 1, item.discount);
            },
            onDiscChange: (e, item) => {
                const input = e.target;
                const safeDisc = sanitizeDiscount(input.value);
                input.value = safeDisc; // Update UI first
                handleLineUpdate(item, item.quantity, safeDisc);
            },
            onDiscAdd: (e, item) => {
                if (item.discount < 100) {
                    handleLineUpdate(item, item.quantity, item.discount + 1);
                }
            },
            onDiscRemove: (e, item) => {
                if (item.discount > 0) {
                    handleLineUpdate(item, item.quantity, item.discount - 1);
                }
            },

            onRemove: (item) => {
                handleLineUpdate(item, 0, 0);
                const qtyInput = $(`qty-${item.ref}`);

                const row = qtyInput.closest("tr");
                const tbody = row.parentElement;
                row.remove();

                quotation.items = quotation.items.filter(i => i.ref !== item.ref);
                if (quotation.items.length === 0) {
                    tbody.appendChild(EmptyTableState());
                }
            },
            onToggleGlobalDiscount: e => {
                const isChecked = e.target.checked;
                const discInput = $("globalDiscountInput");

                // 1. Ativa/Desativa o input de texto
                discInput.disabled = !isChecked;

                // 2. Define o valor a aplicar (0 se desligou, ou o valor atual se ligou)
                const globalDisc = isChecked ? (Number(discInput.value) || 0) : 0;

                // 3. Limpa o input visualmente se foi desligado
                if (!isChecked) {
                    discInput.value = "";
                }

                // 4. A Mágica: Reutiliza o teu `handleLineUpdate` em loop!
                // Isto vai atualizar o UI de cada linha, recalcular deltas, e atualizar os Totais Globais
                quotation.items.forEach(item => {
                    handleLineUpdate(item, item.quantity, globalDisc);
                });
            },
            onGlobalDiscountInput: (e) => {
                let val = Number(e.target.value);

                // Failsafe: Evitar valores absurdos ou letras
                if (isNaN(val) || val < 0 || val > 100) {
                    val = 0;
                    e.target.value = val;
                }

                // Aplica a nova percentagem a todos os itens instantaneamente
                quotation.items.forEach(item => {
                    handleLineUpdate(item, item.quantity, val);
                });
            }
        }
    };
    return events;
}

const sanitizeQuantity = (value) => {
    const num = Number(value);
    return (isNaN(num) || num < 1) ? 1 : num;
};

const sanitizeDiscount = (value) => {
    const num = Number(value);
    return (isNaN(num) || num < 0 || num > 100) ? 0 : num;
};