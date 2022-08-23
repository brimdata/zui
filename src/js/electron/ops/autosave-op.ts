import log from "electron-log"
import {throttle} from "lodash"
import {State} from "src/js/state/types"
import {createOperation} from "../operations"

const saveSession = throttle((main) => {
  main.saveSession()
  log.info("Session Autosaved")
}, 1000)

export const autosaveOp = createOperation(
  "windows.autosave",
  async (main, e, args: {windowId: string; windowState: State}) => {
    main.windows.update(args.windowId, args.windowState)
    saveSession(main)
  }
)
