import {screen} from "electron"
import log from "electron-log"
import {last} from "lodash"
import {stack} from "../windows/dimens"
import {SessionState} from "../session-state"
import {State} from "src/js/state/types"
import {ZuiWindow} from "../windows/zui-window"
import {SerializedWindow, WindowName, WindowsState} from "../windows/types"
import {createWindow, deserializeWindow} from "./create"

export class WindowManager {
  private windows: WindowsState = {}

  constructor(private session?: SessionState | null | undefined) {}

  async init() {
    if (this.session) {
      const windows = this.session.order
        .map((id) => this.session.windows[id])
        .map(deserializeWindow)
      await Promise.all(windows.map((w) => this.register(w)))
    }
    if (this.count === 0) await this.create("search")
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

  create(name: WindowName) {
    return this.register(
      createWindow(name, {dimens: this.getNextDimensFor(name)})
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
      log.error("No Window Found with id: ", id)
    }
  }

  serialize(): Promise<SerializedWindow[]> {
    return Promise.all(
      this.where((w) => w.persistable).map((w) => w.serialize())
    )
  }

  private async register(win: ZuiWindow) {
    this.windows[win.id] = win
    await win.load()
    win.ref.on("closed", () => this.unregister(win))
    return win
  }

  private unregister(win: ZuiWindow) {
    delete this.windows[win.id]
    // whenever a window is closed in Linux or Windows check if 'hidden' window is last
    // open, and if so tell it to close so the rest of the app will shutdown
    if (
      process.platform !== "darwin" &&
      this.count === 1 &&
      this.all[0].name === "hidden"
    ) {
      this.all[0].ref.close()
    }
  }

  private getNextDimensFor(name: WindowName) {
    const lastWin = last<ZuiWindow>(this.all.filter((w) => w.name === name))
    if (!lastWin) return undefined
    const prev = lastWin.ref.getBounds()
    const bounds = screen.getDisplayNearestPoint({x: prev.x, y: prev.y})
    return stack(prev, bounds.workArea, 25)
  }
}
