import {enable} from "@electron/remote/main"
import {nanoid} from "@reduxjs/toolkit"
import {BrowserWindow, BrowserWindowConstructorOptions} from "electron"
import {State} from "src/js/state/types"
import {WindowName} from "../windows/types"
import {Dimens, getWindowDimens, pickDimens} from "../windows/dimens"
import {getDisplays} from "./get-displays"
import {SerializedWindow, WindowProps} from "./types"

export abstract class ZuiWindow {
  abstract name: WindowName
  abstract options: BrowserWindowConstructorOptions

  id: string
  ref: BrowserWindow
  lastFocused: number
  state: State | undefined
  dimens: Dimens | null = null
  persistable = true

  constructor(props: WindowProps = {}) {
    this.id = props.id || nanoid()
    this.state = props.state
    this.dimens = props.dimens
  }

  beforeLoad() {
    /* Sub-classes can plugin here */
  }

  load() {
    this.ref = new BrowserWindow({
      ...this.options,
      ...getWindowDimens(this.dimens, pickDimens(this.options), getDisplays()),
    })
    this.touch()
    this.ref.on("focus", this.onFocus.bind(this))
    this.ref.on("close", this.onClose.bind(this))
    enable(this.ref.webContents) // For Remote Module to Work
    this.beforeLoad()
    return this.ref.loadFile(this.name + ".html", {
      query: {id: this.id},
    })
  }

  touch() {
    this.lastFocused = new Date().getTime()
  }

  onFocus() {
    this.touch()
  }

  onClose(_e: Electron.Event) {
    /* For a sub-class to override */
  }

  close() {
    this.ref.destroy()
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
