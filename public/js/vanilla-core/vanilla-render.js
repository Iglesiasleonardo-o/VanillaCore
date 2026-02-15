import { createMainView } from "./vanilla-viewgen.js";

export function renderInitialView() {
    document.body.textContent = '';
    document.body.appendChild(createMainView());
}

export function RenderView(viewElement) {
    const container = document.getElementById('main-wrapper');
    container.textContent = '';
    container.appendChild(viewElement);
    updateLucideIcons(); // not sure if its always needed
}

export function updateLucideIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}