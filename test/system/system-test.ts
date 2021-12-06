import {ipcRenderer} from "electron"
import {BrimMain} from "src/js/electron/brim"
import {main} from "src/js/electron/main"
import initialize from "src/js/initializers/initialize"
import PluginManager from "src/js/initializers/pluginManager"
import Current from "src/js/state/Current"
import Pools from "src/js/state/Pools"
import {Pool} from "src/js/state/Pools/types"
import {Store} from "src/js/state/types"
import Workspaces from "src/js/state/Workspaces"
import {Workspace} from "src/js/state/Workspaces/types"

class BrimTestContext {}

type Args = {
  page: string
  workspace?: Workspace
  pool?: Pool
}

const defaults = (): Args => ({
  page: "search"
})

export function onPage(name: string) {
  window.history.replaceState(null, `Testing Page: ${name}`, `${name}.html`)
}

async function bootBrim(name: string, args: Partial<Args> = {}) {
  const {page} = {...defaults(), ...args}
  const brimMain = await main({
    lakePort: 9888,
    lakeRoot: `./run/system/${name}/root`,
    lakeLogs: `./run/system/${name}/logs`
  })
  onPage(page)
  const {store, pluginManager} = await initialize()
  return {store, main: brimMain, plugins: pluginManager}
}

export class SystemTest {
  store: Store
  plugins: PluginManager
  main: BrimMain

  assign(args: {store: Store; plugins: PluginManager; main: BrimMain}) {
    this.store = args.store
    this.plugins = args.plugins
    this.main = args.main
  }

  constructor(name: string, opts: Partial<Args> = {}) {
    opts = {...defaults(), ...opts}

    beforeEach(async () => {
      this.assign(await bootBrim(name, opts))
    })

    afterEach(async () => {
      ipcRenderer.once("confirmClose", (e, reply) => {
        ipcRenderer.send(reply, true)
      })
      ipcRenderer.once("prepareClose", (e, reply) => {
        ipcRenderer.send(reply, true)
      })
      await this.plugins.deactivate()
      await this.main.quit()
    })
  }

  select = (fn) => fn(this.store.getState())
  dispatch = (action) => this.store.dispatch(action)
  navTo = (path: string) => this.select(Current.getHistory).push(path)
  cleanup = () => this.plugins.deactivate()
}
