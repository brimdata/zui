import {app} from "electron"
import keytar from "keytar"
import os from "os"
import {Lake} from "@brimdata/zealot"
import {Store} from "redux"
import url from "url"
import {
  deserializeState,
  toAccessTokenKey,
  toRefreshTokenKey,
} from "../auth0/utils"
import createGlobalStore from "../state/createGlobalStore"
import {getPersistedGlobalState} from "../state/getPersistable"
import Lakes from "../state/Lakes"
import {installExtensions} from "./extensions"
import isDev from "./isDev"
import tron, {Session} from "./tron"
import {decodeSessionState, encodeSessionState} from "./tron/session-state"
import {WindowManager} from "./tron/window-manager"
import * as zdeps from "./zdeps"
import {MainArgs, mainDefaults} from "./run-main/args"

type QuitOpts = {
  saveSession?: boolean
}

export class BrimMain {
  public isQuitting = false

  static async boot(params: Partial<MainArgs> = {}) {
    const args = {...mainDefaults(), ...params}
    const createSession = tron.session
    const session = createSession(args.appState)
    const data = decodeSessionState(await session.load())
    const windows = new WindowManager(data)
    const store = createGlobalStore(data?.globalState)
    const lake = new Lake({
      root: args.lakeRoot,
      port: args.lakePort,
      logs: args.lakeLogs,
      bin: zdeps.zed,
    })
    return new BrimMain(lake, windows, store, session, args)
  }

  // Only call this from boot
  constructor(
    readonly lake: Lake,
    readonly windows: WindowManager,
    readonly store: Store,
    readonly session: Session,
    readonly args: MainArgs
  ) {}

  async start() {
    if (this.args.lake) this.lake.start()
    if (this.args.devtools) await installExtensions()
    await this.windows.init()
  }

  async activate() {
    if (!this.windows.getVisible().length) await this.windows.init()
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
    this.quit({saveSession: false})
  }

  async saveSession() {
    const windowState = await this.windows.serialize()
    const mainState = getPersistedGlobalState(this.store.getState())

    await this.session.save(encodeSessionState(windowState, mainState))
  }

  async deleteSession() {
    await this.session.delete()
  }

  async quit(opts: QuitOpts = {saveSession: true}) {
    this.isQuitting = true
    if (await this.windows.confirmQuit()) {
      await this.windows.prepareQuit()
      if (opts.saveSession) {
        await this.saveSession()
      }
      this.windows.quit()
      await this.lake.stop()
      app.quit()
    } else {
      this.isQuitting = false
    }
  }

  openUrl(uri: string) {
    const urlParts = url.parse(uri, true)
    const {code, state, error, error_description} = urlParts.query as {
      [key: string]: string
    }
    const {lakeId, windowId} = deserializeState(state)
    const win = this.windows.getWindow(windowId)
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

  isDev() {
    return isDev
  }
}
