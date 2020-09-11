declare global {
  namespace NodeJS {
    interface Global {
      fetch: any
      DOMRectReadOnly: any
      ResizeObserver: any
      SVGElement: any
      windowId: string
      getState: () => any
    }

    interface Process {
      on(event: "spectron:mock", listener: MessageListener): this
      on(event: "spectron:clickAppMenuItem", listener: MessageListener): this
    }
  }
}

export default global
