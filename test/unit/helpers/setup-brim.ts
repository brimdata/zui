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
import {onPage} from "./utils"

class BrimTestContext {
  store: Store
  plugins: PluginManager
  main: BrimMain

  assign(args: {store: Store; plugins: PluginManager; main: BrimMain}) {
    this.store = args.store
    this.plugins = args.plugins
    this.main = args.main
  }

  select = (fn) => fn(this.store.getState())
  dispatch = (action) => this.store.dispatch(action)
  navTo = (path: string) => this.select(Current.getHistory).push(path)
  cleanup = () => this.plugins.deactivate()
}

type Args = {
  page?: string
  workspace?: Workspace
  pool?: Pool
}
const defaults = () => ({
  page: "search",
  workspace: null,
  pool: null
})

async function bootBrim({page}: Args = defaults()) {
  const brimMain = await main({lake: false})
  onPage(page)
  const {store, pluginManager} = await initialize()
  return {store, main: brimMain, plugins: pluginManager}
}

export function setupBrim(opts: Args = defaults()) {
  const context = new BrimTestContext()

  beforeEach(async () => {
    // If this fails, the tests will still run. When we're on
    // jest 27, this will fail the test as expected.
    const props = await bootBrim(opts)
    context.assign(props)
    if (opts.workspace) {
      context.dispatch(Workspaces.add(opts.workspace))
      if (opts.pool) {
        context.dispatch(Pools.setDetail(opts.workspace.id, opts.pool))
      }
    }
  })

  afterEach(() => context.cleanup())

  return context
}
