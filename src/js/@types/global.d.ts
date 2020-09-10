declare global {
  namespace NodeJS {
    interface Global {
      fetch: any
      DOMRectReadOnly: any
      ResizeObserver: any
      SVGElement: any
    }
  }
}

export default global
