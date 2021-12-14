import EventEmitter from "events"

export class SearchesApi {
  private emitter = new EventEmitter()

  onDidFinish(cb) {
    return this.listenTo("did-finish", cb)
  }

  // Should only be called internally
  emit(name, ...args) {
    this.emitter.emit(name, ...args)
  }

  private listenTo(name, cb) {
    this.emitter.addListener(name, cb)
    return () => this.emitter.removeListener(name, cb)
  }
}
