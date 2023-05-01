import log from "electron-log"
import {throttle} from "lodash"
import {State} from "src/js/state/types"
import {ZuiMain} from "../zui-main"
import {createOperation} from "../../core/operations"

const saveSession = throttle((main: ZuiMain) => {
  main.saveSession()
  log.debug("Session Autosaved")
}, 500)

export const autosaveOp = createOperation(
  "autosaveOp",
  async ({main}, windowId: string, windowState: State) => {
    if (main.isQuitting) return
    console.log(
      main.windows.all.map((w) => w.id),
      windowId
    )
    main.windows.update(windowId, windowState)
    saveSession(main)
  }
)

export type AutosaveOp = typeof autosaveOp
