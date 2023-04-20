import {EventEmitter} from "events"
import * as zed from "@brimdata/zed-js"

type EventMessages = {
  "result-selection-change": (event: {row: zed.Any}) => void
}

type EventMap = Record<string, (...args: any[]) => any>

export class SessionApi<Events extends EventMap> {
  public poolName: string | null = null
  public program: string | null = null
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
}

export const session = new SessionApi<EventMessages>()
