import EventEmitter from "events"

export class Renderer extends EventEmitter {
  constructor() {
    super()
    globalThis.addEventListener("beforeunload", () => {
      this.emit("close")
    })
  }
}
