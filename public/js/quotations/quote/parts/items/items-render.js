import { BottomLoader, EmptySearchState, EmptyTableState, ItemsModalWidget, ItemsTableWidget, ModalItem, QuoteRow, TotalsWidget } from "./items-viewgen.js";
import { CURRENCY, CURRENCY_SYMBOL } from "./logic/items-math.js";
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

    const quoteTotals = quotation.totals;
    const formatedSubtotal = CURRENCY_SYMBOL.format(quoteTotals.subtotal);
    const formatedTaxTotal = CURRENCY_SYMBOL.format(quoteTotals.taxTotal);
    const formatedGrandTotal = CURRENCY_SYMBOL.format(quoteTotals.grandTotal);

    const totalsWidget = TotalsWidget(events.row, formatedSubtotal, formatedTaxTotal, formatedGrandTotal);
    const modalWidget = ItemsModalWidget(events.modal);

    return { tableWidget, totalsWidget, modalWidget };
}

function setupEvents(quotation) {
    const TAX_RATE = 0.16;
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

            if (newResults.length < ITEMS_LENGTH) {

            } else {
                // We have a full batch, attach observer to the NEW last element
                const newLastItem = itemsList.lastElementChild;
                if (newLastItem) modalObserver.observe(newLastItem);
            }
        }, {
            root: itemsList,
            rootMargin: "100px",
            threshold: 0
        });

        modalObserver.observe(targetElement);
    };

    // Helper: Explicitly accepts item to avoid reference errors
    const calculateLine = (item, qty, disc) => {
        const subtotal = (item.unitPrice * qty) * (1 - (disc / 100));
        return { subtotal, tax: subtotal * TAX_RATE };
    };

    const handleLineUpdate = (item, newQty, newDisc) => {
        // 1. Calculate deltas based on current item object state
        const oldVals = calculateLine(item, item.quantity, item.discount);
        const newVals = calculateLine(item, newQty, newDisc);

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

        // Use currency formatter to match unitPrice style
        $(`total-line-${itemRef}`).textContent = CURRENCY.format(newVals.subtotal.toFixed(2));

        // 4. Update Global Totals (O(1) Delta)
        const quoteTotals = quotation.totals;
        quoteTotals.subtotal += (newVals.subtotal - oldVals.subtotal);
        quoteTotals.taxTotal += (newVals.tax - oldVals.tax);
        quoteTotals.grandTotal = quoteTotals.subtotal + quoteTotals.taxTotal;

        // 5. Update Labels
        updateQuotationTotals(quoteTotals);
    };

    const updateUIAndState = (item, newQty, newDisc, initialVals) => {
        // 1. Update DOM Elements
        const itemRef = item.ref;
        // Modal
        $(`modal-qty-${itemRef}`).value = newQty;
        $(`modal-total-line-${itemRef}`).textContent = CURRENCY_SYMBOL.format(initialVals.subtotal.toFixed(2));

        // Main Table
        const quoteQtyInput = $(`qty-${itemRef}`);
        if (quoteQtyInput) {
            quoteQtyInput.value = newQty;
            $(`qty-print-${itemRef}`).textContent = newQty;
            $(`disc-${itemRef}`).value = newDisc;
            $(`disc-print-${itemRef}`).textContent = newDisc;
            $(`total-line-${itemRef}`).textContent = CURRENCY.format(initialVals.subtotal.toFixed(2));


            // 2. Update Data Source
            const quoteItem = quotation.items.find(i => i.ref === itemRef);
            const oldSubtotal = quoteItem.totalLine;

            quoteItem.quantity = newQty;
            quoteItem.discount = newDisc;
            quoteItem.totalLine = initialVals.subtotal;
            quoteItem.taxRate = initialVals.tax;

            // 3. Update Totals
            const quoteTotals = quotation.totals;
            quoteTotals.subtotal = (quoteTotals.subtotal - oldSubtotal) + initialVals.subtotal;
            quoteTotals.taxTotal = quoteTotals.subtotal * TAX_RATE;
            quoteTotals.grandTotal = quoteTotals.subtotal + quoteTotals.taxTotal;

            updateQuotationTotals(quoteTotals);
        }
    };

    function updateQuotationTotals(totals) {
        $(`lblSubtotal`).textContent = CURRENCY_SYMBOL.format(totals.subtotal);
        $(`lblVat`).textContent = CURRENCY_SYMBOL.format(totals.taxTotal);
        $(`lblTotal`).textContent = CURRENCY_SYMBOL.format(totals.grandTotal);
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
                } else {

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

                    // Verifica se precisamos do Observer ou da EndMessage
                    if (results.length === ITEMS_LENGTH) {
                        const lastItem = itemsList.lastElementChild;
                        setupInfiniteScrollObserver(lastItem, itemsList);
                    } else {

                    }
                }, 300); // 300ms de atraso
            },
            onAddItem: (item) => {
                // 1. Toggle Modal Button States
                $(`modal-item-status-${item.ref}`).classList.toggle("hidden");
                $(`modal-remove-btn-${item.ref}`).classList.toggle("hidden");
                $(`modal-add-btn-${item.ref}`).classList.toggle("hidden");

                // 2. Prepare the new Quote Item object (Source of Truth)
                const quoteItem = {
                    ...item,
                    quantity: parseFloat($(`modal-qty-${item.ref}`).value) || 1,
                    discount: parseFloat($(`modal-disc-${item.ref}`).value) || 0,
                    taxRate: TAX_RATE * 100 // Based on your TAX_RATE constant (0.16 -> 16%)
                };

                // 3. Calculate initial values using your helper
                const initialVals = calculateLine(quoteItem, quoteItem.quantity, quoteItem.discount);
                quoteItem.totalLine = initialVals.subtotal;

                // 4. Update the Modal UI Total
                $(`modal-total-line-${item.ref}`).textContent = CURRENCY_SYMBOL.format(initialVals.subtotal.toFixed(2));

                // 5. Update Global State
                quotation.items.push(quoteItem);

                // 6. Render and Inject into Main Table
                // Create the formatted view data expected by QuoteRow
                const viewData = {
                    unitPrice: CURRENCY.format(quoteItem.unitPrice),
                    totalLine: CURRENCY.format(quoteItem.totalLine)
                };

                // Generate the DOM node
                const newRow = QuoteRow(quoteItem, viewData, events.row);

                // Select your table body (you may need to add an ID to your tbody if you don't have one)
                const tbody = $("items-tbody");

                // Handle Empty State Removal
                // If this is the first item, clear out the EmptyTableState placeholder
                if (quotation.items.length === 1) {
                    tbody.textContent = "";
                }

                tbody.appendChild(newRow);

                // 8. Update Global Totals
                const quoteTotals = quotation.totals;
                quoteTotals.subtotal += initialVals.subtotal;
                quoteTotals.taxTotal += initialVals.tax;
                quoteTotals.grandTotal = quoteTotals.subtotal + quoteTotals.taxTotal;

                // 9. Update Totals UI
                updateQuotationTotals(quoteTotals);
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
                const defaultVals = calculateLine(item, 1, 0);
                $(`modal-total-line-${item.ref}`).textContent = CURRENCY_SYMBOL.format(defaultVals.subtotal.toFixed(2));

                // 4. THE FIX: Find the actual stateful item that has the quantity/discount data
                const cartItem = quotation.items.find(i => i.ref === item.ref);

                // 5. Pass the cartItem to the row logic, not the raw database item
                events.row.onRemove(cartItem);
            },
            onQtyAdd: (item) => {
                const newQty = Number($(`modal-qty-${item.ref}`).value) + 1;
                const newDisc = Number($(`modal-disc-${item.ref}`).value);
                const initialVals = calculateLine(item, newQty, newDisc);

                updateUIAndState(item, newQty, newDisc, initialVals);
            },

            onQtyRemove: (item) => {
                const currentQty = Number($(`modal-qty-${item.ref}`).value);

                if (currentQty <= 1) return;

                const newQty = currentQty - 1;
                const newDisc = Number($(`modal-disc-${item.ref}`).value);
                const initialVals = calculateLine(item, newQty, newDisc);

                updateUIAndState(item, newQty, newDisc, initialVals);
            },
            onQtyChange: (e, item) => {
                const input = e.target;
                let val = Number(input.value);

                // Failsafe: Reset to 1 if invalid
                if (isNaN(val) || val < 1) {
                    val = 1;
                    input.value = val;
                }

                const newDisc = Number($(`modal-disc-${item.ref}`).value);
                const initialVals = calculateLine(item, val, newDisc);

                updateUIAndState(item, val, newDisc, initialVals);
            },
            onDiscAdd: (item) => {
                const currentDisc = Number($(`modal-disc-${item.ref}`).value);

                if (currentDisc < 100) {
                    const newDisc = currentDisc + 1;
                    const newQty = Number($(`modal-qty-${item.ref}`).value);
                    const initialVals = calculateLine(item, newQty, newDisc);

                    $(`modal-disc-${item.ref}`).value = newDisc;
                    updateUIAndState(item, newQty, newDisc, initialVals);
                }
            },
            onDiscChange: (e, item) => {
                const input = e.target;
                let val = Number(input.value);

                // Failsafe: Reset to 0 if invalid
                if (isNaN(val) || val < 0 || val > 100) {
                    val = 0;
                    input.value = val;
                }

                const newQty = Number($(`modal-qty-${item.ref}`).value);
                const initialVals = calculateLine(item, newQty, val);

                updateUIAndState(item, newQty, val, initialVals);
            },
            onDiscRemove: (item) => {
                const currentDisc = Number($(`modal-disc-${item.ref}`).value);
                if (currentDisc > 0) {
                    const newDisc = currentDisc - 1;
                    const newQty = Number($(`modal-qty-${item.ref}`).value);
                    const initialVals = calculateLine(item, newQty, newDisc);

                    $(`modal-disc-${item.ref}`).value = newDisc;
                    updateUIAndState(item, newQty, newDisc, initialVals);
                }
            },
        },
        row: {
            // --- QTY ---
            onQtyChange: (e, item) => {
                const input = e.target;
                let val = Number(input.value);

                // Failsafe: Reset to 1
                if (isNaN(val) || val < 1) {
                    val = 1;
                    input.value = val;
                }

                handleLineUpdate(item, val, item.discount);
            },
            onQtyAdd: (item) => {
                handleLineUpdate(item, item.quantity + 1, item.discount)
            },
            onQtyRemove: (item) => {
                if (item.quantity <= 1) return;
                handleLineUpdate(item, item.quantity - 1, item.discount);
            },

            // --- DISC ---
            onDiscChange: (e, item) => {
                const input = e.target;
                let val = Number(input.value);

                // Failsafe: Reset to 0
                if (isNaN(val) || val < 0 || val > 100) {
                    val = 0;
                    input.value = val;
                }

                handleLineUpdate(item, item.quantity, val);
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

const toQuoteRowViewModel = (quoteItem) => ({
    unitPrice: CURRENCY_SYMBOL.format(quoteItem.unitPrice),
    totalLine: CURRENCY_SYMBOL.format(quoteItem.totalLine)
});

const toModalViewModel = (cartItem, item) => {
    if (cartItem) {
        return {
            unitPrice: CURRENCY_SYMBOL.format(cartItem.unitPrice),
            totalLine: CURRENCY_SYMBOL.format(cartItem.totalLine),
            quantity: cartItem.quantity,
            discount: cartItem.discount
        };
    }
    return {
        unitPrice: CURRENCY_SYMBOL.format(item.unitPrice),
        totalLine: CURRENCY_SYMBOL.format(item.unitPrice),
        quantity: 1,
        discount: 0
    };
};