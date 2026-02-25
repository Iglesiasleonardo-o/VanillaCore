import { createItemsState } from "./logic/items-data-state.js";
import { validateStepperValue, calculateTotals, calculateLineTotal } from "./logic/items-math.js";
import { loadProductsData } from "./logic/items-network.js";
import { ItemsTableWidget, TotalsWidget, ItemsModal, QuoteRow, ProductSearchItem, EmptyTableState, EmptySearchState, LoadingState, BottomLoader, updateActionBtnUI } from "./items-viewgen.js";

export function setupItemsModule(quotation) {
    const draftStates = new Map();
    const state = createItemsState(quotation.items || []);
    const events = setupEvents(state, draftStates);

    const tableUI = ItemsTableWidget(events);
    const totalsUI = TotalsWidget(events);
    const modalUI = ItemsModal(events);

    observeState(state, tableUI.views, totalsUI.views, modalUI.views, events, draftStates);

    return { tableWidget: tableUI.root, totalsWidget: totalsUI.root, modal: modalUI.root };
}

// --- OBSERVER ---
function observeState(state, tableViews, totalsViews, modalViews, events, draftStates) {
    const { tbody } = tableViews;
    const { lblSubtotal, lblVat, lblTotal, toggleGlobalDiscount, globalDiscountInput } = totalsViews;
    const { modalOverlay, searchInput, listContainer } = modalViews;

    const CURRENCY = new Intl.NumberFormat('pt-MZ', { minimumFractionDigits: 2 }); // Apenas número
    const CURRENCY_SYMBOL = new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }); // Com moeda para os totais

    const updateStepperUI = (stepperViews, value) => {
        if (stepperViews.input.value !== String(value)) stepperViews.input.value = value;
        stepperViews.print.textContent = value;
    };

    const updateQuoteRowUI = (views, item) => {
        updateStepperUI(views.qty, item.quantity);
        updateStepperUI(views.disc, item.discount || 0);
        const total = calculateLineTotal(item.unitPrice, item.quantity, item.discount || 0);
        // Total da linha TEM a moeda (MZN)
        views.lblTotal.textContent = CURRENCY.format(total);
    };

    const updateSearchItemUI = (views, dbProduct, cartItem) => {
        const isAdded = !!cartItem;
        const draft = draftStates.get(dbProduct.ref) || { qty: 1, disc: 0 };
        const currentQty = Number(isAdded ? cartItem.quantity : draft.qty);
        const currentDisc = Number(isAdded ? cartItem.discount : draft.disc);

        const total = calculateLineTotal(dbProduct.unitPrice, currentQty, currentDisc);

        updateStepperUI(views.qty, currentQty);
        updateStepperUI(views.disc, currentDisc);

        // Total da pesquisa TEM a moeda
        views.lblTotal.textContent = CURRENCY_SYMBOL.format(total);

        views.lblStatus.textContent = isAdded ? "No Carrinho" : "";
        views.lblStatus.className = isAdded ? "text-[10px] text-blue-600 font-bold px-1.5 py-0.5 bg-blue-100 rounded mt-1" : "hidden";

        updateActionBtnUI(views.btnAction, isAdded);
    };

    // --- ALGORITMO IN-PLACE OTIMIZADO ---
    const syncTableUI = () => {
        state.totals = calculateTotals(state.items);

        // Totais finais TÊM a moeda
        lblSubtotal.textContent = CURRENCY_SYMBOL.format(state.totals.subtotal);
        lblVat.textContent = CURRENCY_SYMBOL.format(state.totals.vat);
        lblTotal.textContent = CURRENCY_SYMBOL.format(state.totals.total);

        if (state.items.length === 0) {
            tbody.replaceChildren(EmptyTableState());
            return;
        }

        if (tbody.children[0] && !tbody.children[0].dataset.ref) tbody.textContent = '';

        state.items.forEach((item, index) => {
            let tr = tbody.children[index];
            if (tr && tr.dataset.ref === String(item.ref)) {
                updateQuoteRowUI(tr._views, item);
            } else {
                // Preço unitário enviado SEM a moeda, apenas formatado visualmente
                const { root, views } = QuoteRow(item, CURRENCY.format(item.unitPrice));

                views.qty.btnMinus.onclick = () => events.onRowQtyChange(item.ref, views.qty.input.value - 1);
                views.qty.btnPlus.onclick = () => events.onRowQtyChange(item.ref, Number(views.qty.input.value) + 1);
                views.qty.input.onchange = (e) => events.onRowQtyChange(item.ref, e.target.value);

                views.disc.btnMinus.onclick = () => events.onRowDiscChange(item.ref, views.disc.input.value - 1);
                views.disc.btnPlus.onclick = () => events.onRowDiscChange(item.ref, Number(views.disc.input.value) + 1);
                views.disc.input.onchange = (e) => events.onRowDiscChange(item.ref, e.target.value);

                views.btnRemove.onclick = () => events.onRemoveRow(item.ref);

                updateQuoteRowUI(views, item);
                root._views = views;
                if (tr) tbody.insertBefore(root, tr);
                else tbody.appendChild(root);
            }
        });

        while (tbody.children.length > state.items.length) tbody.removeChild(tbody.lastChild);
    };

    const syncSearchUI = () => {
        if (!state.isModalOpen || listContainer.children.length === 0) return;
        const cartItemsMap = new Map(state.items.map(i => [String(i.ref), i]));

        Array.from(listContainer.children).forEach(child => {
            if (child._views && child.dataset.ref) {
                const dbProduct = state.searchResults.find(p => String(p.ref) === child.dataset.ref);
                const cartItem = cartItemsMap.get(child.dataset.ref);
                if (dbProduct) updateSearchItemUI(child._views, dbProduct, cartItem);
            }
        });
    };

    const syncCartUI = () => {
        syncTableUI();
        syncSearchUI();
    };

    syncCartUI();
    state.on("syncTrigger", syncCartUI);

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

    const buildSearchList = (results) => {
        const oldLoader = document.getElementById("infinite-scroll-loader");
        if (oldLoader) oldLoader.remove();

        if (state.isLoadingSearch && state.searchOffset === 0) {
            listContainer.replaceChildren(LoadingState());
            return;
        }

        if (results.length === 0 && !state.isLoadingSearch) {
            listContainer.replaceChildren(EmptySearchState());
            return;
        }

        if (state.searchOffset === 0) listContainer.textContent = '';

        const renderedRefs = new Set(Array.from(listContainer.children).map(el => el.dataset.ref));

        results.forEach(dbProduct => {
            if (renderedRefs.has(String(dbProduct.ref))) return;

            const { root, views } = ProductSearchItem(dbProduct);

            views.qty.btnMinus.onclick = () => events.onSearchQtyChange(dbProduct.ref, views.qty.input.value - 1);
            views.qty.btnPlus.onclick = () => events.onSearchQtyChange(dbProduct.ref, Number(views.qty.input.value) + 1);
            views.qty.input.onchange = (e) => events.onSearchQtyChange(dbProduct.ref, e.target.value);

            views.disc.btnMinus.onclick = () => events.onSearchDiscChange(dbProduct.ref, views.disc.input.value - 1);
            views.disc.btnPlus.onclick = () => events.onSearchDiscChange(dbProduct.ref, Number(views.disc.input.value) + 1);
            views.disc.input.onchange = (e) => events.onSearchDiscChange(dbProduct.ref, e.target.value);

            views.btnAction.onclick = () => events.onSearchActionClick(dbProduct);

            root._views = views;
            listContainer.appendChild(root);
        });

        syncSearchUI();

        if (state.isBottomLoading) listContainer.appendChild(BottomLoader());
    };

    state.on("searchResults", buildSearchList);
    state.on("isLoadingSearch", () => buildSearchList(state.searchResults));
    state.on("isBottomLoading", () => buildSearchList(state.searchResults));
}

// --- EVENTS FACTORY ---
const setupEvents = (state, draftStates) => {
    let debounceTimer = null;
    const fireSync = () => state.syncTrigger = !state.syncTrigger;

    const getDraft = (ref) => {
        if (!draftStates.has(ref)) draftStates.set(ref, { qty: 1, disc: 0 });
        return draftStates.get(ref);
    };

    const triggerSearch = (query, immediate = false) => {
        clearTimeout(debounceTimer);
        state.activeSearchQuery = query;

        const executeSearch = async () => {
            if (state.searchOffset === 0) state.isLoadingSearch = true;
            state.searchOffset = 0;
            const results = await loadProductsData(query, 0);
            state.searchResults = results;
            state.hasMoreResults = results.length >= 20;
            state.isLoadingSearch = false;
        };

        if (immediate) executeSearch();
        else debounceTimer = setTimeout(executeSearch, 300);
    };

    return {
        onOpenModal: () => {
            state.isModalOpen = true;
            if (state.searchResults.length === 0) {
                triggerSearch("", true);
            }
        },
        onCloseModal: () => state.isModalOpen = false,

        onRowQtyChange: (ref, rawValue) => {
            const index = state.items.findIndex(i => i.ref === ref);
            if (index > -1) state.items[index].quantity = validateStepperValue(rawValue, 1, 100000);
            fireSync();
        },
        onRowDiscChange: (ref, rawValue) => {
            const index = state.items.findIndex(i => i.ref === ref);
            if (index > -1) state.items[index].discount = validateStepperValue(rawValue, 0, 100);
            fireSync();
        },
        onRemoveRow: (ref) => {
            const index = state.items.findIndex(i => i.ref === ref);
            if (index > -1) state.items.splice(index, 1);
            fireSync();
        },

        onSearchQtyChange: (ref, rawValue) => {
            const val = validateStepperValue(rawValue, 1, 100000);
            const index = state.items.findIndex(i => i.ref === ref);
            if (index > -1) state.items[index].quantity = val;
            else getDraft(ref).qty = val;
            fireSync();
        },
        onSearchDiscChange: (ref, rawValue) => {
            const val = validateStepperValue(rawValue, 0, 100);
            const index = state.items.findIndex(i => i.ref === ref);
            if (index > -1) state.items[index].discount = val;
            else getDraft(ref).disc = val;
            fireSync();
        },
        onSearchActionClick: (dbProduct) => {
            const index = state.items.findIndex(i => i.ref === dbProduct.ref);
            if (index > -1) {
                state.items.splice(index, 1);
            } else {
                const draft = getDraft(dbProduct.ref);
                state.items.push({
                    ref: dbProduct.ref,
                    name: dbProduct.name,
                    unitPrice: dbProduct.unitPrice,
                    quantity: draft.qty,
                    discount: draft.disc
                });
            }
            fireSync();
        },

        onToggleGlobalDiscount: (e) => {
            const isActive = e.target.checked;
            state.isGlobalDiscountActive = isActive;
            if (!isActive) state.globalDiscount = 0;
            state.items.forEach(item => item.discount = state.globalDiscount);
            fireSync();
        },
        onGlobalDiscountInput: (e) => {
            const safeDisc = validateStepperValue(e.target.value, 0, 100);
            state.globalDiscount = safeDisc;
            state.items.forEach(item => item.discount = safeDisc);
            fireSync();
        },

        onSearchInput: (e) => triggerSearch(e.target.value),
        onSearchScroll: async (e) => {
            const el = e.target;
            const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

            if (distanceToBottom <= 100 && !state.isBottomLoading && state.hasMoreResults) {
                state.isBottomLoading = true;
                state.searchOffset += 20;
                const newResults = await loadProductsData(state.activeSearchQuery, state.searchOffset);

                state.searchResults.push(...newResults);
                state.searchResults = state.searchResults;

                state.hasMoreResults = newResults.length >= 20;
                state.isBottomLoading = false;
            }
        }
    };
};