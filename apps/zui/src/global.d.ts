import Histories from "src/modules/histories"
import {FeatureName} from "../state/Feature"
import {BrowserHistory} from "history"
import {MainArgs} from "./electron/main"
import {AppMeta} from "./electron/meta"
import {EnvProperties} from "src/domain/env/types"

declare global {
  var window: any
  var fetch: any
  var DOMRectReadOnly: any
  var ResizeObserver: any
  var SVGElement: any
  var windowId: string
  var windowName: "search" | "detail" | "about" | "hidden" | "update"
  var feature: (name: FeatureName, value: boolean) => void
  var tabHistories: Histories
  var windowHistory: BrowserHistory
  var navTo: (path: string) => void
  var dev: DevGlobal
  var mainArgs: MainArgs
  var firstMount: boolean
  var appMeta: AppMeta
  var env: EnvProperties
  var zui: {
    on: (name: string, handler: (...args: any[]) => any) => void
    off: (name: string, handler: (...args: any[]) => any) => void
    once: (name: string, handler: (...args: any[]) => any) => void
    invoke: (name: string, ...args: any[]) => any
  }
  var e2eFilePaths: undefined | string[]
}

export default global
