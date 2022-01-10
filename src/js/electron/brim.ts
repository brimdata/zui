import {app} from "electron"
import keytar from "keytar"
import os from "os"
import {Lake} from "ppl/lake/lake"
import {Store} from "redux"
import url from "url"
import {
  deserializeState,
  toAccessTokenKey,
  toRefreshTokenKey
} from "../auth0/utils"
import createGlobalStore from "../state/createGlobalStore"
import {getGlobalPersistable} from "../state/getPersistable"
import Lakes from "../state/Lakes"
import {installExtensions} from "./extensions"
import ipc from "./ipc"
import sendTo from "./ipc/sendTo"
import isDev from "./isDev"
import {MainArgs, mainDefaults} from "./main"
import tron, {Session} from "./tron"
import formatSessionState from "./tron/formatSessionState"
import {WindowManager} from "./tron/window-manager"

type QuitOpts = {
  saveSession?: boolean
}

export class BrimMain {
  public isQuitting = false

  static async boot(params: Partial<MainArgs> = {}) {
    const args = {...mainDefaults(), ...params}
    const createSession = tron.session
    const session = createSession(args.appState)
    const data = await session.load()
    const windows = new WindowManager(data)
    const store = createGlobalStore(data?.globalState)
    const lake = new Lake(args.lakeRoot, args.lakePort, args.lakeLogs)
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
    Lakes.all(this.store.getState()).forEach((ws) => {
      if (ws.authType !== "auth0") return
      keytar.deletePassword(toRefreshTokenKey(ws.id), os.userInfo().username)
      keytar.deletePassword(toAccessTokenKey(ws.id), os.userInfo().username)
    })
    await this.session.delete()
    app.relaunch()
    this.quit({saveSession: false})
  }

  async saveSession() {
    const windowState = await this.windows.serialize()
    const mainState = getGlobalPersistable(this.store.getState())

    await this.session.save(formatSessionState(windowState, mainState))
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
      await this.lake.close()
      app.quit()
    } else {
      this.isQuitting = false
    }
  }

  openUrl(uri) {
    const urlParts = url.parse(uri, true)
    const code = urlParts.query.code as string
    const state = urlParts.query.state as string
    const {workspaceId, windowId} = deserializeState(state)
    const win = this.windows.getWindow(windowId)

    win.ref.focus()

    sendTo(win.ref.webContents, ipc.windows.authCallback(workspaceId, code))
  }

  isDev() {
    return isDev
  }
}
