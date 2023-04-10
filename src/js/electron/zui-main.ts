import {app} from "electron"
import keytar from "keytar"
import os from "os"
import {Lake} from "@brimdata/zed-node"
import {Store as ReduxStore} from "redux"
import url from "url"
import {
  deserializeState,
  toAccessTokenKey,
  toRefreshTokenKey,
} from "../auth0/utils"
import {getPersistedGlobalState} from "../state/stores/get-persistable"
import Lakes from "../state/Lakes"
import {installExtensions} from "./extensions"
import {decodeSessionState, encodeSessionState} from "./session-state"
import {WindowManager} from "./windows/window-manager"
import * as zdeps from "./zdeps"
import {MainArgs, mainDefaults} from "./run-main/args"
import createSession, {Session} from "./session"
import {getAppMeta, AppMeta} from "./meta"
import {createMainStore} from "../state/stores/create-main-store"
import {AppDispatch, State} from "../state/types"

export class ZuiMain {
  public isQuitting = false

  static async boot(params: Partial<MainArgs> = {}) {
    const args = {...mainDefaults(), ...params}
    const session = createSession(args.appState)
    const data = decodeSessionState(await session.load())
    const windows = new WindowManager(data)
    const store = createMainStore(data?.globalState)
    const appMeta = await getAppMeta()
    const lake = new Lake({
      root: args.lakeRoot,
      port: args.lakePort,
      logs: args.lakeLogs,
      bin: zdeps.zed,
      corsOrigins: ["*"],
    })
    return new ZuiMain(lake, windows, store, session, args, appMeta)
  }

  // Only call this from boot
  constructor(
    readonly lake: Lake,
    readonly windows: WindowManager,
    readonly store: ReduxStore<State, any>,
    readonly session: Session,
    readonly args: MainArgs,
    readonly appMeta: AppMeta
  ) {}

  async start() {
    if (this.args.lake) this.lake.start()
    if (this.args.devtools) await installExtensions()
    await this.windows.init()
  }

  async stop() {
    await this.lake.stop()
  }

  async resetState() {
    // clear keys from secrets storage
    Lakes.all(this.store.getState()).forEach((l) => {
      if (l.authType !== "auth0") return
      keytar.deletePassword(toRefreshTokenKey(l.id), os.userInfo().username)
      keytar.deletePassword(toAccessTokenKey(l.id), os.userInfo().username)
    })
    await this.session.delete()
    app.relaunch()
  }

  saveSession() {
    const windowState = this.windows.serialize()
    const mainState = getPersistedGlobalState(this.store.getState())
    this.session.saveSync(encodeSessionState(windowState, mainState))
  }

  onBeforeQuit() {
    if (this.isQuitting) return
    this.saveSession()
    this.isQuitting = true
  }

  openUrl(uri: string) {
    const urlParts = url.parse(uri, true)
    const {code, state, error, error_description} = urlParts.query as {
      [key: string]: string
    }
    const {lakeId, windowId} = deserializeState(state)
    const win = this.windows.find(windowId)
    if (!win) {
      console.error("No Window Found")
    } else {
      win.ref.focus()
      win.ref.webContents.send("windows:authCallback", {
        code,
        lakeId,
        error,
        errorDesc: error_description,
      })
    }
  }

  get dispatch() {
    return this.store.dispatch as AppDispatch
  }
}
