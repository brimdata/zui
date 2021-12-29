import {app} from "electron"
import keytar from "keytar"
import os from "os"
import path from "path"
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
import tron, {Session} from "./tron"
import formatSessionState from "./tron/formatSessionState"
import {sessionStateFile} from "./tron/session"
import {WindowManager} from "./tron/window-manager"

type QuitOpts = {
  saveSession?: boolean
}

type BrimArgs = {
  windows?: WindowManager
  store?: Store
  session?: Session
  lake?: Lake
}

export class BrimMain {
  readonly windows: WindowManager
  readonly store: Store
  readonly lake: Lake
  readonly session: Session
  public isQuitting = false

  static async boot(
    sessionPath: string = sessionStateFile(),
    createSession = tron.session
  ) {
    const session = createSession(sessionPath)
    const data = await session.load()
    const windows = new WindowManager(data)
    const store = createGlobalStore(data?.globalState)
    const lakeroot = path.join(app.getPath("userData"), "data", "lake")
    const lake = new Lake(lakeroot)
    return new BrimMain({session, windows, store, lake})
  }

  constructor(args: BrimArgs = {}) {
    this.windows = args.windows || new WindowManager()
    this.store = args.store || createGlobalStore(undefined)
    this.session = args.session || tron.session()
    this.lake = args.lake || new Lake(null)
  }

  async start(opts = {backend: true}) {
    if (opts.backend) {
      this.lake.start()
    }
    if (this.isDev()) await installExtensions()

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
