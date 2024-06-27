import EventEmitter from "events"

type EventMap = {[name: string]: (...args: any[]) => void}

export class TypedEmitter<Events extends EventMap> {
  private emitter = new EventEmitter()

  on<K extends string & keyof Events>(name: K, handler: Events[K]) {
    this.emitter.on(name, handler)
  }

  emit<K extends string & keyof Events>(
    name: K,
    ...args: Parameters<Events[K]>
  ) {
    this.emitter.emit(name, ...args)
  }

  _teardown() {
    this.emitter.removeAllListeners()
  }
}
