import {Renderer} from "src/core/renderer"
import Tabs from "../Tabs"

export function createRendererEventsMiddleware(renderer: Renderer) {
  return (_store) => (next) => (action) => {
    if (action.type === Tabs.remove.toString()) {
      renderer.emit("tab-close", action.payload)
    }
    return next(action)
  }
}
