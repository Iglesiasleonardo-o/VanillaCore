import { createMainView } from "./vanilla-viewgen.js";
import { matchPathname } from "./vanilla-router.js";
import { routes } from "./vanilla-routes.js";

startPageEvent();

function startPageEvent() {
    renderInitialView();
    updateUiByPathname(null);
    updateLucideIcons();
}

onpopstate = function (e) {
    e.preventDefault();
    updateUiByPathname(e.state);
}

function updateUiByPathname(state) {
    routes[matchPathname(routes)](state);
}

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