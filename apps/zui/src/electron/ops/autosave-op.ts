import log from "electron-log"
import {throttle} from "lodash"
import {State} from "src/js/state/types"
import {MainObject} from "../../core/main/main-object"
import {createOperation} from "../../core/operations"

const saveSession = throttle((main: MainObject) => {
  main.saveSession()
  log.debug("Session Autosaved")
}, 500)

export const autosaveOp = createOperation(
  "autosaveOp",
  async ({main}, windowId: string, windowState: State) => {
    if (main.isQuitting) return
    main.windows.update(windowId, windowState)
    saveSession(main)
  }
)

export type AutosaveOp = typeof autosaveOp
