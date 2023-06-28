import {main as runMain} from "src/electron/run-main/run-main"
import {ZuiMain} from "src/electron/zui-main"
import initialize from "src/js/initializers/initialize"
import {Store} from "src/js/state/types"
import {teardown} from "src/test/system/teardown"

export default async (): Promise<Store> => {
  teardown()
  const main = (await runMain({
    lake: false,
    devtools: false,
    releaseNotes: false,
    appState: null,
    autosave: null,
  })) as ZuiMain
  const windowId = main.windows.byName("search")[0].id
  const windowName = "search"
  const {store} = await initialize(windowId, windowName)

  return store
}
