// logic/items-data-state.js
import { LiveState, LiveArrayState } from "../../../../../vanilla-core/vanilla-livestate.js";
import { calculateTotals } from "./items-math.js";

let itemsState;

export function createItemsState(initialItems = []) {
    const itemsArray = LiveArrayState(initialItems);

    itemsState = LiveState({
        items: itemsArray,
        globalDiscount: 0,
        totals: calculateTotals(initialItems),

        // Transient UI State
        isModalOpen: false,
        activeSearchQuery: "",
        searchResults: [],
        isLoadingSearch: false,
        isBottomLoading: false,
        searchOffset: 0,
        hasMoreResults: true
    });

    return itemsState;
}

export function getItemsData() {
    // Just map it to ensure the line totals and math are perfectly fresh for the DB
    const dbItems = itemsState.items.map(item => {
        const discountMultiplier = 1 - ((item.discount || 0) / 100);
        const lineSubtotal = item.unitPrice * item.quantity * discountMultiplier;
        const taxRate = 16; 
        const taxAmount = lineSubtotal * (taxRate / 100);
        
        return {
            ref: item.ref,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            taxRate: taxRate,
            totalLine: parseFloat((lineSubtotal + taxAmount).toFixed(2)) 
        };
    });

    return { 
        items: dbItems, 
        totals: itemsState.totals 
    };
}