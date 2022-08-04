import {EventEmitter} from "events"
import {IngestParams} from "src/js/brim/ingest/getParams"
import {remove} from "lodash"

type Cleanup = () => any

interface Loader {
  match: string
  load: (
    params: IngestParams & {poolId: string; branch: string},
    onProgress: (value: number | null) => void,
    onWarning: (warning: string) => void,
    onDetailUpdate: () => Promise<void>,
    signal?: AbortSignal
  ) => Promise<void>
  unload?: (params: IngestParams) => Promise<void>
}

export class LoadersApi {
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
