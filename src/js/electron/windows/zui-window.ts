import {enable} from "@electron/remote/main"
import {nanoid} from "@reduxjs/toolkit"
import {BrowserWindow, BrowserWindowConstructorOptions} from "electron"
import {State} from "src/js/state/types"
import {WindowName} from "../windows/types"
import {Dimens, getWindowDimens, pickDimens} from "../windows/dimens"
import {getDisplays} from "./get-displays"
import {SerializedWindow, WindowProps} from "./types"
import {TimedPromise} from "src/util/timed-promise"

export abstract class ZuiWindow {
  abstract name: WindowName
  abstract options: BrowserWindowConstructorOptions

  id: string
  ref: BrowserWindow
  lastFocused: number
  state: State | undefined
  dimens: Dimens | null = null
  persistable = false
  initialized = new TimedPromise(60_000)

  constructor(props: WindowProps = {}) {
    this.id = props.id || nanoid()
    this.state = props.state
    this.dimens = props.dimens
  }
  /**
   * YOU MUST CALL INIT after constructing a window
   *
   * This is because the subclasses provide options that
   * this base class needs access to. The order in which
   * typescript does initialization requires this.
   */
  init() {
    this.ref = new BrowserWindow({
      ...this.options,
      ...getWindowDimens(this.dimens, pickDimens(this.options), getDisplays()),
    })
    this.touch()
    this.ref.on("focus", this.onFocus.bind(this))
    this.ref.on("close", this.onClose.bind(this))
    this.ref.on("focus", this.touch.bind(this))
    enable(this.ref.webContents) // For Remote Module to Work
    return this
  }

  get destroyed() {
    return this.ref.isDestroyed()
  }

  didInitialize() {
    this.initialized.complete()
  }

  whenInitialized() {
    return this.initialized.waitFor()
  }

  beforeLoad() {
    /* Sub-classes can plugin here */
  }

  load() {
    this.beforeLoad()
    return this.ref.loadFile(this.name + ".html", {
      query: {id: this.id},
    })
  }

  touch() {
    this.lastFocused = new Date().getTime()
  }

  onFocus() {
    /* For a sub-class to override */
  }

  onClose(_e: Electron.Event) {
    /* For a sub-class to override */
  }

  close() {
    this.ref.destroy()
  }

  send(channel: string, ...args: any[]) {
    if (this.ref.isDestroyed()) return
    this.ref.webContents.send(channel, ...args)
  }

  serialize(): SerializedWindow {
    return {
      id: this.id,
      name: this.name,
      lastFocused: this.lastFocused,
      position: this.ref.getPosition() as [number, number],
      size: this.ref.getSize() as [number, number],
      state: this.state,
    }
  }
}
