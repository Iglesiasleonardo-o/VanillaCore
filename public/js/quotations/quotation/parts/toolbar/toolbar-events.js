import { executeSave } from './toolbar-logic.js';
import { renderLoadingState, renderSuccessState, resetSaveButton, toggleOptionsMenu, hideOptionsMenu } from './toolbar-render.js';

export async function handleSaveClick() {
    renderLoadingState();
    await executeSave();
    renderSuccessState();
    setTimeout(resetSaveButton, 1800);
}

export function handleOptionsClick(e) {
    e.stopPropagation();
    toggleOptionsMenu();
}