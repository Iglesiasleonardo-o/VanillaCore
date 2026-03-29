import { shouldSearch, searchCustomersDatabase } from "./logic/customer-network.js";
import { CustomerSection, CustomerModal, EmptyState, DetailsContent, SearchItem, CloseDropdownItem } from "./customer-viewgen.js";

export function setupCustomerModule(quotation) {
    if (!quotation.customer) quotation.customer = {};

    const widgetEvents = setupCustomerSectionEvents(quotation);
    const widget = CustomerSection(quotation, widgetEvents);

    const modalEvents = setupCustomerModalEvents(quotation);
    const modal = CustomerModal(quotation.customer, modalEvents);

    return { widget, modal };
}

// --- MAIN SECTION EVENTS ---
const setupCustomerSectionEvents = (quotation) => {
    return {
        onOpenModal: () => {
            $("customer-selection-modal").classList.remove("hidden");
            setTimeout(() => $("input-customer-name").focus(), 50);
        },
        onClearCustomer: (e) => {
            // Hide the clear button
            $("customer-clear-btn").classList.add("hidden");
            
            // Clear the A4 Card Display
            $("customer-search-input").placeholder = "-- Clique para selecionar ou criar cliente --";
            $("customer-details-container").replaceChildren(EmptyState());

            // Wipe the DOM draft state
            $("input-customer-name").value = "";
            $("input-customer-nuit").value = "";
            $("input-customer-phone").value = "";
            $("input-customer-address").value = "";

            $("toggleIsEntity").checked = false;
            $("input-customer-nuit").required = false;
            $("label-nuit-required").classList.add("hidden");

            // Wipe the actual data object
            quotation.customer = {};
        }
    }
}


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
                $("input-customer-name").value = selected.name || "";
                $("input-customer-nuit").value = selected.nuit || "";
                $("input-customer-phone").value = selected.phone || "";
                $("input-customer-address").value = selected.address || "";

                const isEntity = !!selected.isEntity;
                $("toggleIsEntity").checked = isEntity;
                $("input-customer-nuit").required = isEntity;
                $("label-nuit-required").classList.toggle("hidden", !isEntity);

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

// --- MODAL EVENTS ---
const setupCustomerModalEvents = (quotation) => {
    return {
        onNameInput: (e) => handleSearch(e.target.value, "name"),
        onNuitInput: (e) => handleSearch(e.target.value, "nuit"),

        onToggleEntity: (e) => {
            const checkbox = $("toggleIsEntity");
            checkbox.checked = !checkbox.checked;
            const isChecked = checkbox.checked;
            $("input-customer-nuit").required = isChecked;
            $("label-nuit-required").classList.toggle("hidden", !isChecked);
        },

        onPhoneInput: () => { },
        onAddrInput: () => { },

        onCancelModal: () => {
            // Always read from quotation.customer to avoid the stale memory reference bug
            const c = quotation.customer;

            // Revert DOM to last saved state
            $("input-customer-name").value = c.name || "";
            $("input-customer-nuit").value = c.nuit || "";
            $("input-customer-phone").value = c.phone || "";
            $("input-customer-address").value = c.address || "";

            const isEntity = !!c.isEntity;
            $("toggleIsEntity").checked = isEntity;
            $("input-customer-nuit").required = isEntity;
            $("label-nuit-required").classList.toggle("hidden", !isEntity);

            // Hide UI
            $("customer-results-name").classList.add("hidden");
            $("customer-results-nuit").classList.add("hidden");
            $("customer-selection-modal").classList.add("hidden");
        },

        onSaveModal: (e) => {
            if (e) e.preventDefault();

            // 1. Commit draft DOM values to the true quotation object
            const nameVal = $("input-customer-name").value.trim();
            quotation.customer = {
                name: nameVal,
                nuit: $("input-customer-nuit").value.trim(),
                phone: $("input-customer-phone").value.trim(),
                address: $("input-customer-address").value.trim(),
                isEntity: $("toggleIsEntity").checked
            };

            // 2. Update the A4 Card UI
            $("customer-details-container").replaceChildren(DetailsContent(quotation.customer));
            $("customer-clear-btn").classList.remove('hidden');
            $("customer-search-input").placeholder = `Selecionado: ${nameVal}`;

            // 3. Hide UI
            $("customer-results-name").classList.add("hidden");
            $("customer-results-nuit").classList.add("hidden");
            $("customer-selection-modal").classList.add("hidden");
        }
    }
}