import { LiveState } from "../../../../../vanilla-core/vanilla-livestate.js";

let customerState;

export function createCustomerState(initialCustomer = {}) {
    customerState = LiveState({
        // --- 1. Form Data (Directly bound, ready for UPSERT) ---
        name: initialCustomer.name || "",
        nuit: initialCustomer.nuit || "",
        phone: initialCustomer.phone || "",
        address: initialCustomer.address || "",
        city: initialCustomer.city || "",
        isEntity: initialCustomer.isEntity || false,

        // --- 2. Transient UI State ---
        isModalOpen: false,
        loadingType: null, // 'name' | 'nuit' | null
        searchResults: [],
        activeSearchField: null
    });

    return customerState;
}

// API for the Toolbar "Guardar" button
export function getCustomerData() {
    return {
        name: customerState.name,
        nuit: customerState.nuit,
        phone: customerState.phone,
        address: customerState.address,
        city: customerState.city,
        isEntity: customerState.isEntity
    };
}