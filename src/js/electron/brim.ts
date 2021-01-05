import windowManager, {$WindowManager} from "./tron/windowManager"
import isDev from "./isDev"
import {installExtensions} from "./extensions"
import formatSessionState from "./tron/formatSessionState"
import createGlobalStore from "../state/createGlobalStore"
import {Store} from "redux"
import tron, {Session} from "./tron"
import Prefs from "../state/Prefs"
import {ZQD} from "../zqd/zqd"
import {app} from "electron"
import path from "path"
import {sessionStateFile} from "./tron/session"

type QuitOpts = {
  saveSession?: boolean
}

type BrimArgs = {
  windows?: $WindowManager
  store?: Store
  session?: Session
  zqd?: ZQD
}

export class Brim {
  readonly windows: $WindowManager
  readonly store: Store
  readonly zqd: ZQD
  readonly session: Session
  public isQuitting = false

  static async boot(
    sessionPath: string = sessionStateFile(),
    createSession = tron.session
  ) {
    const session = createSession(sessionPath)
    const data = await session.load()
    const windows = windowManager(data)
    const store = createGlobalStore(data?.globalState)
    const select = (fn) => fn(store.getState())
    const suricataRunner = select(Prefs.getSuricataRunner)
    const suricataUpdater = select(Prefs.getSuricataUpdater)
    const zeekRunner = select(Prefs.getZeekRunner)
    const spaceDir = path.join(app.getPath("userData"), "data", "spaces")
    const zqd = new ZQD(spaceDir, suricataRunner, suricataUpdater, zeekRunner)
    return new Brim({session, windows, store, zqd})
  }

  constructor(args: BrimArgs = {}) {
    this.windows = args.windows || windowManager()
    this.store = args.store || createGlobalStore(undefined)
    this.session = args.session || tron.session()
    this.zqd = args.zqd || new ZQD(null, null, null, null)
  }

  async start() {
    this.zqd.start()
    if (this.isDev()) await installExtensions()
    this.windows.init()
  }

  activate() {
    if (this.windows.count() === 0) this.windows.init()
  }

  async resetState() {
    await this.session.delete()
    app.relaunch()
    this.quit({saveSession: false})
  }

  async saveSession() {
    const windowState = await this.windows.serialize()
    const mainState = this.store.getState()
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
      await this.zqd.close()
      app.quit()
    } else {
      this.isQuitting = false
    }
  }

  isDev() {
    return isDev
  }
}
