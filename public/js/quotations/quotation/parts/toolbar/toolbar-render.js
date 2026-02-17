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