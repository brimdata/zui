import {BrowserWindow, screen} from "electron"
import log from "electron-log"
import {last} from "lodash"
import {NewTabSearchParams} from "../ipc/windows/messages"
import {stack} from "../windows/dimens"
import {SessionState} from "../session-state"
import {State} from "src/js/state/types"
import {ZuiWindow} from "../windows/zui-window"
import {HiddenWindow} from "../windows/hidden-window"
import {SearchWindow} from "../windows/search-window"
import {AboutWindow} from "../windows/about-window"
import {DetailWindow} from "../windows/detail-window"
import {SerializedWindow} from "../windows/types"
import {constructWindow} from "../windows/construct"

export type WindowName = "search" | "about" | "detail" | "hidden"

export type WindowsState = {
  [key: string]: ZuiWindow
}

export class WindowManager {
  private windows: WindowsState = {}

  constructor(private session?: SessionState | null | undefined) {}

  async init() {
    if (this.session) {
      const windows = this.session.order
        .map((id) => this.session.windows[id])
        .map(constructWindow)
      await Promise.all(windows.map((w) => this.addWindow(w)))
    }
    if (this.count() === 0) await this.openSearchWindow()
    await this.ensureHiddenRenderer()
  }

  whenAllClosed() {
    return new Promise<void>((resolve) => {
      const checkCount = () => {
        if (this.count() === 0) resolve()
        else setTimeout(checkCount, 0)
      }
      checkCount()
    })
  }

  serialize(): Promise<SerializedWindow[]> {
    return Promise.all(this.persistable.map((w) => w.serialize()))
  }

  async confirmQuit(): Promise<boolean> {
    try {
      const oks = await Promise.all(
        this.searchWindows.map((w) => w.confirmClose())
      )
      return oks.every((ok) => ok)
    } catch (e) {
      log.error(e)
      return true
    }
  }

  prepareQuit(): Promise<void[]> {
    return Promise.all(this.searchWindows.map((w) => w.prepareClose()))
  }

  quit() {
    this.getAll().forEach((w: ZuiWindow) => w.close())
  }

  getAll(): ZuiWindow[] {
    return Object.values(this.windows).sort(
      (a, b) => a.lastFocused - b.lastFocused
    )
  }

  get searchWindows() {
    return this.getAll().filter(
      (w) => w instanceof SearchWindow
    ) as SearchWindow[]
  }

  get persistable() {
    return this.getAll().filter((w) => w.persistable)
  }

  getVisible(): ZuiWindow[] {
    return this.getAll().filter((w) => w.name !== "hidden")
  }

  getHidden(): ZuiWindow[] {
    return this.getAll().filter((w) => w.name === "hidden")
  }

  count(): number {
    return Object.keys(this.windows).length
  }

  getWindow(id: string): ZuiWindow {
    return this.windows[id]
  }

  setWindowState(id: string, state: State) {
    const win = this.getWindow(id)
    if (win) {
      win.state = state
    } else {
      log.error("No Window Found with id: ", id)
    }
  }

  async openSearchTab(_searchParams: NewTabSearchParams) {
    throw new Error("NEED TO RETHINK THIS FUNCTION")
  }

  async addWindow(win: ZuiWindow) {
    this.windows[win.id] = win
    await win.load()
    win.ref.on("closed", () => this.removeWindow(win))
    return win
  }

  removeWindow(win: ZuiWindow) {
    delete this.windows[win.id]
    // whenever a window is closed in Linux or Windows check if 'hidden' window is last
    // open, and if so tell it to close so the rest of the app will shutdown
    if (
      process.platform !== "darwin" &&
      this.count() === 1 &&
      this.getAll()[0].name === "hidden"
    ) {
      this.getAll()[0].ref.close()
    }
  }

  openSearchWindow() {
    return this.addWindow(
      new SearchWindow({dimens: this.getNextDimensFor("search")})
    )
  }

  openHiddenWindow() {
    return this.addWindow(new HiddenWindow())
  }

  openAboutWindow() {
    return this.addWindow(new AboutWindow())
  }

  async openDetailWindow() {
    return this.addWindow(
      new DetailWindow({dimens: this.getNextDimensFor("detail")})
    )
  }

  async ensureHiddenRenderer() {
    if (this.getHidden().length) return
    await this.openHiddenWindow()
  }

  openAbout() {
    const about = this.getAll().find((w) => w.name === "about")
    if (about) {
      about.ref.focus()
    } else {
      this.openAboutWindow()
    }
  }

  async openPreferences() {
    const win = this.getAll()
      .sort((a, b) => (b.lastFocused || 0) - (a.lastFocused || 0))
      .find((w) => w.name === "search")

    if (win) {
      win.ref.webContents.send("showPreferences")
    } else {
      const newWin = await this.openSearchWindow()

      newWin.ref.webContents.once("did-finish-load", () => {
        newWin.ref.webContents.send("showPreferences")
      })
    }
  }

  async openReleaseNotes() {
    const win = this.getAll()
      .sort((a, b) => (b.lastFocused || 0) - (a.lastFocused || 0))
      .find((w) => w.name === "search")

    if (win) {
      win.ref.webContents.send("showReleaseNotes")
    } else {
      const newWin = await this.openSearchWindow()
      newWin.ref.webContents.once("did-finish-load", () => {
        newWin.ref.webContents.send("showReleaseNotes")
      })
    }
  }

  closeWindow() {
    const win = BrowserWindow.getFocusedWindow()
    if (win) win.close()
  }

  moveToCurrentDisplay() {
    const point = screen.getCursorScreenPoint()
    const bounds = screen.getDisplayNearestPoint(point).workArea
    const {x, y} = bounds

    let prev = [x, y]
    this.getAll().forEach(({ref: win}: ZuiWindow) => {
      const [width, height] = win.getSize()
      const [x, y] = prev
      const next = stack({x, y, width, height}, bounds, 25)
      win.setBounds(next)
      prev = [next.x, next.y]
    })
  }

  getNextDimensFor(name: WindowName) {
    const lastWin = last<ZuiWindow>(
      this.getAll().filter((w) => w.name === name)
    )
    if (!lastWin) return undefined
    const prev = lastWin.ref.getBounds()
    const bounds = screen.getDisplayNearestPoint({x: prev.x, y: prev.y})
    return stack(prev, bounds.workArea, 25)
  }
}
