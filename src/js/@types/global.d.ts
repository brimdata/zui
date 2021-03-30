import Histories from "app/core/models/histories"
import BrimApi from "../initializers/brimApi"
import {FeatureName} from "../state/Feature"
import {BrowserHistory} from "history"

declare global {
  namespace NodeJS {
    interface Global {
      fetch: any
      DOMRectReadOnly: any
      ResizeObserver: any
      SVGElement: any
      windowId: string
      windowName: "search" | "detail" | "about"
      getState: () => any
      feature: (name: FeatureName, value: boolean) => void
      tabHistories: Histories
      windowHistory: BrowserHistory
      navTo: (path: string) => void
      executeCommand: (command: string, ...args: any[]) => boolean
    }

    interface Process {
      on(event: "spectron:mock", listener: MessageListener): this

      on(event: "spectron:clickAppMenuItem", listener: MessageListener): this
    }
  }
}

export default global
