import {EventEmitter} from "events"
import * as zed from "../../../../../packages/superdb-types/dist"
import {sendToFocusedWindow} from "src/core/ipc"

type Events = {
  "result-selection-change": (event: {row: zed.Any}) => void
}

export class SessionApi {
  public poolName: string | null = null
  public program: string | null = null
  public selectedRow: zed.Value | null = null
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

  goBack() {
    sendToFocusedWindow("session.goBack")
  }

  goForward() {
    sendToFocusedWindow("session.goForward")
  }

  _teardown() {
    this.emitter.removeAllListeners()
  }
}
