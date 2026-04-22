import { RenderView } from "../vanilla-core/vanilla-render.js";
import { loadQuotationsData, deleteQuotation, saveQuotation, updateQuotationStatus } from "./quotations-network.js";
import { toQuoteCardViewModel } from "./quotations-viewmodel.js";
import { QuotationsPageLayout, QuotationsHeader, QuoteCard, EmptyStateGrid, BottomLoader, ModalWidget } from "./quotations-viewgen.js";
import { generateNextQuotationNumber, addDaysToToday, getTodayISODate } from "./quotations-math.js";
import { loadQuotationByURLEvent } from "./quotation/quotation-render.js";

let gridObserver = null;
let currentCursor = null;
let currentSearchQuery = "";
let currentStatusFilter = "";
let searchTimeout = null;
let localQuotations = [];
let isFetching = false;

export async function loadQuotationsListByURL() {
    try {
        const ui = setupQuotationsModule();
        RenderView(ui.layout, ui.modal);
        await ui.executeSearch("");
    } catch (error) {
        console.error("Failed to load quotations:", error);
    }
}

function setupQuotationsModule() {
    const appContainer = document.createElement("div");
    appContainer.className = "flex flex-col w-full";

    const gridContainer = document.createElement("div");
    gridContainer.id = "quotesGrid";
    gridContainer.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 md:px-8 pt-2 pb-12";

    const loader = BottomLoader();

    const uiControls = setupUIControls();
    const events = setupEvents(gridContainer, loader, uiControls);

    appContainer.appendChild(QuotationsHeader(events));
    appContainer.appendChild(gridContainer);
    appContainer.appendChild(loader);

    // ==========================================
    // INTERCEPTOR DE ROTEAMENTO (SPA NAVIGATION)
    // ==========================================
    appContainer.addEventListener('click', (e) => {
        // Verifica se o clique foi num link (ou dentro de um link)
        const link = e.target.closest('a');
        
        // Se for um link que aponta para uma cotação específica
        if (link && link.getAttribute('href') && link.getAttribute('href').startsWith('/quotations/')) {
            e.preventDefault(); // Impede o browser de recarregar a página
            
            // 1. Atualiza a barra de endereço sem recarregar
            history.pushState(null, "", link.getAttribute('href'));
            
            // 2. Dispara o render da Cotação diretamente
            loadQuotationByURLEvent();
        }
    });

    // Global Click para os Dropdowns Kebab
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-menu') && !e.target.closest('.dropdown-toggle')) {
            uiControls.closeAllDropdowns();
        }
    });

    return {
        layout: QuotationsPageLayout(appContainer),
        modal: ModalWidget(events),
        executeSearch: events.executeSearch
    };
}

function setupEvents(gridContainer, loader, ui) {
    const renderItems = (items, append = false) => {
        if (!append) gridContainer.textContent = '';

        if (!append && items.length === 0) {
            gridContainer.appendChild(EmptyStateGrid());
            if (window.lucide) window.lucide.createIcons();
            return;
        }

        items.forEach(q => {
            const vm = toQuoteCardViewModel(q);
            gridContainer.appendChild(QuoteCard(vm, events));
        });

        if (window.lucide) window.lucide.createIcons();
    };

    const loadMore = async () => {
        if (isFetching || currentCursor === null) return;
        isFetching = true;
        loader.classList.remove("hidden");

        const response = await loadQuotationsData(currentSearchQuery, currentCursor, currentStatusFilter);

        currentCursor = response.nextCursor;
        localQuotations = [...localQuotations, ...response.data];

        renderItems(response.data, true);

        loader.classList.add("hidden");
        isFetching = false;
    };

    const executeSearch = async (query, status) => {
        if (isFetching) return;
        isFetching = true;

        currentSearchQuery = query !== undefined ? query : currentSearchQuery;
        currentStatusFilter = status !== undefined ? status : currentStatusFilter;
        currentCursor = 0;

        gridContainer.textContent = '';
        loader.classList.remove("hidden");

        const response = await loadQuotationsData(currentSearchQuery, currentCursor, currentStatusFilter);

        localQuotations = response.data;
        currentCursor = response.nextCursor;

        renderItems(localQuotations, false);

        loader.classList.add("hidden");
        isFetching = false;

        // Reinicia o Observer no loader
        if (gridObserver) gridObserver.disconnect();
        gridObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) loadMore();
        }, { rootMargin: "200px" });
        gridObserver.observe(loader);
    };

    const events = {
        executeSearch,

        onSearchInput: (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => executeSearch(e.target.value, undefined), 400);
        },

        onFilterChange: (e) => {
            executeSearch(undefined, e.target.value);
        },

        onCloseModal: () => ui.hideModal(),

        onToggleKebab: (id) => {
            const menuId = `dropdown-menu-${id}`;
            const menu = $(menuId);
            if (menu) {
                const isHidden = menu.classList.contains('hidden');
                ui.closeAllDropdowns(menuId);
                if (isHidden) menu.classList.remove('hidden');
            }
        },

        onDeleteDraft: (e, id) => {
            ui.closeAllDropdowns();
            const quote = localQuotations.find(q => q.id === id);
            if (!quote) return;

            ui.showModal(
                'Apagar Rascunho',
                `Tem a certeza que deseja excluir o Rascunho Nº ${quote.number}? Esta ação é irreversível.`,
                'Apagar', 'bg-red-600 hover:bg-red-700',
                async () => {
                    await deleteQuotation(id);
                    await executeSearch();
                }
            );
        },

        onCloneToDraft: (e, id) => {
            ui.closeAllDropdowns();
            const quote = localQuotations.find(q => q.id === id);
            if (!quote) return;

            ui.showModal(
                'Clonar para Rascunho',
                `Vai criar um novo RASCUNHO com base na Cotação Nº ${quote.number}. Confirmar?`,
                'Clonar', 'bg-blue-600 hover:bg-blue-700',
                async () => {
                    const newQuote = { ...quote };
                    newQuote.number = generateNextQuotationNumber(localQuotations);
                    newQuote.status = 'Rascunho';
                    newQuote.date = getTodayISODate();
                    newQuote.expiry = addDaysToToday(30);

                    await saveQuotation(newQuote);
                    await executeSearch();
                }
            );
        },

        onRenewQuote: (id) => {
            ui.closeAllDropdowns();
            const quote = localQuotations.find(q => q.id === id);
            if (!quote) return;

            ui.showModal(
                'Renovar Cotação',
                `Vai RENOVAR a Cotação Nº ${quote.number} gerando uma nova versão Pendente. Continuar?`,
                'Renovar', 'bg-green-600 hover:bg-green-700',
                async () => {
                    const newQuote = { ...quote };
                    newQuote.number = generateNextQuotationNumber(localQuotations);
                    newQuote.status = 'Pendente';
                    newQuote.date = getTodayISODate();
                    newQuote.expiry = addDaysToToday(30);

                    await saveQuotation(newQuote);
                    await executeSearch();
                }
            );
        },

        onCancelQuote: (e, id) => {
            ui.closeAllDropdowns();
            const quote = localQuotations.find(q => q.id === id);
            if (!quote) return;

            ui.showModal(
                'Cancelar Cotação',
                `Atenção: Tem a certeza que pretende CANCELAR a Cotação Nº ${quote.number}?`,
                'Cancelar Cotação', 'bg-red-600 hover:bg-red-700',
                async () => {
                    await updateQuotationStatus(id, 'Cancelada');
                    await executeSearch();
                }
            );
        }
    };

    return events;
}

function setupUIControls() {
    let confirmAction = null;

    return {
        closeAllDropdowns: (excludeId) => {
            const menus = document.querySelectorAll('.dropdown-menu');
            menus.forEach(menu => {
                if (menu.id !== excludeId) menu.classList.add('hidden');
            });
        },

        showModal: (title, message, btnText, btnClass, onConfirm) => {
            $('modalTitle').textContent = title;
            $('modalMessage').textContent = message;

            const confirmBtn = $('modalConfirm');
            confirmBtn.textContent = btnText;

            confirmBtn.className = `px-4 py-2.5 text-white font-medium rounded-xl shadow-md transition-colors ${btnClass}`;

            confirmAction = onConfirm;

            const newBtn = confirmBtn.cloneNode(true);
            confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirmAction) confirmAction();
                $('modalClose').click();
            });

            document.body.classList.add('modal-open');
            $('modalOverlay').classList.remove('modal-hidden', 'opacity-0', 'pointer-events-none');
            $('modalContainer').classList.remove('scale-95', 'opacity-0');
        },

        hideModal: () => {
            document.body.classList.remove('modal-open');
            $('modalContainer').classList.add('scale-95', 'opacity-0');
            $('modalOverlay').classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => { $('modalOverlay').classList.add('modal-hidden'); }, 200);
            confirmAction = null;
        }
    };
}