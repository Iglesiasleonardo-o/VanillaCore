import {
  RenderView,
  updateUiByPathname,
} from "../vanilla-core/vanilla-render.js";
import { NotFoundView } from "./not-found-viewgen.js";

export function loadNotFoundByURLEvent() {
  RenderView(NotFoundView(onGoHomeEvent));
}

const onGoHomeEvent = () => {
  history.pushState(null, null, "/");
  updateUiByPathname(null);
};
