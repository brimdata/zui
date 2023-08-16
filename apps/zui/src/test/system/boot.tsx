import "src/test/system/real-paths"
import React from "react"
import {main} from "src/electron/run-main/run-main"
import initialize from "src/js/initializers/initialize"
import fsExtra from "fs-extra"
import {AppProvider} from "src/app/core/context"
import {getPort} from "./port-service"
import {waitFor} from "@testing-library/react"
import {Store} from "src/js/state/types"
import ZuiApi from "src/js/api/zui-api"
import {MainObject} from "src/core/main/main-object"

const defaults = () => ({
  page: "search",
  port: null as null | number,
})

export type BootArgs = ReturnType<typeof defaults>

function createWrapper(
  store: Store,
  api: ZuiApi
): React.ComponentType<React.PropsWithChildren<any>> {
  return function Wrapper({children}) {
    return (
      <AppProvider store={store} api={api}>
        {children}
      </AppProvider>
    )
  }
}

export async function boot(name: string, args: Partial<BootArgs> = {}) {
  args = {...defaults(), ...args}
  const lakeRoot = `./run/system/${name}/root`
  const lakeLogs = `./run/system/${name}/logs`
  const lakePort = args.port || (await getPort())
  const appState = `./run/system/${name}/appState.json`
  fsExtra.removeSync(lakeRoot)
  fsExtra.removeSync(lakeLogs)
  fsExtra.removeSync(appState)
  const brimMain = (await main({
    lakePort,
    lakeRoot,
    lakeLogs,
    appState,
    releaseNotes: false,
    autoUpdater: false,
    singleInstance: false,
  })) as MainObject
  await waitFor(async () => fetch(`http://localhost:${lakePort}/version`), {
    timeout: 20_000,
  })
  const windowId = brimMain.windows.byName("search")[0].id
  const brimRenderer = await initialize(windowId, "search")
  return {
    main: brimMain,
    store: brimRenderer.store,
    api: brimRenderer.api,
    wrapper: createWrapper(brimRenderer.store, brimRenderer.api),
  }
}
