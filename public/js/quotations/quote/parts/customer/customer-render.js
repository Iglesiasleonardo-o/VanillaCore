import { createCustomerState } from "./logic/customer-data-state.js";
import { shouldSearch, searchCustomersDatabase } from "./logic/customer-network.js";
import { createCustomerSection, createCustomerModal, createEmptyState, createDetailsContent, createSearchItem, createCloseDropdownItem } from "./customer-viewgen.js";

export function setupCustomerModule(quotation) {
    const initialCustomer = quotation.customer || {};
    const quotationNumber = quotation.number;

    const state = createCustomerState(initialCustomer);
    const events = setupEvents(state);

    const mainUI = createCustomerSection(quotationNumber, events);
    const modalUI = createCustomerModal(events);

    observeState(state, mainUI.views, modalUI.views);

    return {
        widget: mainUI.root,
        modal: modalUI.root
    };
}

// --- OBSERVER ---
function observeState(
    state,
    { searchInput, clearBtn, detailsContainer },
    {
        modalOverlay, inName, inNuit, inPhone, inAddr, toggleEntity,
        resNameContainer, resNuitContainer, labelNuitRequired,
        loadingName, loadingNuit
    }
) {
    // 2. EXPLICIT SYNC TRIGGER: Only updates the A4 card when we tell it to.
    state.on("syncTrigger", () => {
        if (state.name) {
            detailsContainer.replaceChildren(createDetailsContent(state));
            clearBtn.classList.remove('hidden');
            searchInput.placeholder = `Selecionado: ${state.name}`;
        } else {
            detailsContainer.replaceChildren(createEmptyState());
            clearBtn.classList.add('hidden');
            searchInput.placeholder = "-- Clique para selecionar ou criar cliente --";
        }
    });

    // 3. Draft Inputs: Updates the modal inputs silently as state changes
    state.on("name", name => { if (inName.value !== name) inName.value = name; });
    state.on("nuit", nuit => { if (inNuit.value !== nuit) inNuit.value = nuit; });
    state.on("phone", phone => { if (inPhone.value !== phone) inPhone.value = phone; });
    state.on("address", address => { if (inAddr.value !== address) inAddr.value = address; });

    // 4. Entity Toggle
    state.on("isEntity", (isEntity) => {
        toggleEntity.checked = isEntity;
        labelNuitRequired.classList.toggle('hidden', !isEntity);
        inNuit.required = isEntity;
    });

    // 5. Modal Visibility
    state.on("isModalOpen", (isOpen) => {
        modalOverlay.classList.toggle("hidden", !isOpen);
        if (isOpen) {
            setTimeout(() => {
                inName.focus();
                inName.select();
            }, 50);
        } else {
            state.searchResults = [];
        }
    });

    // 6. Loading Spinners
    state.on("loadingType", (type) => {
        loadingName.classList.toggle("hidden", type !== "name");
        loadingNuit.classList.toggle("hidden", type !== "nuit");
    });

    // 7. Search Results
    state.on("searchResults", (results) => {
        let activeList, inactiveList;

        if (state.activeSearchField === "name") {
            activeList = resNameContainer;
            inactiveList = resNuitContainer;
        } else {
            activeList = resNuitContainer;
            inactiveList = resNameContainer;
        }

        inactiveList.classList.add("hidden");
        activeList.textContent = '';

        if (results && results.length > 0) {
            activeList.classList.remove('hidden');

            results.forEach(customer => {
                activeList.appendChild(createSearchItem(customer, (selectedData) => {
                    Object.assign(state, {
                        name: selectedData.name || "",
                        nuit: selectedData.nuit || "",
                        phone: selectedData.phone || "",
                        address: selectedData.address || "",
                        city: selectedData.city || "",
                        isEntity: !!selectedData.isEntity,
                        searchResults: []
                    });
                }));
            });

            activeList.appendChild(createCloseDropdownItem(() => {
                state.searchResults = [];
            }));

        } else {
            activeList.classList.add('hidden');
        }
    });
}

// --- EVENTS FACTORY ---
const setupEvents = (state) => {
    let originalSnapshot = null;

    return {
        onOpenModal: () => {
            // TAKE A SNAPSHOT: Save the current state before the user starts typing
            originalSnapshot = {
                name: state.name,
                nuit: state.nuit,
                phone: state.phone,
                address: state.address,
                isEntity: state.isEntity
            };
            state.isModalOpen = true;
        },

        // THE SAFE CLOSE: User clicked "X" or the background overlay. Keep data!
        onCloseModal: () => {
            state.isModalOpen = false;
            state.syncTrigger = !state.syncTrigger; // Trigger A4 Sync
        },

        // CONCLUIR: Exact same behavior as the safe close
        onSaveModal: (e) => {
            e.preventDefault();
            state.isModalOpen = false;
            state.syncTrigger = !state.syncTrigger; // Trigger A4 Sync
        },

        // DESTRUCTIVE CANCEL: User explicitly clicked "Cancelar". Rollback!
        onCancelModal: () => {
            if (originalSnapshot) {
                Object.assign(state, originalSnapshot);
            }
            state.isModalOpen = false;
            // No syncTrigger here, so the A4 card remains completely untouched
        },

        onClearCustomer: (e) => {
            e.stopPropagation();
            Object.assign(state, {
                name: "",
                nuit: "",
                phone: "",
                address: "",
                isEntity: false
            });
            state.syncTrigger = !state.syncTrigger;
        },

        onNameInput: async (e) => {
            const value = e.target.value;
            state.name = value;
            state.activeSearchField = "name";

            if (!shouldSearch(value)) {
                state.searchResults = [];
                state.loadingType = null;
                return;
            }

            state.loadingType = "name";
            const results = await searchCustomersDatabase(value, "name");

            if (state.activeSearchField === "name") {
                state.searchResults = results;
                state.loadingType = null;
            }
        },

        onNuitInput: async (e) => {
            const value = e.target.value;
            state.nuit = value;
            state.activeSearchField = "nuit";

            if (!shouldSearch(value)) {
                state.searchResults = [];
                state.loadingType = null;
                return;
            }

            state.loadingType = "nuit";
            const results = await searchCustomersDatabase(value, "nuit");

            if (state.activeSearchField === "nuit") {
                state.searchResults = results;
                state.loadingType = null;
            }
        },

        onPhoneInput: (e) => state.phone = e.target.value,
        onAddrInput: (e) => state.address = e.target.value,

        onToggleEntity: (e) => {
            if (e.target.tagName !== "INPUT") {
                state.isEntity = !state.isEntity;
            } else {
                state.isEntity = e.target.checked;
            }
        }
    };
};