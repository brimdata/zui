import {EventEmitter} from "events"
import {remove} from "lodash"
import {IngestParams} from "../brim/ingest/getParams"
import {zed} from "zealot"
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
  load: (
    params: IngestParams & {poolId: string},
    onProgress: (value: number | null) => void,
    onWarning: (warning: string) => void,
    onDetailUpdate: () => Promise<void>
  ) => Promise<void>
  match: string
  unLoad?: (params: IngestParams) => Promise<void>
}

export class LoaderRegistry {
  private loaders: Loader[] = []

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
