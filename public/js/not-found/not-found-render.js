import { RenderView } from "../vanilla-core/vanilla-render.js";
import { NotFoundPage } from "./not-found-viewgen.js";

export function loadNotFoundPage() {
  const view = NotFoundPage(() => {
    window.location.href = "/";
  });

  RenderView(view);
}
