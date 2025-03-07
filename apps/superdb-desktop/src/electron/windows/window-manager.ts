import {BrowserWindow, screen} from "electron"
import log from "electron-log"
import {last} from "lodash"
import {stack} from "./dimens"
import {SessionState} from "../session-state"
import {State} from "src/js/state/types"
import {ZuiWindow} from "./zui-window"
import {SerializedWindow, WindowName, WindowsState} from "./types"
import {createWindow, deserializeWindow} from "./create"
import {EventEmitter} from "events"

export class WindowManager extends EventEmitter {
  private windows: WindowsState = {}

  constructor(private session?: SessionState | null | undefined) {
    super()
  }

  async init() {
    if (this.session) {
      const windows = this.session.order
        .map((id) => this.session.windows[id])
        .map(deserializeWindow)
      await Promise.all(windows.map((w) => this.register(w)))
    }
    if (this.byName("search").length === 0) await this.create("search")
    if (this.byName("hidden").length === 0) await this.create("hidden")
  }

  get all(): ZuiWindow[] {
    return Object.values(this.windows).sort(
      (a, b) => b.lastFocused - a.lastFocused
    )
  }

  get count(): number {
    return this.all.length
  }

  get visible() {
    return this.all.filter((w) => w.name !== "hidden")
  }

  create(name: WindowName) {
    return this.register(
      createWindow(name, {dimens: this.getNextDimensFor(name)})
    )
  }

  activate(name: WindowName) {
    const [window] = this.byName(name)
    if (window) window.ref.focus()
    else this.create(name)
  }

  get focused() {
    return this.all.find(
      (f) => f.ref.webContents === BrowserWindow.getFocusedWindow()?.webContents
    )
  }

  find(id: string): ZuiWindow {
    return this.windows[id]
  }

  where(fn: (w: ZuiWindow) => boolean): ZuiWindow[] {
    return this.all.filter(fn)
  }

  byName(name: WindowName) {
    return this.where((w) => w.name === name)
  }

  update(id: string, state: State) {
    const win = this.find(id)
    if (win) {
      win.state = state
    } else {
      log.error("window not found: ", id)
    }
  }

  serialize(): SerializedWindow[] {
    return this.where((w) => w.persistable && !w.destroyed).map((w) =>
      w.serialize()
    )
  }

  get singleHidden() {
    return this.visible.length === 1 && !this.visible[0].ref.isVisible()
  }

  unhideAll() {
    this.visible.forEach((win) => win.ref.show())
  }

  isHidden(id: string) {
    const win = this.find(id)
    if (!win) throw new Error("Could not find window with id: " + id)
    return win.options.show === false
  }

  private async register(win: ZuiWindow) {
    this.windows[win.id] = win
    win.ref.on("close", (e) => this.emit("window-will-close", e))
    win.ref.on("closed", () => this.unregister(win))
    await win.load()
    log.debug(`window registered:`, {id: win.id, name: win.name})
    return win
  }

  private unregister(win: ZuiWindow) {
    delete this.windows[win.id]
    log.debug(`window unregistered:`, {id: win.id, name: win.name})
  }

  private getNextDimensFor(name: WindowName) {
    const lastWin = last<ZuiWindow>(this.all.filter((w) => w.name === name))
    if (!lastWin) return undefined
    const prev = lastWin.ref.getBounds()
    const bounds = screen.getDisplayNearestPoint({x: prev.x, y: prev.y})
    return stack(prev, bounds.workArea, 25)
  }
}
