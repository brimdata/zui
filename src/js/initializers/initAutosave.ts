import {throttle} from "lodash"
import {autosave} from "../electron/ops/autosave"
import {getPersistedWindowState} from "../state/getPersistable"
import onIdle from "on-idle"

export function initAutosave(store) {
  let cancel = () => {}

  function saveFunction() {
    cancel()
    cancel = onIdle(() => {
      autosave.invoke({
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
