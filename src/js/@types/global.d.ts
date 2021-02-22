import Histories, {MemoryHistory} from "app/core/models/histories"
import {FeatureName} from "../state/Feature"

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
      tabHistory: MemoryHistory
    }

    interface Process {
      on(event: "spectron:mock", listener: MessageListener): this
      on(event: "spectron:clickAppMenuItem", listener: MessageListener): this
    }
  }
}

export default global
