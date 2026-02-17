import { executeSave } from './toolbar-logic.js';
import { renderLoadingState, renderSuccessState, resetSaveButton } from './toolbar-render.js';
import { createNavigationHeader } from './toolbar-viewgen.js';

export function setupNavigationToolbar(quotationNumber) {
    return createNavigationHeader(quotationNumber, handleSaveClick, handleCloneClick);
}

async function handleSaveClick() {
    renderLoadingState();
    await executeSave();
    renderSuccessState();
    setTimeout(resetSaveButton, 1800);
}

function handleCloneClick(e) {
    console.log("LOGICA DE CLONAR COTACAO AQUI, COMECAR POR FECHAR O BOTAO CLONAR");
}