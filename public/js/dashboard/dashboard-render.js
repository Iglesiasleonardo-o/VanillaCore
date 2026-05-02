import { RenderView } from "../vanilla-core/vanilla-render.js";
import { DashboardView } from "./dashboard-viewgen.js";

export function loadDasboardByURLEvent() {
    RenderView(DashboardView());
}