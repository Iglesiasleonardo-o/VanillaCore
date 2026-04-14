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
    setInitialRoute();
}

function updateUiByPathname(state) {
    routes[matchPathname(routes)](state);
}

export function renderInitialView() {
    const onRouteChange = (e, route) => {
        e.preventDefault();
        history.pushState(null, null, route);
        updateUiByPathname(e.state);
        setActiveNav(route);
    }

    document.body.textContent = '';
    document.body.appendChild(
        createMainView({}, onRouteChange)
    );
    setInitialRoute();
}

function setInitialRoute() {
    setActiveNav(location.pathname.split("/")[1] || "quotations");
}

function setActiveNav(route) {
    document.querySelector('nav a.bg-blue-600')?.classList.remove("text-white", "bg-blue-600", "shadow-lg");
    $(`${route}-nav`).classList.add("text-white", "bg-blue-600", "shadow-lg");
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