import { executeSave } from './toolbar-logic.js';
import { renderLoadingState, renderSuccessState, resetSaveButton } from './toolbar-render.js';

export async function handleSaveClick() {
    renderLoadingState();
    await executeSave();
    renderSuccessState();
    setTimeout(resetSaveButton, 1800);
}

export function handleCloneClick(e) {
    console.log("LOGICA DE CLONAR COTACAO AQUI, COMECAR POR FECHAR O BOTAO CLONAR");
}