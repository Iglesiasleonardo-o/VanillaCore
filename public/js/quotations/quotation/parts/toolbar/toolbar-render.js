export function renderLoadingState() {
    $('saveQuoteButton').disabled = true;
    $('saveButtonText').textContent = "A guardar...";
}

export function renderSuccessState() {
    $('saveButtonText').textContent = "Guardado!";
}

export function resetSaveButton() {
    $('saveQuoteButton').disabled = false;
    $('saveButtonText').textContent = "Gravar Cotacao";
}

export function toggleOptionsMenu() {
    const menu = $('optionsMenuDropdown');
    menu.classList.toggle('hidden');
}

export function hideOptionsMenu() {
    $('optionsMenuDropdown').classList.add('hidden');
}