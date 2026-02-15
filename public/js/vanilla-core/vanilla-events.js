import { renderInitialView, updateLucideIcons } from "./vanilla-render.js";
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