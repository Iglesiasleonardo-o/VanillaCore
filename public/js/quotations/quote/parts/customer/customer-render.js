import { searchCustomersDatabase } from "./customer-network.js";
import { CustomerSection, CustomerModal, EmptyState, DetailsContent, SearchItem, CloseDropdownItem } from "./customer-viewgen.js";
import { shouldSearch } from "./customer-math.js";

export function setupCustomerModule(quotation) {
    if (!quotation.customer) quotation.customer = {};

    const widgetEvents = setupCustomerSectionEvents(quotation);
    const widget = CustomerSection(quotation, widgetEvents);

    const modalEvents = setupCustomerModalEvents(quotation);
    const modal = CustomerModal(quotation.customer, modalEvents);

    return { widget, modal };
}

// ==========================================
// DOM HELPERS
// ==========================================

const setModalInputs = (data) => {
    $("input-customer-name").value = data.name || "";
    $("input-customer-nuit").value = data.nuit || "";
    $("input-customer-phone").value = data.phone || "";
    $("input-customer-address").value = data.address || "";

    const isEntity = !!data.isEntity;
    $("toggleIsEntity").checked = isEntity;
    $("input-customer-nuit").required = isEntity;
    $("label-nuit-required").classList.toggle("hidden", !isEntity);
};

const readModalInputs = () => {
    return {
        name: $("input-customer-name").value.trim(),
        nuit: $("input-customer-nuit").value.trim(),
        phone: $("input-customer-phone").value.trim(),
        address: $("input-customer-address").value.trim(),
        isEntity: $("toggleIsEntity").checked
    };
};

const closeModalUI = () => {
    $("customer-results-name").classList.add("hidden");
    $("customer-results-nuit").classList.add("hidden");
    $("customer-selection-modal").classList.add("hidden");
};

// ==========================================
// SEARCH LOGIC
// ==========================================

const handleSearch = async (value, type) => {
    const resultsContainer = $(`customer-results-${type}`);
    const loadingSpinner = $(type === "name" ? "customer-loading-name" : "loading-nuit");

    if (!shouldSearch(value)) {
        resultsContainer.classList.add("hidden");
        return;
    }

    loadingSpinner.classList.remove("hidden");
    const results = await searchCustomersDatabase(value, type);
    loadingSpinner.classList.add("hidden");

    resultsContainer.textContent = "";

    if (results && results.length > 0) {
        resultsContainer.classList.remove("hidden");

        results.forEach(cust => {
            resultsContainer.appendChild(SearchItem(cust, (selected) => {
                // Use the helper instead of writing 7 lines of code!
                setModalInputs(selected);
                resultsContainer.classList.add("hidden");
            }));
        });

        resultsContainer.appendChild(CloseDropdownItem(() => {
            resultsContainer.classList.add("hidden");
        }));
    } else {
        resultsContainer.classList.add("hidden");
    }
};


// ==========================================
// EVENTS FACTORIES
// ==========================================

// --- MAIN SECTION EVENTS ---
const setupCustomerSectionEvents = (quotation) => {
    return {
        onOpenModal: () => {
            $("customer-selection-modal").classList.remove("hidden");
            setTimeout(() => $("input-customer-name").focus(), 50);
        },
        onClearCustomer: () => {
            // Hide the clear button
            $("customer-clear-btn").classList.add("hidden");

            // Clear the A4 Card Display
            $("customer-search-input").placeholder = "-- Clique para selecionar ou criar cliente --";
            $("customer-details-container").replaceChildren(EmptyState());

            // Wipe the DOM draft state using our helper
            setModalInputs({});

            // Wipe the actual data object
            quotation.customer = {};
        }
    }
}

// --- MODAL EVENTS ---
const setupCustomerModalEvents = (quotation) => {
    return {
        onNameInput: (e) => handleSearch(e.target.value, "name"),
        onNuitInput: (e) => handleSearch(e.target.value, "nuit"),

        onToggleEntity: () => {
            const checkbox = $("toggleIsEntity");
            checkbox.checked = !checkbox.checked;

            $("input-customer-nuit").required = checkbox.checked;
            $("label-nuit-required").classList.toggle("hidden", !checkbox.checked);
        },

        onPhoneInput: () => { },
        onAddrInput: () => { },

        onCancelModal: () => {
            // Revert DOM to last saved state
            setModalInputs(quotation.customer);
            closeModalUI();
        },

        onSaveModal: (e) => {
            e.preventDefault();

            // 1. Commit draft DOM values using the helper
            quotation.customer = readModalInputs();

            // 2. Update the A4 Card UI
            $("customer-details-container").replaceChildren(DetailsContent(quotation.customer));
            $("customer-clear-btn").classList.remove('hidden');
            $("customer-search-input").placeholder = `Selecionado: ${quotation.customer.name}`;

            // 3. Hide UI
            closeModalUI();
        }
    }
}