import {throttle} from "lodash"
import {autosaveOp} from "../electron/ops/autosave-op"
import {getPersistedWindowState} from "../state/getPersistable"
import onIdle from "on-idle"

export function initAutosave(store) {
  let cancel = () => {}

  function saveFunction() {
    cancel()
    cancel = onIdle(() => {
      autosaveOp.invoke({
        windowId: global.windowId,
        windowState: getPersistedWindowState(store.getState()),
      })
    })
  }

  const save = throttle(saveFunction, 1000)

  store.subscribe(() => {
    save()
  })
}
