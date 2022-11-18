import log from "electron-log"
import {throttle} from "lodash"
import {State} from "src/js/state/types"
import {createOperation} from "../operations"

const saveSession = throttle((main) => {
  main.saveSession()
  log.debug("Session Autosaved")
}, 500)

export const autosaveOp = createOperation(
  "windows.autosave",
  async ({main}, windowId: string, windowState: State) => {
    main.windows.update(windowId, windowState)
    saveSession(main)
  }
)
