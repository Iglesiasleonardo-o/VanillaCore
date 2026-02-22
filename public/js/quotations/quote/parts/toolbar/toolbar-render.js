import { createNavigationHeader } from './toolbar-viewgen.js';
import { executeSave } from './toolbar-logic.js';

export function setupNavigationToolbar(quotationNumber) {
    return createNavigationHeader(
        quotationNumber,
        handleSaveClick,
        handleCloneClick
    );
}

async function handleSaveClick() {
    const saveButton = $('saveQuoteButton');
    const saveButtonText = $('saveButtonText');

    saveButton.disabled = true;
    saveButton.textContent = "A guardar...";
    await executeSave();

    saveButtonText.textContent = "Guardado!";

    setTimeout(function () {
        saveButton.disabled = false;
        saveButtonText.textContent = "Gravar";
    }, 1800);
}

function handleCloneClick(e) {
    console.log("LOGICA DE CLONAR COTACAO AQUI, COMECAR POR FECHAR O BOTAO CLONAR");
}
