import {throttle} from "lodash"
import {getPersistedWindowState} from "../state/stores/get-persistable"
import onIdle from "on-idle"
import {invoke} from "src/core/invoke"

export function initAutosave(store) {
  if (!global.mainArgs.autosave) return

  let cancel = () => {}

  function saveState() {
    invoke(
      "autosaveOp",
      global.windowId,
      getPersistedWindowState(store.getState())
    )
  }

  function saveStateOnIdle() {
    cancel()
    cancel = onIdle(() => {
      saveState()
    })
  }

  const throttledSaveState = throttle(saveStateOnIdle, 1000)

  store.subscribe(() => {
    throttledSaveState()
  })
}
