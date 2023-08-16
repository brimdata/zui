import {invoke} from "src/core/invoke"
import Current from "../state/Current"
import {Store} from "../state/types"

export function initializePluginContextSync(store: Store) {
  let lakeId = null

  const syncWindow = () =>
    invoke("window.sync", {lakeId: Current.getLakeId(store.getState())})

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
