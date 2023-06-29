import {EventEmitter} from "events"
import {Pool} from "@brimdata/zed-js"
import {updateSettings} from "./operations"

type Events = {
  create: (event: {pool: Pool}) => void
}
export class PoolsApi {
  private emitter = new EventEmitter()

  configure(poolId: string) {
    return new PoolConfiguration(poolId)
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
