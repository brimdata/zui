import Histories from "app/core/models/histories"
import {FeatureName} from "../state/Feature"
import {BrowserHistory} from "history"

declare global {
  namespace NodeJS {
    interface Global {
      featureFlags: string[]
      fetch: any
      DOMRectReadOnly: any
      ResizeObserver: any
      SVGElement: any
      windowId: string
      windowName: "search" | "detail" | "about" | "hidden"
      feature: (name: FeatureName, value: boolean) => void
      tabHistories: Histories
      windowHistory: BrowserHistory
      navTo: (path: string) => void
      dev: DevGlobal
    }
  }
}

export default global
