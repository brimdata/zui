import {EventEmitter} from "events"
import {CreatePoolOpts, Pool} from "@brimdata/zed-js"
import {updateSettings} from "./operations"
import Pools from "src/js/state/Pools"
import {select} from "src/core/main/select"
import {window} from "src/zui"
import * as ops from "./operations"

type Events = {
  create: (event: {pool: Pool}) => void
}
export class PoolsApi {
  private emitter = new EventEmitter()

  configure(poolId: string) {
    return new PoolConfiguration(poolId)
  }

  get all() {
    return select((s) => Pools.all(s, window.lakeId))
  }

  get(id: string) {
    return select(Pools.get(window.lakeId, id))
  }

  async create(name: string, opts: Partial<CreatePoolOpts> = {}) {
    const id = await ops.create.run(window.lakeId, name, opts)
    return this.get(id)
  }

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

type ConfigMap = {
  timeField: string
  colorField: string
  colorMap: Record<string, string>
}

class PoolConfiguration {
  constructor(public id: string) {}

  set<K extends keyof ConfigMap>(key: K, value: ConfigMap[K]) {
    updateSettings.run({id: this.id, changes: {[key]: value}})
    return this
  }
}
