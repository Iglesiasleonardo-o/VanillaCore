import { createItemsState } from "./logic/items-data-state.js";
import { validateStepperValue, calculateTotals } from "./logic/items-math.js";
import { loadProductsData } from "./logic/items-network.js";
import { ItemsTableWidget, TotalsWidget, ItemsModal, QuoteRow, ProductSearchItem, EmptyTableState, EmptySearchState, LoadingState, BottomLoader, createIcon } from "./items-viewgen.js";

// AQUI
const TRASH_ICON = "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16";
const PLUS_ICON = "M12 4v16m8-8H4";

export function setupItemsModule(quotation) {
    const draftStates = new Map(); // Guarda qtd/disc do modal antes de adicionar
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

    const CURRENCY = new Intl.NumberFormat('pt-MZ', { minimumFractionDigits: 2 });
    const CURRENCY_SYMBOL = new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' });

    const updateStepperUI = (stepperViews, value) => {
        if (stepperViews.input.value !== String(value)) stepperViews.input.value = value;
        stepperViews.print.textContent = value;
    };

    const updateQuoteRowUI = (views, item) => {
        updateStepperUI(views.qty, item.quantity);
        updateStepperUI(views.disc, item.discount || 0);
        const total = (item.unitPrice * item.quantity) * (1 - ((item.discount || 0) / 100));
        views.lblTotal.textContent = CURRENCY.format(total);
    };

    const updateSearchItemUI = (views, dbProduct, cartItem) => {
        const isAdded = !!cartItem;
        const draft = draftStates.get(dbProduct.ref) || { qty: 1, disc: 0 };
        const currentQty = isAdded ? cartItem.quantity : draft.qty;
        const currentDisc = isAdded ? cartItem.discount : draft.disc;
        const total = (dbProduct.unitPrice * currentQty) * (1 - currentDisc / 100);

        updateStepperUI(views.qty, currentQty);
        updateStepperUI(views.disc, currentDisc);
        views.lblTotal.textContent = CURRENCY.format(total) + " MT";

        views.lblStatus.textContent = isAdded ? "No Carrinho" : "";
        views.lblStatus.className = isAdded ? "text-[10px] text-blue-600 font-bold px-1.5 py-0.5 bg-blue-100 rounded mt-1" : "hidden";

        views.btnAction.className = `mt-1 flex items-center justify-center w-8 h-8 rounded-lg transition-all shadow-sm ${isAdded ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`;
        views.btnAction.replaceChildren(createIcon(isAdded ? TRASH_ICON : PLUS_ICON, "w-5 h-5"));
    };

    // --- SINCRONIZADOR MESTRE OTIMIZADO ---
    const syncCartUI = () => {
        state.totals = calculateTotals(state.items);

        if (state.items.length === 0) {
            tbody.replaceChildren(EmptyTableState());
        } else {
            if (tbody.children[0] && !tbody.children[0].dataset.ref) {
                tbody.textContent = '';
            }

            const existingRows = new Map();
            Array.from(tbody.children).forEach(tr => {
                if (tr.dataset.ref) existingRows.set(tr.dataset.ref, tr);
            });

            tbody.textContent = '';

            state.items.forEach(item => {
                let tr = existingRows.get(item.ref);

                if (tr) {
                    updateQuoteRowUI(tr._views, item);
                    tbody.appendChild(tr);
                    existingRows.delete(item.ref);
                } else {
                    // AQUI: Formatar no controlador e passar para a View
                    const formattedPrice = CURRENCY.format(item.unitPrice);
                    const { root, views } = QuoteRow(item, formattedPrice);

                    views.qty.btnMinus.onclick = () => events.onRowQtyChange(item.ref, views.qty.input.value - 1);
                    // ... (restantes eventos) ...
                    views.btnRemove.onclick = () => events.onRemoveRow(item.ref);

                    updateQuoteRowUI(views, item);
                    root._views = views;
                    tbody.appendChild(root);
                }
            });
        }

        lblSubtotal.textContent = CURRENCY.format(state.totals.subtotal);
        lblVat.textContent = CURRENCY.format(state.totals.vat);
        lblTotal.textContent = CURRENCY.format(state.totals.total);

        if (state.isModalOpen && listContainer.children.length > 0) {
            const cartItemsMap = new Map(state.items.map(i => [String(i.ref), i]));
            Array.from(listContainer.children).forEach(child => {
                if (child._views && child.dataset.ref) {
                    const dbProduct = state.searchResults.find(p => String(p.ref) === child.dataset.ref);
                    const cartItem = cartItemsMap.get(child.dataset.ref);
                    if (dbProduct) updateSearchItemUI(child._views, dbProduct, cartItem);
                }
            });
        }
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

    // --- RENDERIZAÇÃO DE PESQUISA OTIMIZADA ---
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

        // Otimização Crucial: Set O(1) impede o congelamento do Infinite Scroll (O(N^2) eliminado)
        const renderedRefs = new Set(Array.from(listContainer.children).map(el => el.dataset.ref));
        const cartItemsMap = new Map(state.items.map(i => [i.ref, i]));

        results.forEach(dbProduct => {
            if (renderedRefs.has(dbProduct.ref)) return;

            const { root, views } = ProductSearchItem(dbProduct);

            views.qty.btnMinus.onclick = () => events.onSearchQtyChange(dbProduct.ref, views.qty.input.value - 1);
            views.qty.btnPlus.onclick = () => events.onSearchQtyChange(dbProduct.ref, Number(views.qty.input.value) + 1);
            views.qty.input.onchange = (e) => events.onSearchQtyChange(dbProduct.ref, e.target.value);

            views.disc.btnMinus.onclick = () => events.onSearchDiscChange(dbProduct.ref, views.disc.input.value - 1);
            views.disc.btnPlus.onclick = () => events.onSearchDiscChange(dbProduct.ref, Number(views.disc.input.value) + 1);
            views.disc.input.onchange = (e) => events.onSearchDiscChange(dbProduct.ref, e.target.value);

            views.btnAction.onclick = () => events.onSearchActionClick(dbProduct);

            const cartItem = cartItemsMap.get(dbProduct.ref);
            updateSearchItemUI(views, dbProduct, cartItem);
            root._views = views;
            listContainer.appendChild(root);
        });

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

    const triggerSearch = (query) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            if (state.searchOffset === 0) state.isLoadingSearch = true;
            state.activeSearchQuery = query;
            state.searchOffset = 0;
            const results = await loadProductsData(query, 0);
            state.searchResults = results;
            state.hasMoreResults = results.length >= 20;
            state.isLoadingSearch = false;
        }, 300);
    };

    return {
        onOpenModal: () => {
            state.isModalOpen = true;
            if (state.searchResults.length === 0) {
                state.isLoadingSearch = true; // <-- Força o loading imediatamente
                triggerSearch("");
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
            // Otimização: Adicionado Buffer de 100px para o trigger do loader 
            // e previne travamento algoritmico antes da base exata
            const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

            if (distanceToBottom <= 100 && !state.isBottomLoading && state.hasMoreResults) {
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