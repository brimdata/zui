import * as tl from "@testing-library/react"
import {fireEvent, waitFor} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {BrimProvider} from "app/core/context"
import "cross-fetch/polyfill"
import {dialog} from "electron"
import fsExtra from "fs-extra"
import React from "react"
import BrimApi from "src/js/api"
import {BrimMain} from "src/js/electron/brim"
import {main} from "src/js/electron/main"
import initialize from "src/js/initializers/initialize"
import {defaultWorkspace} from "src/js/initializers/initWorkspaceParams"
import PluginManager from "src/js/initializers/pluginManager"
import Current from "src/js/state/Current"
import {Store} from "src/js/state/types"
import data from "test/shared/data"
import "web-streams-polyfill"
import {getPort} from "./port-service"
import {setupServer} from "msw/node"

const defaults = () => ({
  page: "search",
  port: null as null | number
})

type Args = ReturnType<typeof defaults>

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
  args = {...defaults(), ...args}
  const lakeRoot = `./run/system/${name}/root`
  const lakeLogs = `./run/system/${name}/logs`
  const lakePort = args.port || (await getPort())
  const appState = `./run/system/${name}/appState.json`
  onPage(args.page)
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

  await waitFor(() => fetch(`http://localhost:${lakePort}/version`))

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
  click = userEvent.click
  rightClick = fireEvent.contextMenu
  network = setupServer()

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
      this.network.listen({
        onUnhandledRequest: (req) => {
          if (req.url.host.startsWith("localhost:")) return // Allow requests to a localhost server
          throw new Error(
            `Unhandled External Request: ${req.method} ${req.url.href}`
          )
        }
      })
      this.assign(await bootBrim(name, opts))
      this.navTo(`/workspaces/${defaultWorkspace().id}`)
    })

    afterEach(() => this.network.resetHandlers())

    afterAll(async () => {
      await this.plugins.deactivate()
      await this.main.quit()
      tl.cleanup()
      this.network.close()
    })
  }

  navTo(path: string) {
    Current.getHistory(this.store.getState()).push(path)
  }

  render(ui: JSX.Element) {
    return tl.render(ui, {wrapper: this.wrapper})
  }

  async importFile(name: string) {
    const file = data.getWebFile(name)
    await tl.act(() => this.api.import([file]))
    await tl.screen.findByText(/import complete/i)
  }

  runQuery(query: string, id = "Table") {
    this.api.search(query)
    return new Promise<void>((resolve) => {
      this.api.searches.onDidFinish((search) => {
        if (search.id === id) resolve()
      })
    })
  }

  mockSaveDialog(result: {canceled: boolean; filePath: string}) {
    const save = jest.spyOn(dialog, "showSaveDialog")
    save.mockImplementationOnce(() => {
      return Promise.resolve(result)
    })
    return save
  }

  select(selector: Function) {
    return selector(this.store.getState())
  }

  silenceNext(method: "log" | "error") {
    jest.spyOn(console, method).mockImplementationOnce(() => {})
  }
}
