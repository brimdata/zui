import {main as runMain} from "src/electron/run-main/run-main"
import {MainObject} from "src/core/main/main-object"
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
    autoUpdater: false,
  })) as MainObject
  const windowId = main.windows.byName("search")[0].id
  const windowName = "search"
  const {store} = await initialize(windowId, windowName)

  return store
}
