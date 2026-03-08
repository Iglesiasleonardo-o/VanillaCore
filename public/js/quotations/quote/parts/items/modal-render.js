import { formatByCurrencySymbol, toModalViewModel, toQuoteRowViewModel } from "./items-viewmodel.js";
import { calculateLineTotals, sanitizeDiscount, sanitizeQuantity } from "./logic/items-math.js";
import { loadProductsData } from "./logic/items-network.js";
import { BottomLoader, EmptySearchState, ItemsModalWidget, ModalItem } from "./modal-viewgen.js";

// Modal-specific UI State
let modalObserver = null;
let currentCursor = 0;
let currentSearchQuery = "";
let searchTimeout;

const ITEMS_LENGTH = 50;

export function setupModalWidget(modalEvents) {
    return ItemsModalWidget(modalEvents);
}

export function setupModalEvents(quotation, updaters, rowEvents, taxRate, QuoteRow) {
    const { refreshTotals, updateUIAndState } = updaters;

    // --- Modal Helpers ---
    const buildCartItems = () => {
        const cartItems = {};
        quotation.items.forEach(item => { cartItems[item.ref] = item; });
        return cartItems;
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

    const handleModalParamChange = (item, newQty, newDisc) => {
        const initialVals = calculateLineTotals(item.unitPrice, newQty, newDisc, taxRate);
        updateUIAndState(item, newQty, newDisc, initialVals);
    };

    // --- Search & Render Logic ---
    const renderModalItems = (results, itemsList, modalEventsRef) => {
        const cartItemsMap = buildCartItems();
        results.forEach(item => {
            const cartItem = cartItemsMap[item.ref];
            const viewData = toModalViewModel(cartItem, item);
            itemsList.appendChild(ModalItem(!!cartItem, item, viewData, modalEventsRef));
        });
    };

    const executeSearch = async (query, modalEventsRef) => {
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
        renderModalItems(results, itemsList, modalEventsRef);

        if (results.length === ITEMS_LENGTH) {
            setupInfiniteScrollObserver(itemsList.lastElementChild, itemsList, modalEventsRef);
        }
    };

    const setupInfiniteScrollObserver = (targetElement, itemsList, modalEventsRef) => {
        if (modalObserver) modalObserver.disconnect();

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
                renderModalItems(newResults, itemsList, modalEventsRef);
            }

            if (newResults.length >= ITEMS_LENGTH) {
                const newLastItem = itemsList.lastElementChild;
                if (newLastItem) modalObserver.observe(newLastItem);
            }
        }, { root: itemsList, rootMargin: "200px", threshold: 0 });

        modalObserver.observe(targetElement);
    };

    // --- Modal Events Dictionary ---
    const modalEvents = {
        onOpen: async () => {
            $("items-modal-overlay").classList.remove("hidden");
            $("modal-search").focus();
            await executeSearch("", modalEvents);
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
                await executeSearch(query, modalEvents);
            }, 150);
        },
        onAddItem: (item) => {
            toggleModalItemButtons(item.ref);

            const quoteItem = {
                ...item,
                quantity: parseFloat($(`modal-qty-${item.ref}`).value) || 1,
                discount: parseFloat($(`modal-disc-${item.ref}`).value) || 0,
                taxRate: taxRate
            };

            const initialVals = calculateLineTotals(quoteItem.unitPrice, quoteItem.quantity, quoteItem.discount, taxRate);
            quoteItem.totalLine = initialVals.subtotal;
            $(`modal-total-line-${item.ref}`).textContent = formatByCurrencySymbol(initialVals.subtotal);

            quotation.items.push(quoteItem);

            const newRow = QuoteRow(quoteItem, toQuoteRowViewModel(quoteItem), rowEvents);
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

            const defaultVals = calculateLineTotals(item.unitPrice, 1, 0, taxRate);
            $(`modal-total-line-${item.ref}`).textContent = formatByCurrencySymbol(defaultVals.subtotal);

            const cartItem = quotation.items.find(i => i.ref === item.ref);
            rowEvents.onRemove(cartItem);
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
        }
    };

    return modalEvents;
}