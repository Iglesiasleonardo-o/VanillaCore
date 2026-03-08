import { globalState } from "../../../../vanilla-core/vanilla-global-state.js";
import { BottomLoader, EmptySearchState, ItemsModalWidget, ModalItem } from "./items-viewgen.js";
import { formatByCurrency, formatByCurrencySymbol, toModalViewModel, toQuoteRowViewModel, toTotalsViewModel } from "./items-viewmodel.js";
import { applyTotalDelta, calculateLineTotals } from "./logic/items-math.js";
import { loadProductsData } from "./logic/items-network.js";
import { EmptyTableState, ItemsTableWidget, QuoteRow, TotalsWidget } from "./table-viewgen.js";

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

    // --- REUSABLE UTILITY & UI HELPERS ---

    function updateQuotationTotals(totals) {
        $(`lblSubtotal`).textContent = formatByCurrencySymbol(totals.subtotal);
        $(`lblVat`).textContent = formatByCurrencySymbol(totals.taxTotal);
        $(`lblTotal`).textContent = formatByCurrencySymbol(totals.grandTotal);
    }

    const refreshTotals = (oldSubtotal, newSubtotal) => {
        const quoteTotals = quotation.totals;
        applyTotalDelta(quoteTotals, oldSubtotal, newSubtotal, TAX_RATE);
        updateQuotationTotals(quoteTotals);
    };

    const clearAndGetItemsList = () => {
        const itemsList = $("items-list");
        itemsList.textContent = "";
        itemsList.scrollTop = 0;
        return itemsList;
    };

    const toggleModalItemButtons = (itemRef) => {
        $(`modal-item-status-${itemRef}`).classList.toggle("hidden");
        $(`modal-remove-btn-${itemRef}`).classList.toggle("hidden");
        $(`modal-add-btn-${itemRef}`).classList.toggle("hidden");
    };

    const renderModalItems = (results, itemsList, modalEvents) => {
        const cartItemsMap = buildCartItems(quotation);
        results.forEach(item => {
            const cartItem = cartItemsMap[item.ref];
            const viewData = toModalViewModel(cartItem, item);
            itemsList.appendChild(ModalItem(!!cartItem, item, viewData, modalEvents));
        });
    };

    // --- SHARED DOM & STATE UPDATERS ---

    const handleLineUpdate = (item, newQty, newDisc) => {
        const oldSubtotal = item.totalLine;
        const newVals = calculateLineTotals(item.unitPrice, newQty, newDisc, TAX_RATE);

        item.quantity = newQty;
        item.discount = newDisc;
        item.totalLine = newVals.subtotal;

        const itemRef = item.ref;
        $(`qty-${itemRef}`).value = newQty;
        $(`qty-print-${itemRef}`).textContent = newQty;
        $(`disc-${itemRef}`).value = newDisc;
        $(`disc-print-${itemRef}`).textContent = newDisc;
        $(`total-line-${itemRef}`).textContent = formatByCurrency(newVals.subtotal);

        refreshTotals(oldSubtotal, newVals.subtotal);
    };

    const updateUIAndState = (item, newQty, newDisc, initialVals) => {
        const itemRef = item.ref;

        $(`modal-qty-${itemRef}`).value = newQty;
        $(`modal-total-line-${itemRef}`).textContent = formatByCurrencySymbol(initialVals.subtotal);

        const quoteQtyInput = $(`qty-${itemRef}`);
        if (quoteQtyInput) {
            quoteQtyInput.value = newQty;
            $(`qty-print-${itemRef}`).textContent = newQty;
            $(`disc-${itemRef}`).value = newDisc;
            $(`disc-print-${itemRef}`).textContent = newDisc;
            $(`total-line-${itemRef}`).textContent = formatByCurrency(initialVals.subtotal);

            const quoteItem = quotation.items.find(i => i.ref === itemRef);
            const oldSubtotal = quoteItem.totalLine;

            quoteItem.quantity = newQty;
            quoteItem.discount = newDisc;
            quoteItem.totalLine = initialVals.subtotal;
            quoteItem.taxRate = initialVals.tax;

            refreshTotals(oldSubtotal, initialVals.subtotal);
        }
    };

    const handleModalParamChange = (item, newQty, newDisc) => {
        const initialVals = calculateLineTotals(item.unitPrice, newQty, newDisc, TAX_RATE);
        updateUIAndState(item, newQty, newDisc, initialVals);
    };

    // --- INFINITE SCROLL & SEARCH LOGIC ---

    const setupInfiniteScrollObserver = (targetElement, itemsList) => {
        if (modalObserver) {
            modalObserver.disconnect();
        }

        modalObserver = new IntersectionObserver(async (entries) => {
            const entry = entries[0];
            if (!entry.isIntersecting) return;
            modalObserver.disconnect();

            const loaderNode = BottomLoader();
            itemsList.appendChild(loaderNode);

            const newResults = await loadProductsData(currentSearchQuery, currentCursor);
            loaderNode.remove();

            if (newResults.length > 0) {
                currentCursor = newResults[newResults.length - 1].name;
                renderModalItems(newResults, itemsList, events.modal);
            }

            if (newResults.length >= ITEMS_LENGTH) {
                const newLastItem = itemsList.lastElementChild;
                if (newLastItem) modalObserver.observe(newLastItem);
            }
        }, { root: itemsList, rootMargin: "100px", threshold: 0 });

        modalObserver.observe(targetElement);
    };

    const executeSearch = async (query) => {
        currentSearchQuery = query;
        currentCursor = "";

        if (modalObserver) modalObserver.disconnect();
        const itemsList = clearAndGetItemsList();

        const loading = $("modal-loading");
        loading.classList.remove("hidden");
        const results = await loadProductsData(currentSearchQuery, currentCursor);
        loading.classList.add("hidden");

        if (results.length === 0) {
            itemsList.appendChild(EmptySearchState());
            return;
        }

        currentCursor = results[results.length - 1].name;
        renderModalItems(results, itemsList, events.modal);

        if (results.length === ITEMS_LENGTH) {
            setupInfiniteScrollObserver(itemsList.lastElementChild, itemsList);
        }
    };

    // --- EVENTS DICTIONARY ---

    const events = {
        modal: {
            onOpen: async () => {
                $("items-modal-overlay").classList.remove("hidden");
                $("modal-search").focus();

                // Trigger a fresh default search setup
                await executeSearch("");
            },
            onClose: () => {
                $("items-modal-overlay").classList.add("hidden");
                $("modal-loading").classList.remove("hidden");
                $("modal-search").value = "";
            },
            onSearchInput: (e) => {
                const query = e.target.value.trim();
                clearTimeout(searchTimeout);

                searchTimeout = setTimeout(async () => {
                    await executeSearch(query);
                }, 150);
            },
            onAddItem: (item) => {
                toggleModalItemButtons(item.ref);

                const quoteItem = {
                    ...item,
                    quantity: parseFloat($(`modal-qty-${item.ref}`).value) || 1,
                    discount: parseFloat($(`modal-disc-${item.ref}`).value) || 0,
                    taxRate: TAX_RATE
                };

                const initialVals = calculateLineTotals(quoteItem.unitPrice, quoteItem.quantity, quoteItem.discount, TAX_RATE);
                quoteItem.totalLine = initialVals.subtotal;
                $(`modal-total-line-${item.ref}`).textContent = formatByCurrencySymbol(initialVals.subtotal);

                quotation.items.push(quoteItem);

                const newRow = QuoteRow(quoteItem, toQuoteRowViewModel(quoteItem), events.row);
                const tbody = $("items-tbody");

                if (quotation.items.length === 1) {
                    tbody.textContent = "";
                }

                tbody.appendChild(newRow);
                refreshTotals(0, initialVals.subtotal);
            },
            onRemoveItem: (item) => {
                toggleModalItemButtons(item.ref);

                $(`modal-qty-${item.ref}`).value = 1;
                $(`modal-disc-${item.ref}`).value = 0;

                const defaultVals = calculateLineTotals(item.unitPrice, 1, 0, TAX_RATE);
                $(`modal-total-line-${item.ref}`).textContent = formatByCurrencySymbol(defaultVals.subtotal);

                const cartItem = quotation.items.find(i => i.ref === item.ref);
                events.row.onRemove(cartItem);
            },
            onQtyAdd: (item) => {
                const newQty = Number($(`modal-qty-${item.ref}`).value) + 1;
                const newDisc = Number($(`modal-disc-${item.ref}`).value);
                handleModalParamChange(item, newQty, newDisc);
            },
            onQtyRemove: (item) => {
                const currentQty = Number($(`modal-qty-${item.ref}`).value);
                if (currentQty <= 1) return;

                const newQty = currentQty - 1;
                const newDisc = Number($(`modal-disc-${item.ref}`).value);
                handleModalParamChange(item, newQty, newDisc);
            },
            onQtyChange: (e, item) => {
                const safeQty = sanitizeQuantity(e.target.value);
                e.target.value = safeQty;

                const newDisc = Number($(`modal-disc-${item.ref}`).value);
                handleModalParamChange(item, safeQty, newDisc);
            },
            onDiscAdd: (item) => {
                const currentDisc = Number($(`modal-disc-${item.ref}`).value);
                if (currentDisc < 100) {
                    const newDisc = currentDisc + 1;
                    const newQty = Number($(`modal-qty-${item.ref}`).value);

                    $(`modal-disc-${item.ref}`).value = newDisc;
                    handleModalParamChange(item, newQty, newDisc);
                }
            },
            onDiscChange: (e, item) => {
                const safeDisc = sanitizeDiscount(e.target.value);
                e.target.value = safeDisc;

                const newQty = Number($(`modal-qty-${item.ref}`).value);
                handleModalParamChange(item, newQty, safeDisc);
            },
            onDiscRemove: (item) => {
                const currentDisc = Number($(`modal-disc-${item.ref}`).value);
                if (currentDisc > 0) {
                    const newDisc = currentDisc - 1;
                    const newQty = Number($(`modal-qty-${item.ref}`).value);

                    $(`modal-disc-${item.ref}`).value = newDisc;
                    handleModalParamChange(item, newQty, newDisc);
                }
            },
        },
        row: {
            onQtyChange: (e, item) => {
                const safeQty = sanitizeQuantity(e.target.value);
                e.target.value = safeQty;
                handleLineUpdate(item, safeQty, item.discount);
            },
            onQtyAdd: (item) => {
                handleLineUpdate(item, item.quantity + 1, item.discount);
            },
            onQtyRemove: (item) => {
                if (item.quantity <= 1) return;
                handleLineUpdate(item, item.quantity - 1, item.discount);
            },
            onDiscChange: (e, item) => {
                const safeDisc = sanitizeDiscount(e.target.value);
                e.target.value = safeDisc;
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

                discInput.disabled = !isChecked;
                const globalDisc = isChecked ? (Number(discInput.value) || 0) : 0;

                if (!isChecked) {
                    discInput.value = "";
                }

                quotation.items.forEach(item => {
                    handleLineUpdate(item, item.quantity, globalDisc);
                });
            },
            onGlobalDiscountInput: (e) => {
                let val = Number(e.target.value);

                if (isNaN(val) || val < 0 || val > 100) {
                    val = 0;
                    e.target.value = val;
                }

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

const buildCartItems = (quotation) => {
    const cartItems = {};
    quotation.items.forEach(item => {
        cartItems[item.ref] = item;
    });
    return cartItems;
}