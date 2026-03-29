import { globalState } from "../../../../vanilla-core/vanilla-global-state.js";
import { EmptyTableState, ItemsTableWidget, QuoteRow, TotalsWidget } from "./items-viewgen.js";
import { formatByCurrency, formatByCurrencySymbol, toQuoteRowViewModel, toTotalsViewModel } from "./items-viewmodel.js";
import { applyTotalDelta, calculateLineTotals, sanitizeDiscount, sanitizeQuantity } from "./items-math.js";
import { setupModalEvents, setupModalWidget } from "./modal-render.js";

export function setupItemsModule(quotation) {
    const TAX_RATE = globalState.company.taxRate;
    const quoteItems = quotation.items || [];

    const updaters = createSharedUpdaters(quotation, TAX_RATE);

    // Events
    const rowEvents = setupTableEvents(quotation, updaters);
    const modalEvents = setupModalEvents(quotation, updaters, rowEvents, TAX_RATE, QuoteRow);

    return {
        tableWidget: ItemsTableWidget(
            { modal: modalEvents, row: rowEvents },
            quoteItems,
            toQuoteRowViewModel
        ),
        totalsWidget: TotalsWidget(rowEvents, toTotalsViewModel(quotation.totals)),
        modal: setupModalWidget(modalEvents)
    };
}

function createSharedUpdaters(quotation, taxRate) {
    const refreshTotals = (oldSubtotal, newSubtotal) => {
        const quoteTotals = quotation.totals;
        applyTotalDelta(quoteTotals, oldSubtotal, newSubtotal, taxRate);

        $(`lblSubtotal`).textContent = formatByCurrencySymbol(quoteTotals.subtotal);
        $(`lblVat`).textContent = formatByCurrencySymbol(quoteTotals.taxTotal);
        $(`lblTotal`).textContent = formatByCurrencySymbol(quoteTotals.grandTotal);
    };

    const handleLineUpdate = (item, newQty, newDisc) => {
        const oldSubtotal = item.totalLine;
        const newVals = calculateLineTotals(item.unitPrice, newQty, newDisc, taxRate);

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

    return { refreshTotals, handleLineUpdate, updateUIAndState };
}

export function setupTableEvents(quotation, updaters) {
    const { handleLineUpdate } = updaters;

    return {
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
    };
}