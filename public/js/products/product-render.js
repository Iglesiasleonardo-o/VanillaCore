import { RenderView } from "../vanilla-core/vanilla-render.js";
import { loadProductsData, saveProductDatabase } from "./product-network.js";
import { BottomLoader, ConfirmExitModal, EmptyState, LoadingState, ProductCard, ProductErrorState, ProductMainWidget, ProductModal, ProductsPageLayout } from "./product-viewgen.js";
import { createProductCardViewModel } from "./product-viewmodel.js";

// ==========================================
// ESTADO DE MÓDULO (Type Module)
// ==========================================
let gridObserver = null;
let currentCursor = null;
let currentSearchQuery = "";
let searchTimeout = null;

// Memória local sequencial
let localProducts = [];

const ITEMS_LENGTH = 50;

// ==========================================
// INICIALIZAÇÃO E SETUP PRINCIPAL
// ==========================================
export async function loadProductsByURLEvent() {
    try {
        RenderView(LoadingState());

        const productUi = setupProductModule();

        RenderView(
            ProductsPageLayout(productUi.widget),
            productUi.modal,
            productUi.confirmModal
        );

        await productUi.executeSearch("");
    } catch (error) {
        RenderView(ProductErrorState(error));
    }
}

export function setupProductModule() {
    const modalEvents = setupModalEvents();
    const gridEvents = setupGridEvents(modalEvents);

    const allEvents = { ...gridEvents, ...modalEvents };

    return {
        widget: ProductMainWidget(allEvents),
        modal: ProductModal(allEvents),
        confirmModal: ConfirmExitModal(allEvents),
        executeSearch: gridEvents.executeSearch
    };
}

// ==========================================
// HELPERS DO DOM DIRETOS (Usando $)
// ==========================================
const resetModalUI = () => {
    $("productForm").reset();
    $("productForm").removeAttribute("data-product-id");
    $("productForm").removeAttribute("data-dirty");
    
    if (modalEventsRef.onSwitchTab) modalEventsRef.onSwitchTab("general");
};

const setModalInputs = (product) => {
    const form = $("productForm");
    
    form.setAttribute("data-product-id", product ? product.id : "");
    form.elements["productName"].value = product ? product.name : "";
    form.elements["salesPrice"].value = product ? (product.price || product.unitPrice || "") : "";
    form.elements["costPrice"].value = product ? (product.cost || "") : "";
    form.elements["reference"].value = product ? (product.ref || "") : "";
    
    const prodType = product ? (product.productType || product.type || 'mercadoria') : 'mercadoria';
    
    if (prodType === 'servico') $("type-servico").checked = true;
    else if (prodType === 'combo') $("type-combo").checked = true;
    else $("type-mercadoria").checked = true;

    const isTracking = product ? (product.trackInventory !== false) : true; 
    const onHandValue = product ? (product.onHand || "") : "";

    $("quantityOnHand").value = onHandValue;

    if (prodType === 'servico') {
        $("trackInventory").checked = false;
        $("trackInventory").disabled = true;
        $("quantity-container").classList.add('hidden');
        $("inventory-tracking-container").classList.add('opacity-50');
    } else {
        $("trackInventory").disabled = false;
        $("inventory-tracking-container").classList.remove('opacity-50');
        
        $("trackInventory").checked = isTracking;
        
        if (isTracking) {
            $("quantity-container").classList.remove('hidden');
        } else {
            $("quantity-container").classList.add('hidden');
        }
    }
};

// ==========================================
// MÓDULO: GRID & PESQUISA
// ==========================================
function setupGridEvents(modalEvents) {

    const renderGridItems = (results, container) => {
        results.forEach(item => {
            const viewData = createProductCardViewModel(item);
            container.appendChild(ProductCard(viewData, { onEditProduct: modalEvents.onEditProduct }));
        });

        if (window.lucide) lucide.createIcons();
    };

    const setupInfiniteScrollObserver = (targetElement, container) => {
        if (gridObserver) gridObserver.disconnect();

        gridObserver = new IntersectionObserver(async (entries) => {
            if (!entries[0].isIntersecting) return;
            gridObserver.disconnect();

            const loaderNode = BottomLoader();
            container.appendChild(loaderNode);

            const newResults = await loadProductsData(currentSearchQuery, currentCursor);
            loaderNode.remove();

            if (newResults.length > 0) {
                // Adiciona os novos resultados à array local na mesma ordem
                localProducts.push(...newResults);
                
                currentCursor = newResults[newResults.length - 1].name;
                renderGridItems(newResults, container);
            }

            if (newResults.length >= ITEMS_LENGTH) {
                gridObserver.observe(container.lastElementChild);
            }
        }, { rootMargin: "200px", threshold: 0 });

        gridObserver.observe(targetElement);
    };

    const executeSearch = async (query) => {
        currentSearchQuery = query;
        currentCursor = null;
        localProducts = []; // Limpa a memória local na nova pesquisa

        if (gridObserver) gridObserver.disconnect();

        $("productGrid").innerHTML = ""; 
        $("gridLoadingIndicator").classList.remove("hidden");

        const results = await loadProductsData(currentSearchQuery, currentCursor);

        $("gridLoadingIndicator").classList.add("hidden");

        if (results.length === 0) {
            $("productGrid").appendChild(EmptyState());
            return;
        }

        // Preenche a memória local com a primeira página
        localProducts = [...results];
        
        currentCursor = results[results.length - 1].name;
        renderGridItems(results, $("productGrid"));

        if (results.length === ITEMS_LENGTH) {
            setupInfiniteScrollObserver($("productGrid").lastElementChild, $("productGrid"));
        }
    };

    modalEvents.refreshGrid = () => executeSearch(currentSearchQuery);

    return {
        executeSearch,
        onSearchInput: (e) => {
            const query = e.target.value.trim();
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => executeSearch(query), 300);
        },
        onSearchFocus: (e) => {
            setTimeout(() => e.target.select(), 0);
        }
    };
}

let modalEventsRef = {};

// ==========================================
// MÓDULO: MODAL & FORMULÁRIO
// ==========================================
function setupModalEvents() {

    const openModal = (product = null) => {
        resetModalUI();
        if (product) setModalInputs(product);
        else setModalInputs(null);
        
        $("productModal").classList.remove("hidden");
    };

    const closeModal = () => {
        $("productModal").classList.add("hidden");
        $("confirmExitModal").classList.add("hidden");
        resetModalUI();
    };

    const requestCloseModal = () => {
        const isDirty = $("productForm").getAttribute("data-dirty") === "true";
        if (isDirty) {
            $("confirmExitModal").classList.remove("hidden");
        } else {
            closeModal();
        }
    };

    const parseMoney = (val) => {
        if (!val) return 0;
        const clean = val.toString().replace(',', '.');
        return parseFloat(clean) || 0;
    };

    const events = {
        onOpenNewModal: () => openModal(null),
        onEditProduct: (id) => {
            // Busca diretamente da array sequencial
            const product = localProducts.find(p => p.id === id);
            openModal(product);
        },
        onCancelExit: () => $("confirmExitModal").classList.add("hidden"),
        onConfirmExit: () => closeModal(),

        onFormInput: () => {
            $("productForm").setAttribute("data-dirty", "true");
        },

        onSaveModal: async (e) => {
            e.preventDefault();

            const form = e.target;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            const pId = form.getAttribute("data-product-id");

            await saveProductDatabase({
                id: pId ? parseInt(pId) : null,
                name: data.productName,
                price: parseMoney(data.salesPrice),
                cost: parseMoney(data.costPrice),
                ref: data.reference || "",
                productType: data.productType,
                trackInventory: data.trackInventory === 'on',
                onHand: parseInt(data.quantityOnHand) || null
            });

            closeModal();
            if (events.refreshGrid) await events.refreshGrid();
        },

        onBackdropClick: (e) => {
            if (e.target.id === "productModal") requestCloseModal();
        },
        onRequestClose: () => requestCloseModal(),

        onSwitchTab: (tabId) => {
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
            $("tab-" + tabId).classList.remove('hidden');

            document.querySelectorAll('.tab-button').forEach(b => {
                b.classList.remove('border-blue-600', 'text-blue-600', 'border-b-2');
                b.classList.add('border-transparent', 'text-gray-500');
            });

            const activeBtn = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
            if (activeBtn) {
                activeBtn.classList.remove('border-transparent', 'text-gray-500');
                activeBtn.classList.add('border-blue-600', 'text-blue-600', 'border-b-2');
            }
        },

        onTypeChange: (e) => {
            const type = e.target.value;

            if (type === 'servico') {
                $("trackInventory").checked = false;
                $("trackInventory").disabled = true;
                $("quantity-container").classList.add('hidden');
                $("inventory-tracking-container").classList.add('opacity-50');
            } else {
                $("trackInventory").disabled = false;
                $("inventory-tracking-container").classList.remove('opacity-50');

                if (type === 'mercadoria') $("trackInventory").checked = true;

                if ($("trackInventory").checked) $("quantity-container").classList.remove('hidden');
                else $("quantity-container").classList.add('hidden');
            }
        },

        onTrackChange: (e) => {
            if (e.target.checked) {
                $("quantity-container").classList.remove('hidden');
            } else {
                $("quantity-container").classList.add('hidden');
                $("quantityOnHand").value = '';
            }
        }
    };

    modalEventsRef = events;
    return events;
}