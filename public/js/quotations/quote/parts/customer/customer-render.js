import { searchCustomersDatabase } from "./customer-network.js";
import { CustomerSection, CustomerModal, EmptyState, DetailsContent, SearchItem, CloseDropdownItem } from "./customer-viewgen.js";
import { shouldSearch } from "./customer-math.js";
import { createCustomerViewModel } from "./customer-viewmodel.js";

export function setupCustomerModule(quotation) {
    quotation.customer = quotation.customer || { name: "" };

    const viewModel = createCustomerViewModel(quotation);

    // Pass the viewModel into the viewgens
    const widgetEvents = setupCustomerSectionEvents(quotation);
    const widget = CustomerSection(viewModel, widgetEvents);

    const modalEvents = setupCustomerModalEvents(quotation);
    const modal = CustomerModal(viewModel, modalEvents);

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

const setupCustomerSectionEvents = (quotation) => {
    return {
        onOpenModal: () => {
            $("customer-selection-modal").classList.remove("hidden");
            setTimeout(() => $("input-customer-name").focus(), 50);
        },
        onClearCustomer: () => {
            $("customer-clear-btn").classList.add("hidden");

            // 1. Wipe the data object
            quotation.customer = {};

            // 2. Directly update the UI with hardcoded defaults
            $("customer-search-input").placeholder = "-- Clique para selecionar ou criar cliente --";
            $("customer-details-container").replaceChildren(EmptyState());

            // 3. Wipe draft inputs
            setModalInputs({});
        }
    }
}

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
            setModalInputs(quotation.customer);
            closeModalUI();
        },

        onSaveModal: (e) => {
            e.preventDefault();

            // 1. Save DOM inputs to raw source of truth
            quotation.customer = readModalInputs();

            // 2. Sync the UI directly using the raw data
            $("customer-details-container").replaceChildren(DetailsContent(quotation.customer));
            $("customer-clear-btn").classList.remove('hidden');
            $("customer-search-input").placeholder = `Selecionado: ${quotation.customer.name}`;

            closeModalUI();
        }
    }
}