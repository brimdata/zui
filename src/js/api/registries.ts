import {EventEmitter} from "events"
import {remove} from "lodash"
import {IngestParams} from "../brim/ingest/getParams"

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
    params: IngestParams & {spaceId: string},
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

  public add(l: Loader): void {
    this.loaders.push(l)
  }

  public remove(l: Loader): void {
    if (this.loaders.includes(l)) remove(this.loaders, (l) => l === l)
  }

  public getMatches(loadType: string): Loader[] {
    return this.loaders.filter((l) => l.match === loadType)
  }
}
