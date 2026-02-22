import { createLiveState } from '../../../../vanilla-core/vanilla-livestate.js';
import { executeSave } from './logic/network.js';
import { createNavigationHeader } from './toolbar-viewgen.js';

export function setupNavigationToolbar(quotationNumber) {
    // 1. The Source of Truth (Only dynamic data)
    const state = createLiveState({
        saveStatus: "idle"
    });

    const events = setupEvents(state);

    // 2. Pass static data directly to ViewGen
    const { root, views } = createNavigationHeader(quotationNumber, events);

    observeState(state, views);

    return root;
}

function observeState(state, { saveButton, saveButtonText }) {
    state.on("saveStatus", (status) => {
        if (status === "idle") {
            saveButton.disabled = false;
            saveButtonText.textContent = "Guardar";
        } else if (status === "saving") {
            saveButton.disabled = true;
            saveButtonText.textContent = "A guardar...";
        } else if (status === "saved") {
            saveButton.disabled = true;
            saveButtonText.textContent = "Guardado!";
        }
    });
}

// --- Events Factory ---
const setupEvents = state => ({
    onPrintClick: () => window.print(),

    onCloneClick: () => {
        console.log("LOGICA DE CLONAR COTACAO AQUI, COMECAR POR FECHAR O BOTAO CLONAR");
    },

    onSaveClick: async () => {
        // Prevent double-clicking
        if (state.saveStatus !== "idle") return;

        // 1. Trigger "saving" UI
        state.saveStatus = "saving";

        // 2. Execute business logic
        await executeSave();

        // 3. Trigger "saved" UI
        state.saveStatus = "saved";

        // 4. Return to "idle" UI after delay
        setTimeout(() => {
            state.saveStatus = "idle";
        }, 1800);
    }
});

