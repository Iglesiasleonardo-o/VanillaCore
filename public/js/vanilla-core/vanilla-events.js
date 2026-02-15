import { renderInitialView } from "./vanilla-render.js";
import { matchPathname } from "./vanilla-router.js";
import { routes } from "./vanilla-routes.js";

renderInitialView();
updateUiByPathname(null);
updateLucideIcons();

function updateLucideIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

onpopstate = function (e) {
    e.preventDefault();
    updateUiByPathname(e.state);
}

function updateUiByPathname(state) {
    routes[matchPathname(routes)](state);
}