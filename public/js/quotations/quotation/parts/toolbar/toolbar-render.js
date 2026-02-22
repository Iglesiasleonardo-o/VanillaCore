import { handleCloneClick, handleSaveClick } from './toolbar-events.js';
import { createNavigationHeader } from './toolbar-viewgen.js';

export function setupNavigationToolbar(quotationNumber) {
    return createNavigationHeader(quotationNumber, handleSaveClick, handleCloneClick);
}

export function renderLoadingState() {
    $('saveQuoteButton').disabled = true;
    $('saveButtonText').textContent = "A guardar...";
}

export function renderSuccessState() {
    $('saveButtonText').textContent = "Guardado!";
}

export function resetSaveButton() {
    $('saveQuoteButton').disabled = false;
    $('saveButtonText').textContent = "Gravar";
}