import {BrowserWindow, screen} from "electron"
import log from "electron-log"
import {last} from "lodash"
import brim from "src/js/brim"
import ipc from "../ipc"
import sendTo from "../ipc/sendTo"
import {NewTabSearchParams} from "../ipc/windows/messages"
import {dimensFromSizePosition, stack} from "../window/dimens"
import {SearchWindow} from "../window/SearchWindow"
import {SessionState} from "./formatSessionState"
import tron from "./index"
import {WindowParams} from "./window"

export type WindowName = "search" | "about" | "detail" | "hidden"

export type WindowsState = {
  [key: string]: BrimWindow
}

export interface SerializedWindow {
  id: string
  name: WindowName
  position: [number, number]
  size: [number, number]
  lastFocused: number
  state: any
}

export interface BrimWindow {
  ref: BrowserWindow
  name: WindowName
  id: string
  lastFocused: number
  initialState: any
  serialize: () => Promise<SerializedWindow>
  confirmClose: () => Promise<boolean>
  prepareClose: () => Promise<void>
  close: () => void
}

export class WindowManager {
  private windows: WindowsState = {}

  constructor(private session?: SessionState | null | undefined) {}

  async init() {
    if (!this.session || (this.session && this.session.order.length === 0)) {
      await this.openWindow("search")
    } else {
      for (const id of this.session.order) {
        const {name, size, position, state} = this.session.windows[id]
        await this.openWindow(name, {size, position, id}, state)
      }
    }

    // hidden renderer/window is never persisted, so always open it. To aid
    // tests we always open it at the end
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
    return Promise.all(
      this.getAll()
        .filter((w) => w.name === "search")
        .map((w: BrimWindow) => w.serialize())
    )
  }

  confirmQuit(): Promise<boolean> {
    return Promise.all(
      this.getAll().map(async (w: BrimWindow) => {
        return w.confirmClose()
      })
    )
      .then((oks) => {
        return oks.every((ok) => ok)
      })
      .catch((e) => {
        log.error(e)
        return true
      })
  }

  prepareQuit(): Promise<void[]> {
    return Promise.all(this.getAll().map((w: BrimWindow) => w.prepareClose()))
  }

  quit() {
    this.getAll().forEach((w: BrimWindow) => w.close())
  }

  getAll(): BrimWindow[] {
    return Object.values(this.windows).sort(
      (a, b) => a.lastFocused - b.lastFocused
    )
  }

  getVisible(): BrimWindow[] {
    return Object.values(this.windows)
      .sort((a, b) => a.lastFocused - b.lastFocused)
      .filter((w) => w.name !== "hidden")
  }

  getHidden(): BrimWindow[] {
    return Object.values(this.windows)
      .sort((a, b) => a.lastFocused - b.lastFocused)
      .filter((w) => w.name === "hidden")
  }

  count(): number {
    return Object.keys(this.windows).length
  }

  getWindow(id: string): BrimWindow {
    return this.windows[id]
  }

  async openSearchTab(searchParams: NewTabSearchParams) {
    let isNewWin = true
    const existingWin = this.getAll()
      .sort((a, b) => b.lastFocused - a.lastFocused)
      .find((w) => w.name === "search")
    if (existingWin) {
      isNewWin = false
      sendTo(
        existingWin.ref.webContents,
        ipc.windows.newSearchTab({...searchParams, isNewWin})
      )
      existingWin.ref.focus()
      return
    }

    const {href} = searchParams
    const win = await this.openWindow("search", {query: {href}})
    win.ref.webContents.once("did-finish-load", () => {
      sendTo(
        win.ref.webContents,
        ipc.windows.newSearchTab({...searchParams, isNewWin})
      )
    })
  }

  async openWindow(
    name: WindowName,
    winParams: Partial<WindowParams> = {},
    initialState: any = undefined
  ): Promise<BrimWindow> {
    const lastWin = last<BrimWindow>(
      this.getAll().filter((w) => w.name === name)
    )
    const params = defaultWindowParams(winParams, lastWin && lastWin.ref)
    const id = params.id

    const onClosed = (win: BrimWindow) => {
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

    if (name === "search") {
      const {size, position, query, id} = params
      const dimens = dimensFromSizePosition(size, position)
      const win = new SearchWindow(dimens, query, initialState, id)
      await win.load()
      this.windows[id] = win
      win.ref.on("closed", () => {
        onClosed(this.windows[id])
      })
      return win
    } else {
      const ref = await tron.window(name, params)

      ref.on("focus", () => {
        this.windows[id].lastFocused = new Date().getTime()
      })

      ref.on("closed", () => {
        onClosed(this.windows[id])
      })

      const win = {
        id,
        ref,
        name,
        lastFocused: name === "hidden" ? 0 : new Date().getTime(),
        initialState,
        close: () => Promise.resolve(),
        async confirmClose() {
          return true
        },
        async prepareClose() {},
        async serialize() {
          return {
            id,
            name,
            lastFocused: this.lastFocused,
            state: "Fill this in later",
            position: ref.getPosition() as [number, number],
            size: ref.getSize() as [number, number]
          }
        }
      }
      this.windows[id] = win
      return win
    }
  }

  async ensureHiddenRenderer() {
    // only open hidden window if one doesn't already exist
    if (this.getHidden().length) return
    await this.openWindow("hidden")
  }

  openAbout() {
    const about = this.getAll().find((w) => w.name === "about")
    if (about) {
      about.ref.focus()
    } else {
      this.openWindow("about")
    }
  }

  async openPreferences() {
    const win = this.getAll()
      .sort((a, b) => (b.lastFocused || 0) - (a.lastFocused || 0))
      .find((w) => w.name === "search")

    if (win) {
      win.ref.webContents.send("showPreferences")
    } else {
      const newWin = await this.openWindow("search", {})

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
      const newWin = await this.openWindow("search", {})
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
    this.getAll().forEach(({ref: win}: BrimWindow) => {
      const [width, height] = win.getSize()
      const [x, y] = prev
      const next = stack({x, y, width, height}, bounds, 25)
      win.setBounds(next)
      prev = [next.x, next.y]
    })
  }
}

function defaultWindowParams(
  params: Partial<WindowParams>,
  lastWin?: BrowserWindow
): WindowParams {
  let {position, size} = params
  if (lastWin && !position && !size) {
    const prev = lastWin.getBounds()
    const bounds = screen.getDisplayNearestPoint({x: prev.x, y: prev.y})
    const dimens = stack(prev, bounds.workArea, 25)
    position = [dimens.x, dimens.y]
    size = [dimens.width, dimens.height]
  }

  return {
    size,
    position,
    id: brim.randomHash(),
    query: {},
    ...params
  }
}
