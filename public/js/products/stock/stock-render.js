import { RenderView } from "../../vanilla-core/vanilla-render.js";
import { products } from "../../vanilla-core/database.js";
import {
    loadStockBalance,
    loadStockEntries,
    loadStockExits,
    saveStockEntry,
    saveStockExit,
} from "./stock-network.js";
import {
    BalanceRow,
    EmptyState,
    EntryModal,
    EntryRow,
    ExitModal,
    ExitRow,
    LoadingState,
    StockErrorState,
    StockMainWidget,
    StockPageLayout,
} from "./stock-viewgen.js";
import {
    createBalanceRowViewModel,
    createEntryRowViewModel,
    createExitRowViewModel,
} from "./stock-viewmodel.js";
import { shouldSearch } from "./stock-math.js";

let currentTab = "balanco";
let searchTimeout = null;
let currentQuery = "";

export async function loadStockByURLEvent() {
    try {
        RenderView(LoadingState());

        const events = buildEvents();

        RenderView(
            StockPageLayout(StockMainWidget(events)),
            EntryModal(events),
            ExitModal(events)
        );

        populateProductSelects();
        await renderCurrentTab();
    } catch (error) {
        RenderView(StockErrorState(error));
    }
}

function buildEvents() {
    return {
        onSwitchTab: (tabId) => {
            currentTab = tabId;
            switchTab(tabId);
            renderCurrentTab();
        },
        onSearchInput: (e) => {
            const query = e.target.value.trim();
            if (!shouldSearch(query)) return;
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentQuery = query;
                renderCurrentTab();
            }, 300);
        },
        onOpenEntryModal: () => {
            $("entryModal").classList.remove("hidden");
            if (window.lucide) lucide.createIcons();
        },
        onCloseEntryModal: () => $("entryModal").classList.add("hidden"),
        onOpenExitModal: () => {
            $("exitModal").classList.remove("hidden");
            if (window.lucide) lucide.createIcons();
        },
        onCloseExitModal: () => $("exitModal").classList.add("hidden"),
        onSaveEntry: async () => {
            const productId = parseInt($("entry-product").value);
            const qty = parseInt($("entry-qty").value);
            if (!productId || !qty || qty < 1) return;

            const product = products.find((p) => p.id === productId);
            const today =
                $("entry-date").value || new Date().toISOString().slice(0, 10);

            await saveStockEntry({
                productId,
                productName: product?.name || "",
                supplier: $("entry-supplier").value.trim(),
                qty,
                unitCost:
                    parseFloat($("entry-cost").value.replace(",", ".")) || 0,
                qtyPerBox: parseInt($("entry-qty-box").value) || null,
                factor: $("entry-factor").value.trim() || null,
                date: today,
            });

            $("entryModal").classList.add("hidden");
            clearEntryForm();
            await renderCurrentTab();
        },
        onSaveExit: async () => {
            const productId = parseInt($("exit-product").value);
            const qty = parseInt($("exit-qty").value);
            if (!productId || !qty || qty < 1) return;

            const product = products.find((p) => p.id === productId);
            const today =
                $("exit-date").value || new Date().toISOString().slice(0, 10);

            await saveStockExit({
                productId,
                productName: product?.name || "",
                destination: $("exit-destination").value.trim(),
                qty,
                date: today,
            });

            $("exitModal").classList.add("hidden");
            clearExitForm();
            await renderCurrentTab();
        },
    };
}

function switchTab(tabId) {
    document
        .querySelectorAll(".stock-tab-panel")
        .forEach((p) => p.classList.add("hidden"));
    const panel = $(`stock-tab-${tabId}`);
    if (panel) panel.classList.remove("hidden");

    document.querySelectorAll(".stock-tab-button").forEach((b) => {
        b.classList.remove("border-blue-600", "text-blue-600", "border-b-2");
        b.classList.add("border-transparent", "text-gray-500");
    });

    const activeBtn = document.querySelector(
        `.stock-tab-button[data-tab="${tabId}"]`
    );
    if (activeBtn) {
        activeBtn.classList.remove("border-transparent", "text-gray-500");
        activeBtn.classList.add(
            "border-blue-600",
            "text-blue-600",
            "border-b-2"
        );
    }
}

async function renderCurrentTab() {
    showLoading(true);

    if (currentTab === "balanco") await renderBalance();
    else if (currentTab === "entradas") await renderEntries();
    else if (currentTab === "saidas") await renderExits();

    showLoading(false);
    if (window.lucide) lucide.createIcons();
}

async function renderBalance() {
    const tbody = $("balanceTableBody");
    if (!tbody) return;
    tbody.textContent = "";

    const items = await loadStockBalance(currentQuery);
    if (items.length === 0) {
        tbody.appendChild(EmptyState());
        return;
    }
    items.forEach((item) => {
        tbody.appendChild(BalanceRow(createBalanceRowViewModel(item)));
    });
}

async function renderEntries() {
    const tbody = $("entriesTableBody");
    if (!tbody) return;
    tbody.textContent = "";

    const entries = await loadStockEntries(currentQuery);
    if (entries.length === 0) {
        tbody.appendChild(EmptyState());
        return;
    }
    entries.forEach((entry) => {
        tbody.appendChild(EntryRow(createEntryRowViewModel(entry)));
    });
}

async function renderExits() {
    const tbody = $("exitsTableBody");
    if (!tbody) return;
    tbody.textContent = "";

    const exits = await loadStockExits(currentQuery);
    if (exits.length === 0) {
        tbody.appendChild(EmptyState());
        return;
    }
    exits.forEach((exit) => {
        tbody.appendChild(ExitRow(createExitRowViewModel(exit)));
    });
}

function showLoading(show) {
    const el = $("stockLoadingIndicator");
    if (!el) return;
    show ? el.classList.remove("hidden") : el.classList.add("hidden");
}

function populateProductSelects() {
    ["entry-product", "exit-product"].forEach((id) => {
        const sel = $(id);
        if (!sel) return;
        sel.textContent = "";
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Selecionar produto...";
        sel.appendChild(placeholder);
        products.forEach((p) => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = `${p.ref ? p.ref + " — " : ""}${p.name}`;
            sel.appendChild(opt);
        });
    });
}

function clearEntryForm() {
    [
        "entry-product",
        "entry-supplier",
        "entry-qty",
        "entry-cost",
        "entry-qty-box",
        "entry-factor",
        "entry-date",
    ].forEach((id) => {
        const el = $(id);
        if (el) el.value = "";
    });
}

function clearExitForm() {
    ["exit-product", "exit-destination", "exit-qty", "exit-date"].forEach(
        (id) => {
            const el = $(id);
            if (el) el.value = "";
        }
    );
}
