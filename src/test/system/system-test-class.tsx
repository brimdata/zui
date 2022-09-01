import "web-streams-polyfill"
import "cross-fetch/polyfill"
import "@testing-library/jest-dom"
import * as tl from "@testing-library/react"
import {fireEvent} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {dialog} from "electron"
import React from "react"
import BrimApi from "src/js/api"
import {BrimMain} from "src/js/electron/brim"
import {defaultLake} from "src/js/initializers/initLakeParams"
import PluginManager from "src/js/initializers/pluginManager"
import Current from "src/js/state/Current"
import {Store} from "src/js/state/types"
import data from "src/test/shared/data"
import {setupServer} from "msw/node"
import {BootArgs, bootBrim} from "./boot-brim"
import Tabs from "src/js/state/Tabs"

jest.setTimeout(20_000)

export class SystemTest {
  store: Store
  plugins: PluginManager
  main: BrimMain
  api: BrimApi
  wrapper: React.ComponentType<React.PropsWithChildren<any>>
  click = userEvent.click
  rightClick = fireEvent.contextMenu
  network = setupServer()
  initialized = false

  assign(args: {
    store: Store
    plugins: PluginManager
    main: BrimMain
    api: BrimApi
    wrapper: React.ComponentType<React.PropsWithChildren<any>>
  }) {
    this.store = args.store
    this.plugins = args.plugins
    this.main = args.main
    this.api = args.api
    this.wrapper = args.wrapper
    this.initialized = true
  }

  constructor(name: string, opts: Partial<BootArgs> = {}) {
    beforeAll(async () => {
      this.network.listen({
        onUnhandledRequest: (req) => {
          if (req.url.host.startsWith("localhost:")) return // Allow requests to a localhost server
          throw new Error(
            `Unhandled External Request: ${req.method} ${req.url.href}`
          )
        },
      })

      this.assign(await bootBrim(name, opts))
      this.store.dispatch(Tabs.create())
      this.navTo(`/lakes/${defaultLake().id}`)
    })

    afterEach(() => this.network.resetHandlers())

    afterAll(async () => {
      if (this.initialized) {
        await this.plugins.deactivate()
        await this.main.quit()
        tl.cleanup()
        this.network.close()
      }
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
    await tl.act(() => this.api.pools.load([file]))
    await tl.screen.findByText(/import complete/i)
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
