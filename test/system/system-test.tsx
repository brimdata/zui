import {render} from "@testing-library/react"
import {BrimProvider} from "app/core/context"
import React from "react"
import BrimApi from "src/js/api"
import {BrimMain} from "src/js/electron/brim"
import {main} from "src/js/electron/main"
import initialize from "src/js/initializers/initialize"
import {defaultWorkspace} from "src/js/initializers/initWorkspaceParams"
import PluginManager from "src/js/initializers/pluginManager"
import Current from "src/js/state/Current"
import {Store} from "src/js/state/types"
import fsExtra from "fs-extra"

type Args = {
  page: string
}

const defaults = (): Args => ({
  page: "search"
})

export function onPage(name: string) {
  window.history.replaceState(null, `Testing Page: ${name}`, `${name}.html`)
}

function createWrapper(store: Store, api: BrimApi): React.ComponentType<any> {
  return function Wrapper({children}) {
    return (
      <BrimProvider store={store} api={api}>
        {children}
      </BrimProvider>
    )
  }
}

async function bootBrim(name: string, args: Partial<Args> = {}) {
  const {page} = {...defaults(), ...args}
  const lakeRoot = `./run/system/${name}/root`
  const lakeLogs = `./run/system/${name}/logs`
  const lakePort = 9888
  const appState = `./run/system/${name}/appState.json`
  onPage(page)
  fsExtra.removeSync(lakeRoot)
  fsExtra.removeSync(lakeLogs)
  fsExtra.removeSync(appState)
  const brimMain = await main({
    lakePort,
    lakeRoot,
    lakeLogs,
    appState,
    releaseNotes: false,
    autoUpdater: false
  })
  const brimRenderer = await initialize()
  return {
    main: brimMain,
    store: brimRenderer.store,
    plugins: brimRenderer.pluginManager,
    api: brimRenderer.api,
    wrapper: createWrapper(brimRenderer.store, brimRenderer.api)
  }
}

export class SystemTest {
  store: Store
  plugins: PluginManager
  main: BrimMain
  api: BrimApi
  wrapper: React.ComponentType<any>

  assign(args: {
    store: Store
    plugins: PluginManager
    main: BrimMain
    api: BrimApi
    wrapper: React.ComponentType<any>
  }) {
    this.store = args.store
    this.plugins = args.plugins
    this.main = args.main
    this.api = args.api
    this.wrapper = args.wrapper
  }

  constructor(name: string, opts: Partial<Args> = {}) {
    opts = {...defaults(), ...opts}

    beforeAll(async () => {
      this.assign(await bootBrim(name, opts))
      this.navTo(`/workspaces/${defaultWorkspace().id}`)
    })

    afterAll(async () => {
      await this.plugins.deactivate()
      await this.main.quit()
    })
  }

  select = (fn: Function) => fn(this.store.getState())
  navTo = (path: string) => this.select(Current.getHistory).push(path)
  cleanup = () => this.plugins.deactivate()

  render(ui: JSX.Element) {
    return render(ui, {wrapper: this.wrapper})
  }
}
