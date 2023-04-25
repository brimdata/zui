import {throttle} from "lodash"
import {getPersistedWindowState} from "../state/stores/get-persistable"
import onIdle from "on-idle"
import {invoke} from "src/core/invoke"

export function initAutosave(store) {
  let cancel = () => {}

  function saveFunction() {
    cancel()
    cancel = onIdle(() => {
      invoke(
        "autosaveOp",
        global.windowId,
        getPersistedWindowState(store.getState())
      )
    })
  }

  const save = throttle(saveFunction, 1000)

  store.subscribe(() => {
    save()
  })
}
