import log from "electron-log"
import {throttle} from "lodash"
import {State} from "src/js/state/types"
import {createOperation} from "../operations"

const saveSession = throttle((main) => {
  main.saveSession()
  log.info("Session Autosaved")
}, 1000)

export const autosave = createOperation(
  "windows.autosave",
  async (main, e, args: {windowId: string; windowState: State}) => {
    main.windows.setWindowState(args.windowId, args.windowState)
    saveSession(main)
  }
)
