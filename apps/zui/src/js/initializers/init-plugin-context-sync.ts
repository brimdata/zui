import {invoke} from "src/core/invoke"
import Current from "../state/Current"
import {Store} from "../state/types"

export function initializePluginContextSync(store: Store) {
  if (globalThis.env.isHiddenWindow) return

  let lakeId = null

  const syncWindow = () =>
    invoke("window.sync", {
      lakeId: Current.getLakeId(store.getState()),
      id: globalThis.windowId,
    })

  store.subscribe(() => {
    const nextId = Current.getLakeId(store.getState())
    if (lakeId !== nextId) {
      lakeId = nextId
      syncWindow()
    }
  })

  window.addEventListener("focus", () => {
    syncWindow()
  })
}
