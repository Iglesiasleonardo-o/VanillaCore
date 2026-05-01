import { RenderView } from "../vanilla-core/vanilla-render.js";
import { loadCustomersData, saveCustomerDatabase, getCustomerById } from "./customers-network.js";
import { toClientCardViewModel } from "./customers-viewmodel.js";
import { CustomersPageLayout, CustomersMainWidget, ClientCard, EmptyStateGrid, ClientModal, ConfirmExitModal, BottomLoader } from "./customers-viewgen.js";
import { shouldSearch } from "./customers-math.js";

// ==========================================
// ESTADO DE MÓDULO (Scoped)
// ==========================================
let gridObserver = null;
let currentCursor = null;
let currentSearchQuery = "";
let searchTimeout = null;
let isFetching = false;
let localClients = [];

let currentClientId = null;
let isFormDirty = false;

// ==========================================
// INICIALIZAÇÃO
// ==========================================
export async function loadCustomersByURLEvent() {
    try {
        const ui = setupCustomerModule();
        RenderView(ui.layout, ui.modal, ui.confirmModal);
        await ui.executeSearch("");
    } catch (error) {
        console.error("Erro ao iniciar módulo de clientes:", error);
    }
}

export function setupCustomerModule() {
    let refreshGridCallback = null;

    const modalEvents = setupModalEvents(() => {
        if (refreshGridCallback) refreshGridCallback($('searchInput')?.value || "");
    });

    const gridEvents = setupGridEvents(modalEvents);
    refreshGridCallback = gridEvents.executeSearch;

    const layoutWrapper = document.createElement("div");
    layoutWrapper.className = "w-full h-full";
    layoutWrapper.appendChild(CustomersMainWidget(gridEvents));

    return {
        layout: CustomersPageLayout(layoutWrapper),
        modal: ClientModal(modalEvents),
        confirmModal: ConfirmExitModal(modalEvents),
        executeSearch: gridEvents.executeSearch
    };
}

// ==========================================
// EVENTOS DA GRELHA (COM INFINITE SCROLL)
// ==========================================
function setupGridEvents(modalEvents) {
    const getLoader = () => {
        let loader = $("bottomLoader");
        if (!loader) {
            loader = BottomLoader();
            $("clientListContainer").appendChild(loader); 
        }
        return loader;
    };

    const renderItems = (items, append = false) => {
        const grid = $("clientGrid");
        if (!grid) return;
        
        if (!append) grid.textContent = ''; 

        if (!append && items.length === 0) {
            grid.appendChild(EmptyStateGrid());
        } else {
            items.forEach(c => {
                const vm = toClientCardViewModel(c);
                grid.appendChild(ClientCard(vm, {
                    onEditClient: (id) => modalEvents.onOpenEditModal(id)
                }));
            });
        }

        if (window.lucide) window.lucide.createIcons();
    };

    const loadMore = async () => {
        if (isFetching || currentCursor === null) return;
        isFetching = true;
        
        const loader = getLoader();
        loader.classList.remove("hidden");

        const response = await loadCustomersData(currentSearchQuery, currentCursor);

        currentCursor = response.nextCursor;
        localClients = [...localClients, ...response.data];

        renderItems(response.data, true);

        if (!currentCursor) {
            loader.classList.add("hidden");
        }
        
        isFetching = false;
    };

    const executeSearch = async (query = "") => {
        if (isFetching) return;
        isFetching = true;

        currentSearchQuery = query;
        currentCursor = null; 
        
        const grid = $("clientGrid");
        if (grid) grid.textContent = '';

        const loader = getLoader();
        loader.classList.remove("hidden");

        const response = await loadCustomersData(currentSearchQuery, currentCursor);

        localClients = response.data;
        currentCursor = response.nextCursor;

        renderItems(localClients, false);

        if (!currentCursor) {
            loader.classList.add("hidden");
        }

        isFetching = false;

        if (gridObserver) gridObserver.disconnect();
        gridObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) loadMore();
        }, { rootMargin: "250px" });
        
        gridObserver.observe(loader);
    };

    return {
        executeSearch,

        onSearchInput: (e) => {
            const val = e.target.value;
            if (!shouldSearch(val)) return;

            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => executeSearch(val), 350);
        },

        onOpenNewModal: () => {
            modalEvents.onOpenNewModal();
        }
    };
}

// ==========================================
// EVENTOS DO MODAL COMPLETOS
// ==========================================
function setupModalEvents(onSaveSuccessRefresh) {
    
    const setFormInputs = (client) => {
        const isPerson = client.clientType === 'pessoa';
        $('type-pessoa').checked = isPerson;
        $('type-empresa').checked = !isPerson;
        
        $('clientName').value = client.clientName || '';
        $('jobPosition').value = client.jobPosition || '';
        $('clientEmail').value = client.clientEmail || '';
        $('clientPhone').value = client.clientPhone || '';
        $('clientNuit').value = client.clientNuit || '';
        $('clientWebsite').value = client.clientWebsite || '';
        $('clientLanguage').value = client.clientLanguage || 'pt';
        
        $('addressStreet').value = client.addressStreet || '';
        $('addressZip').value = client.addressZip || '';
        $('addressDistrict').value = client.addressDistrict || '';
        $('addressState').value = client.addressState || '';
        $('addressCountry').value = client.addressCountry || 'Moçambique';

        events.onTypeChange(); 
    };

    const resetTabs = () => {
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('border-blue-600', 'text-blue-600', 'font-extrabold');
            btn.classList.add('border-transparent', 'text-gray-500', 'font-bold');
        });
        
        const firstTab = $('btn-tab-general');
        if (firstTab) {
            firstTab.classList.remove('border-transparent', 'text-gray-500', 'font-bold');
            firstTab.classList.add('border-blue-600', 'text-blue-600', 'font-extrabold');
        }

        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.add('hidden'));
        const genPanel = $('tab-general');
        if (genPanel) genPanel.classList.remove('hidden');
    };

    const showModalUI = () => {
        const modal = $('clientModal');
        const panel = $('clientModalPanel');
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            panel.classList.remove('scale-95');
            panel.classList.add('scale-100');
        }, 10);
    };

    const hideModalUI = () => {
        const modal = $('clientModal');
        const panel = $('clientModalPanel');
        panel.classList.remove('scale-100');
        panel.classList.add('scale-95');
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 200);
        isFormDirty = false;
    };

    const events = {
        onOpenNewModal: () => {
            currentClientId = null;
            isFormDirty = false;
            $('clientForm').reset();
            setFormInputs({ clientType: 'empresa', addressCountry: 'Moçambique' });
            resetTabs();
            showModalUI();
        },

        onOpenEditModal: async (id) => {
            currentClientId = id;
            const client = await getCustomerById(id);
            if (client) {
                isFormDirty = false;
                setFormInputs(client);
                resetTabs();
                showModalUI();
            }
        },

        onBackdropClick: (e) => {
            if (e.target === e.currentTarget) {
                const confirm = $('confirmExitModal');
                if (confirm && confirm.classList.contains('hidden')) {
                    events.onRequestClose();
                }
            }
        },

        onRequestClose: () => {
            if (isFormDirty) {
                $('confirmExitModal').classList.remove('hidden');
            } else {
                hideModalUI();
            }
        },

        onCancelExit: () => {
            $('confirmExitModal').classList.add('hidden');
        },

        onConfirmExit: () => {
            $('confirmExitModal').classList.add('hidden');
            hideModalUI();
        },

        onFormInput: () => {
            isFormDirty = true;
        },

        onTypeChange: () => {
            const isPerson = $('type-pessoa').checked;
            const positionContainer = $('jobPositionContainer');
            if (isPerson) {
                positionContainer.classList.remove('hidden');
            } else {
                positionContainer.classList.add('hidden');
                $('jobPosition').value = ''; 
            }
        },

        onSwitchTab: (tabId, buttonElem) => {
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('border-blue-600', 'text-blue-600', 'font-extrabold');
                btn.classList.add('border-transparent', 'text-gray-500', 'font-bold');
            });
            
            buttonElem.classList.remove('border-transparent', 'text-gray-500', 'font-bold');
            buttonElem.classList.add('border-blue-600', 'text-blue-600', 'font-extrabold');

            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.add('hidden'));
            const targetPanel = $(`tab-${tabId}`);
            if (targetPanel) targetPanel.classList.remove('hidden');
        },

        onSaveModal: async (e) => {
            e.preventDefault();
            
            const formData = new FormData($('clientForm'));
            const data = Object.fromEntries(formData.entries());

            const clientData = {
                id: currentClientId,
                clientType: data.clientType,
                clientName: data.clientName,
                jobPosition: data.clientType === 'pessoa' ? data.jobPosition : null,
                clientEmail: data.clientEmail,
                clientPhone: data.clientPhone,
                clientNuit: data.clientNuit,
                clientWebsite: data.clientWebsite,
                clientLanguage: data.clientLanguage,
                addressStreet: data.addressStreet,
                addressZip: data.addressZip,
                addressDistrict: data.addressDistrict,
                addressState: data.addressState,
                addressCountry: data.addressCountry
            };

            await saveCustomerDatabase(clientData);
            
            hideModalUI();
            
            if (onSaveSuccessRefresh) onSaveSuccessRefresh(); 
        }
    };

    return events;
}