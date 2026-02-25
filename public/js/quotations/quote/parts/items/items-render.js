import { createItemsState } from "./logic/items-data-state.js";
import { validateStepperValue, calculateTotals } from "./logic/items-math.js";
import { loadProductsData } from "./logic/items-network.js";
import { ItemsTableWidget, TotalsWidget, ItemsModal, QuoteRow, EmptyTableState, ProductSearchItem } from "./items-viewgen.js";

export function setupItemsModule(quotation) {
    const state = createItemsState(quotation.items || []);
    const events = setupEvents(state);

    const tableUI = ItemsTableWidget(events);
    const totalsUI = TotalsWidget(events);
    const modalUI = ItemsModal(events);

    observeState(state, tableUI.views, totalsUI.views, modalUI.views, events);

    return { tableWidget: tableUI.root, totalsWidget: totalsUI.root, modal: modalUI.root };
}

// --- OBSERVER ---
function observeState(state, tableViews, totalsViews, modalViews, events) {
    const { tbody } = tableViews;
    const { lblSubtotal, lblVat, lblTotal, toggleGlobalDiscount, globalDiscountInput } = totalsViews;
    const { modalOverlay, searchInput, listContainer } = modalViews;

    const CURRENCY = new Intl.NumberFormat('pt-MZ', { minimumFractionDigits: 2 });

    // 1. Live Array Sync & Math
    state.items.on("change", (itemsArray) => {
        state.totals = calculateTotals(itemsArray);

        tbody.textContent = '';
        if (itemsArray.length === 0) {
            tbody.appendChild(EmptyTableState());
        } else {
            itemsArray.forEach((item, index) => {
                tbody.appendChild(QuoteRow(item, index, events));
            });
        }

        // Also re-render search results if modal is open to update the "No Carrinho" badges
        if (state.isModalOpen && state.searchResults.length > 0) {
            renderSearchResults(state.searchResults);
        }
    });

    state.on("totals", (totals) => {
        lblSubtotal.textContent = CURRENCY.format(totals.subtotal);
        lblVat.textContent = CURRENCY.format(totals.vat);
        lblTotal.textContent = CURRENCY.format(totals.total);
    });

    state.on("isGlobalDiscountActive", (isActive) => {
        toggleGlobalDiscount.checked = isActive;
        globalDiscountInput.disabled = !isActive;
    });

    state.on("globalDiscount", (val) => {
        if (globalDiscountInput.value !== String(val)) globalDiscountInput.value = val;
    });

    state.on("isModalOpen", (isOpen) => {
        modalOverlay.classList.toggle("hidden", !isOpen);
        if (isOpen) setTimeout(() => { searchInput.value = ''; searchInput.focus(); }, 50);
    });

    // 2. Search Results Render Function
    const renderSearchResults = (results) => {
        listContainer.textContent = '';
        results.forEach(dbProduct => {
            const isAlreadyAdded = state.items.some(i => i.ref === dbProduct.ref);
            listContainer.appendChild(ProductSearchItem(dbProduct, isAlreadyAdded, events));
        });
    };

    state.on("searchResults", renderSearchResults);
}

// --- EVENTS FACTORY ---
const setupEvents = (state) => {
    let debounceTimer = null;

    return {
        onOpenModal: () => state.isModalOpen = true,
        onCloseModal: () => state.isModalOpen = false,

        // Flat Schema Product Selection
        onProductSelect: (dbProduct) => {
            const existingIndex = state.items.findIndex(i => i.ref === dbProduct.ref);
            if (existingIndex > -1) {
                // If already in cart, just increment quantity
                state.items[existingIndex].quantity++;
            } else {
                // Push standard flat object
                state.items.push({
                    ref: dbProduct.ref,
                    name: dbProduct.name,
                    unitPrice: dbProduct.price,
                    quantity: 1,
                    discount: state.isGlobalDiscountActive ? state.globalDiscount : 0
                });
            }
        },

        onToggleGlobalDiscount: (e) => {
            const isActive = e.target.checked;
            state.isGlobalDiscountActive = isActive;
            if (!isActive) state.globalDiscount = 0;
            state.items.forEach(item => item.discount = state.globalDiscount);
            state.items.splice(0, 0);
        },

        onGlobalDiscountInput: (e) => {
            const safeDisc = validateStepperValue(e.target.value, 0, 100);
            state.globalDiscount = safeDisc;
            state.items.forEach(item => item.discount = safeDisc);
            state.items.splice(0, 0);
        },

        onUpdateRowQty: (index, rawValue) => state.items[index].quantity = validateStepperValue(rawValue, 1, 100000),
        onUpdateRowDisc: (index, rawValue) => state.items[index].discount = validateStepperValue(rawValue, 0, 100),
        onRemoveRow: (index) => state.items.splice(index, 1),

        // Search Events
        onSearchInput: (e) => {
            const query = e.target.value;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                state.isLoadingSearch = true;
                state.activeSearchQuery = query;
                state.searchOffset = 0;

                const results = await loadProductsData(query, 0);
                state.searchResults = results;
                state.hasMoreResults = results.length >= 20;
                state.isLoadingSearch = false;
            }, 300);
        },

        onSearchScroll: async (e) => {
            const el = e.target;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50 && !state.isBottomLoading && state.hasMoreResults) {
                state.isBottomLoading = true;
                state.searchOffset += 20;
                const newResults = await loadProductsData(state.activeSearchQuery, state.searchOffset);
                state.searchResults = [...state.searchResults, ...newResults];
                state.hasMoreResults = newResults.length >= 20;
                state.isBottomLoading = false;
            }
        }
    };
};