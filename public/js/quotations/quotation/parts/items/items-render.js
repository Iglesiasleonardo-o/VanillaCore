// items-render.js
import {
    createProductSearchItem, createQuoteRow, createLoadingState, createEmptyState,
    createBottomLoader, createEmptyTableState
} from './items-viewgen.js';

const currency = new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' });

// --- Loading State Management ---

export function showLoading(container) {
    container.textContent = ''; // Limpeza direta

    const loaderContainer = $('productLoadingContainer');
    if (loaderContainer) {
        loaderContainer.textContent = '';
        loaderContainer.classList.remove('hidden');
        loaderContainer.appendChild(createLoadingState());
    }
}

export function hideLoading() {
    const el = $('productLoadingContainer');
    if (el) el.classList.add('hidden');
}

export function showBottomLoading(container) {
    hideBottomLoading(); // Garante que não duplica

    const loader = createBottomLoader();
    container.appendChild(loader);
    loader.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

export function hideBottomLoading() {
    const el = document.getElementById('infinite-scroll-loader');
    if (el) el.remove();
}

// --- Modal & Search Rendering ---
export function toggleModal(modal, input, show) {
    if (show) {
        modal.classList.remove('hidden');
        setTimeout(() => {
            input.value = '';
            input.focus();
        }, 100);
    } else {
        modal.classList.add('hidden');
    }
}

export function renderProductList(container, products, isAppend, cartItems, onAdd, onRemove, onUpdateQty, onUpdateDisc, validateQty, validateDisc) {
    if (!isAppend) {
        container.textContent = '';
    }

    if (products.length === 0 && !isAppend) {
        container.appendChild(createEmptyState());
        return;
    }

    products.forEach(product => {
        const existingItem = cartItems.find(item => item.product.id === product.id);
        container.appendChild(createProductSearchItem(product, existingItem, onAdd, onRemove, onUpdateQty, onUpdateDisc, validateQty, validateDisc));
    });
}

// --- Main Table Rendering ---

export function renderQuoteTable(items, onUpdateQty, onUpdateDisc, onRemove, validateQty, validateDisc) {
    const tbody = $('quoteItemsTableBody');
    tbody.textContent = ''; // Limpeza direta

    if (items.length === 0) {
        tbody.appendChild(createEmptyTableState());
        return;
    }

    items.forEach((item, index) => {
        tbody.appendChild(createQuoteRow(item, index, onUpdateQty, onUpdateDisc, onRemove, validateQty, validateDisc));
    });
}

export function renderTotals({ subtotal, vat, total }) {
    $('subtotalAmount').textContent = currency.format(subtotal);
    $('vatAmount').textContent = currency.format(vat);
    $('totalAmount').textContent = currency.format(total);
}