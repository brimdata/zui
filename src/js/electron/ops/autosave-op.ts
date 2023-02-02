import log from "electron-log"
import {throttle} from "lodash"
import {State} from "src/js/state/types"
import {BrimMain} from "../brim"
import {createOperation} from "../operations"

const saveSession = throttle((main: BrimMain) => {
  main.saveSession()
  log.debug("Session Autosaved")
}, 500)

export const autosaveOp = createOperation(
  "windows.autosave",
  async ({main}, windowId: string, windowState: State) => {
    if (main.isQuitting) return
    main.windows.update(windowId, windowState)
    saveSession(main)
  }
)
