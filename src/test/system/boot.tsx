import "src/test/system/real-paths"
import React from "react"
import {main} from "src/js/electron/run-main/run-main"
import initialize from "src/js/initializers/initialize"
import fsExtra from "fs-extra"
import {AppProvider} from "src/app/core/context"
import {getPort} from "./port-service"
import {waitFor} from "@testing-library/react"
import {Store} from "src/js/state/types"
import ZuiApi from "src/js/api/zui-api"
import {ZuiMain} from "src/js/electron/zui-main"

const defaults = () => ({
  page: "search",
  port: null as null | number,
})

export type BootArgs = ReturnType<typeof defaults>

export function onPage(name: string) {
  window.history.replaceState(null, `Testing Page: ${name}`, `${name}.html`)
}

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
  onPage(args.page)
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
  })) as ZuiMain
  await waitFor(async () => fetch(`http://localhost:${lakePort}/version`), {
    timeout: 20_000,
  })
  const brimRenderer = await initialize()
  return {
    main: brimMain,
    store: brimRenderer.store,
    plugins: brimRenderer.pluginManager,
    api: brimRenderer.api,
    wrapper: createWrapper(brimRenderer.store, brimRenderer.api),
  }
}
