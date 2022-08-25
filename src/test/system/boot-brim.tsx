import "src/test/system/real-paths"
import React from "react"
import {main} from "src/js/electron/run-main/run-main"
import initialize from "src/js/initializers/initialize"
import fsExtra from "fs-extra"
import {BrimProvider} from "src/app/core/context"
import {getPort} from "./port-service"
import {waitFor} from "@testing-library/react"
import {Store} from "src/js/state/types"
import BrimApi from "src/js/api"
import {BrimMain} from "src/js/electron/brim"

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
  api: BrimApi
): React.ComponentType<React.PropsWithChildren<any>> {
  return function Wrapper({children}) {
    return (
      <BrimProvider store={store} api={api}>
        {children}
      </BrimProvider>
    )
  }
}

export async function bootBrim(name: string, args: Partial<BootArgs> = {}) {
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
  })) as BrimMain
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
