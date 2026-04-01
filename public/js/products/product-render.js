import { globalState } from "../vanilla-core/vanilla-global-state.js";
import { RenderView } from "../vanilla-core/vanilla-render.js";
import { fetchInitialProducts, searchProductsDatabase, saveProductDatabase } from "./product-network.js";
import { shouldSearch } from "./product-math.js";
import { createProductListViewModel } from "./product-viewmodel.js";
// import { setupSidebar } from "../navigation/sidebar-render.js"; 
import { 
    ProductsPageLayout, 
    LoadingState, 
    ProductErrorState,
    ProductMainWidget,
    ProductModal,
    ConfirmExitModal,
    ProductCard, 
    EmptyState 
} from "./product-viewgen.js";

// ==========================================
// ROUTE LOADER EVENT
// ==========================================
export async function loadProductsByURLEvent() {
    try {
        const loadingDiv = LoadingState();
        RenderView(loadingDiv);

        // Busca os produtos iniciais para popular a grelha
        const response = await fetchInitialProducts();

        loadingDiv.classList.add("hidden");

        // Passamos os dados da API (response.data ou response direto dependendo do fetch)
        renderSuccessState(response.data || response);
    } catch (error) {
        renderErrorState(error);
    }
}

function renderErrorState(error) {
    if (error.status === 404 || error.status === 500) {
        RenderView(ProductErrorState(error));
    } else {
        console.error(error);
        alert("Erro genérico ao carregar a página de produtos.");
    }
}

function renderSuccessState(initialProducts) {
    // Inicializa o módulo de produtos e recebe os componentes ViewGen
    const productUi = setupProductModule(initialProducts);

    RenderView(
        // Layout principal que engloba a Sidebar e o Main Content
        ProductsPageLayout( 
            productUi.widget      // O Header de pesquisa e a estrutura da Grelha
        ),
        // Aqui ficam os modais (montados na raiz do body para o z-index)
        productUi.modal,
        productUi.confirmModal
    );

    // Renderiza a grelha inicial agora que o contentor #productGrid já existe no DOM
    productUi.renderGrid();
}

// ==========================================
// MODULE SETUP
// ==========================================
export function setupProductModule(initialProducts) {
    let state = {
        isFormDirty: false,
        currentProductId: null,
        currentProductImageUrl: null
    };

    // Atualiza o DOM da grelha de produtos
    const renderGrid = async (query = "") => {
        const rawProducts = query ? await searchProductsDatabase(query) : initialProducts;
        const viewModels = createProductListViewModel(rawProducts);

        const container = document.getElementById("productGrid");
        if (!container) return;

        container.innerHTML = "";
        
        if (viewModels.length === 0) {
            container.appendChild(EmptyState());
        } else {
            viewModels.forEach(vm => {
                container.appendChild(ProductCard(vm, events));
            });
        }
        
        // Reinicializa os ícones após manipulação do DOM
        if (window.lucide) {
            lucide.createIcons();
        }
    };

    const resetModalUI = () => {
        const form = document.getElementById("productForm");
        if (form) form.reset();
        
        const imagePreview = document.getElementById("imagePreview");
        if (imagePreview) imagePreview.style.backgroundImage = 'none';
        
        const uploadIcon = document.getElementById("uploadIcon");
        if (uploadIcon) uploadIcon.style.display = 'flex';
        
        state.currentProductImageUrl = null;
        state.isFormDirty = false;
        // Reset de abas (tabs) pode ser chamado aqui
    };

    const openModal = (productId = null) => {
        resetModalUI();
        state.currentProductId = productId;

        if (productId) {
            // Lógica de Edição: preencher os inputs do formulário com base no ID
        }

        document.getElementById("productModal").classList.remove("hidden");
        document.getElementById("productModalPanel").scrollTop = 0;
    };

    const requestCloseModal = () => {
        if (state.isFormDirty) {
            document.getElementById("confirmExitModal").classList.remove("hidden");
        } else {
            closeModal();
        }
    };

    const closeModal = () => {
        document.getElementById("productModal").classList.add("hidden");
        document.getElementById("confirmExitModal").classList.add("hidden");
        state.isFormDirty = false;
    };

    const events = {
        onSearchInput: (e) => {
            const val = e.target.value;
            // O shouldSearch no math.js permite validar se faz sentido procurar (ex: >= 2 chars)
            // Se for vazio (""), forçamos a pesquisa para repor a lista inicial
            if (shouldSearch(val) || val === "") renderGrid(val);
        },
        
        onOpenNewModal: () => openModal(null),
        onEditProduct: (id) => openModal(id),
        
        onCancelExit: () => document.getElementById("confirmExitModal").classList.add("hidden"),
        onConfirmExit: () => closeModal(),
        
        onFormInput: () => { state.isFormDirty = true; },
        
        onSaveModal: async (e) => {
            e.preventDefault();
            
            const form = document.getElementById("productForm");
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            await saveProductDatabase({
                id: state.currentProductId,
                name: data.productName,
                price: parseFloat(data.salesPrice) || 0,
                // Restante mapeamento...
            });

            closeModal();
            renderGrid(document.getElementById("searchInput").value);
        },

        onBackdropClick: (e) => {
            if (e.target.id === "productModal") {
                requestCloseModal();
            }
        }
    };

    // Gera as ViewGens associando-lhes as funções de event handling
    const widget = ProductMainWidget(events); 
    const modal = ProductModal(events);
    const confirmModal = ConfirmExitModal(events);

    // Retorna os componentes para serem montados na página e a função para desenhar a lista
    return { widget, modal, confirmModal, renderGrid };
}