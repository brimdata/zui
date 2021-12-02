import {EventEmitter} from "events"
import {remove} from "lodash"
import {IngestParams} from "../brim/ingest/getParams"
import {zed} from "@brimdata/zealot"
import {MenuItemConstructorOptions} from "electron"

type Cleanup = () => any

export class CommandRegistry {
  commandRegistry: EventEmitter

  constructor() {
    this.commandRegistry = new EventEmitter()
  }

  add(command: string, listener: (...args: any[]) => void): Cleanup {
    this.commandRegistry.on(command, listener)

    return () => this.commandRegistry.removeListener(command, listener)
  }

  execute(command: string, ...args: any[]): boolean {
    return this.commandRegistry.emit(command, ...args)
  }

  list(): string[] {
    return this.commandRegistry.eventNames() as string[]
  }
}

interface Loader {
  match: string
  load: (
    params: IngestParams & {poolId: string},
    onProgress: (value: number | null) => void,
    onWarning: (warning: string) => void,
    onDetailUpdate: () => Promise<void>,
    signal?: AbortSignal
  ) => Promise<void>
  unload?: (params: IngestParams) => Promise<void>
}

export class LoaderRegistry {
  private loaders: Loader[] = []
  private emitter = new EventEmitter()

  constructor() {}

  add(l: Loader): void {
    this.loaders.push(l)
  }
  remove(l: Loader): void {
    if (this.loaders.includes(l)) remove(this.loaders, (l) => l === l)
  }
  getMatches(loadType: string): Loader[] {
    return this.loaders.filter((l) => l.match === loadType)
  }
  setAbortHandler(handlerId: string, handler: () => void): Cleanup {
    const listener = (abortRequestId) => {
      if (abortRequestId === handlerId) {
        handler()
      }
    }
    this.emitter.on("request-abort", listener)
    return () => this.emitter.removeListener("request-abort", listener)
  }
  onDidAbort(listener: (...args: any[]) => void): Cleanup {
    this.emitter.on("did-abort", listener)
    return () => this.emitter.removeListener("did-abort", listener)
  }
  requestAbort(handlerId: string): boolean {
    return this.emitter.emit("request-abort", handlerId)
  }
  didAbort(handlerId: string): boolean {
    return this.emitter.emit("did-abort", handlerId)
  }
  async abort(id) {
    this.requestAbort(id)
    await new Promise((res) => {
      this.onDidAbort(res)
    })
  }
}

export type SearchCtxItemBuilder = (data: {
  record: zed.Record
  field: zed.Field
}) => MenuItemConstructorOptions

export type DetailCtxItemBuilder = (data: {
  record: zed.Record
  field: zed.Field
}) => MenuItemConstructorOptions

export class ContextMenuRegistry<T> {
  private registry: T[] = []

  constructor() {}

  add(menuItem: T) {
    this.registry.push(menuItem)
  }

  remove(menuItem: T): void {
    if (this.registry.includes(menuItem)) remove(this.registry, (l) => l === l)
  }

  list() {
    return [...this.registry]
  }
}
