import {EventEmitter} from "events"
import {IngestParams} from "src/js/models/ingest/getParams"
import {remove} from "lodash"

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
}
