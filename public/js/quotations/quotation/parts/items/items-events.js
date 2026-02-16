// items-events.js
import { loadProductsData, createNewItem, findItemIndex, calculateTotals, validateStepperValue, setItemQuantity, setItemDiscount } from './items-logic.js';
import { toggleModal, showLoading, hideLoading, showBottomLoading, hideBottomLoading, renderProductList, renderQuoteTable, renderTotals } from './items-render.js';

// --- DOM Elements (Defined once) ---
const list = $('modalProductList');
const modal = $('productSelectionModal');
const searchInput = $('productSearchInput');
const toggleDisc = $('toggleGlobalDiscount');
const inputDisc = $('globalDiscountInput');

// --- Constants & State ---
const valQty = (v) => validateStepperValue(v, 1, 100000000);
const valDisc = (v) => validateStepperValue(v, 0, 100);

let items = [];
let currentSearchResults = [];
let _debounceTimer = null;
let _isVisualLoading = false;
let _activeSearchId = 0;
let searchState = { query: '', offset: 0, limit: 20, isLoading: false, hasMore: true };

export function getQuoteItems() { return items; }

// --- UI Refresh Helpers ---

function refreshTableAndTotals() {
    renderQuoteTable(items, handleTableUpdateQty, handleTableUpdateDisc, handleTableRemove, valQty, valDisc);
    renderTotals(calculateTotals(items));
}

function refreshSearchList() {
    renderProductList(list, currentSearchResults, false, items, handleAddProduct, handleRemoveProduct, handleUpdateQuantity, handleUpdateDiscount, valQty, valDisc);
}

function refreshAllUI() {
    refreshTableAndTotals();
    refreshSearchList();
}

// --- Main Event Handlers (Direct Logic) ---

function handleAddProduct(product, qty, disc) {
    const index = findItemIndex(items, product.id);

    if (index === -1) {
        const newItem = createNewItem(product);
        newItem.quantity = qty;
        newItem.discount = disc;
        items.push(newItem);
    } else {
        setItemQuantity(items[index], qty);
        setItemDiscount(items[index], disc);
    }

    refreshAllUI();
}

function handleRemoveProduct(productId) {
    const index = findItemIndex(items, productId);
    if (index !== -1) {
        items.splice(index, 1);
        refreshAllUI();
    }
}

function handleUpdateQuantity(productId, newQty) {
    const index = findItemIndex(items, productId);
    if (index !== -1) {
        setItemQuantity(items[index], newQty);
        refreshTableAndTotals();
    }
}

function handleUpdateDiscount(productId, newDisc) {
    const index = findItemIndex(items, productId);
    if (index !== -1) {
        setItemDiscount(items[index], newDisc);
        refreshTableAndTotals();
    }
}

// --- Table Specific Handlers ---

function handleTableUpdateQty(index, newQty) {
    setItemQuantity(items[index], newQty);
    refreshTableAndTotals();
}

function handleTableUpdateDisc(index, newDisc) {
    setItemDiscount(items[index], newDisc);
    refreshTableAndTotals();
}

function handleTableRemove(index) {
    items.splice(index, 1);
    refreshAllUI();
}

// --- Global Discount Logic ---

function handleDiscountToggle() {
    if (toggleDisc.checked) {
        inputDisc.disabled = false;
        inputDisc.classList.remove('bg-gray-100');
        inputDisc.focus();
        handleDiscountInput();
    } else {
        inputDisc.disabled = true;
        inputDisc.classList.add('bg-gray-100');
        inputDisc.value = '';
        items.forEach(item => item.discount = 0);
        refreshTableAndTotals();
    }
}

function handleDiscountInput() {
    const val = parseFloat(inputDisc.value);
    const safeVal = isNaN(val) ? 0 : val;
    items.forEach(item => item.discount = safeVal);
    refreshTableAndTotals();
}

// --- Search Logic Helpers ---

function resetSearchState(query) {
    _activeSearchId++;
    searchState.query = query;
    searchState.offset = 0;
    searchState.hasMore = true;
}

function showVisualLoading() {
    if (_isVisualLoading) return;
    try { hideBottomLoading(); } catch (e) { }
    showLoading(list);
    _isVisualLoading = true;
}

function hideVisualLoading() {
    hideLoading();
    _isVisualLoading = false;
}

// --- Search Execution ---

async function executeNewSearch() {
    const currentId = _activeSearchId;
    searchState.isLoading = true;

    if (!_isVisualLoading) showVisualLoading();

    const results = await loadProductsData(searchState.query, 0);

    if (currentId !== _activeSearchId) return;

    searchState.isLoading = false;
    hideVisualLoading();

    currentSearchResults = results;
    searchState.offset = results.length;
    searchState.hasMore = results.length >= searchState.limit;

    renderProductList(list, results, false, items, handleAddProduct, handleRemoveProduct, handleUpdateQuantity, handleUpdateDiscount, valQty, valDisc);
}

async function executeScrollLoad() {
    const currentId = _activeSearchId;
    searchState.isLoading = true;
    showBottomLoading(list);

    const results = await loadProductsData(searchState.query, searchState.offset);

    if (currentId !== _activeSearchId) return;

    searchState.isLoading = false;
    hideBottomLoading();

    currentSearchResults.push(...results);
    searchState.offset += results.length;
    searchState.hasMore = results.length >= searchState.limit;

    renderProductList(list, results, true, items, handleAddProduct, handleRemoveProduct, handleUpdateQuantity, handleUpdateDiscount, valQty, valDisc);
}

// --- Initialization & Listeners ---

function onSearchInput(e) {
    resetSearchState(e.target.value);
    showVisualLoading();

    if (_debounceTimer) clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(executeNewSearch, 500);
}

function onSearchScroll(e) {
    if (searchState.isLoading || !searchState.hasMore || _isVisualLoading) return;

    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
        executeScrollLoad();
    }
}

function openModal() {
    resetSearchState('');
    toggleModal(modal, searchInput, true);
    executeNewSearch();
}

function closeModal() {
    toggleModal(modal, searchInput, false);
}

export function initInventoryEvents() {
    const btnManage = $('manageProductsButton');
    const btnClose = $('closeProductModalButton');
    const btnFinish = $('finishSelectionButton');
    btnManage.onclick = openModal;
    btnClose.onclick = closeModal;
    btnFinish.onclick = closeModal;

    modal.onclick = (e) => { if (e.target === modal) closeModal(); };

    searchInput.oninput = onSearchInput;
    list.parentElement.onscroll = onSearchScroll;

    toggleDisc.onchange = handleDiscountToggle;
    inputDisc.oninput = handleDiscountInput;
}