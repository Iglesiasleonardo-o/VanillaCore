// logic/items-data-state.js
import { LiveArrayState, LiveState } from "../../../../../vanilla-core/vanilla-livestate.js";

let itemsState;

export function createItemsState(initialItems = []) {
    const itemsArray = LiveArrayState(initialItems);

    itemsState = LiveState({
        items: itemsArray,
        globalDiscount: 0,
        totals: initialItems.totals,

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
    return {
        items: itemsState.items.map(item => ({
            ref: item.ref,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice, // Nome único em todo o sistema
            discount: item.discount || 0,
            taxRate: 16,
            totalLine: parseFloat(((item.unitPrice * item.quantity) * (1 - (item.discount || 0) / 100) * 1.16).toFixed(2))
        })),
        totals: itemsState.totals
    };
}