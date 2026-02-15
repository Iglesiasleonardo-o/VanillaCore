import { createMainView } from "./vanilla-viewgen.js";

export function renderInitialView() {
    document.body.textContent = '';
    document.body.appendChild(createMainView());
}

export function RenderView(viewElement) {
    const container = document.getElementById('mainContainer');

    container.textContent = '';
    container.appendChild(viewElement);
}