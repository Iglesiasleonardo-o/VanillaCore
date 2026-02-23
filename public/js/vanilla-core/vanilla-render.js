import { createMainView } from "./vanilla-viewgen.js";

export function renderInitialView() {
    document.body.textContent = '';
    document.body.appendChild(createMainView());
}

export function RenderView() {
    const container = $("main-wrapper");
    container.textContent = '';

    for (const view of arguments) {
        container.appendChild(view);
    }

    updateLucideIcons();
}

export function AppendToMain() {
    const container = $("main-wrapper");

    for (const view of arguments) {
        container.appendChild(view);
    }
}

export function updateLucideIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}