import {decode, zed} from "@brimdata/zealot"
import {setupDetailWindow} from "../electron/ops/open-detail-window-op"
import {viewLogDetail} from "../flows/viewLogDetail"
import initialize from "./initialize"

export const initDetail = async () => {
  const {store, api, pluginManager} = await initialize()
  const setup = await setupDetailWindow.invoke(global.windowId)
  if (setup) {
    global.windowHistory.replace(setup.url)
    const value = decode(setup.value) as zed.Record
    if (value) {
      store.dispatch(viewLogDetail(value))
    }
  }

  return {store, api, pluginManager}
}
