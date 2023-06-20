import {updateSettings} from "./operations"

export class PoolsApi {
  configure(poolId: string) {
    return new PoolConfiguration(poolId)
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
