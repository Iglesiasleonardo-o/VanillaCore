import { NavigationHeader } from './toolbar-viewgen.js';
import { executeSave } from './toolbar-network.js';
import { loadQuotationsListByURL } from '../../../quotations-render.js';

export function setupNavigationToolbar(quotationNumber) {
    const events = setupEvents();
    return NavigationHeader(quotationNumber, events);
}

function setupEvents() {
    return {
        onBackToListClick: (e) => {
            e.preventDefault();
            history.pushState(null, "", "/quotations");
            loadQuotationsListByURL();
        },

        onPrintClick: () => window.print(),
        onCloneClick: () => console.log("Clone logic..."),
        onSaveClick: async () => {
            const btn = $("saveQuoteButton");
            const text = $("saveButtonText");

            btn.disabled = true;
            text.textContent = "A guardar...";

            await executeSave();

            text.textContent = "Guardado!";
            setTimeout(() => {
                btn.disabled = false;
                text.textContent = "Guardar";
            }, 1800);
        },
        onToggleDropdown: () => {
            $("options-dropdown").classList.toggle("hidden");
        }
    };
}