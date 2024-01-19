import {CreatePoolOpts, Pool} from "@brimdata/zed-js"
import {updateSettings} from "./operations"
import Pools from "src/js/state/Pools"
import {select} from "src/core/main/select"
import {loads, window} from "src/zui"
import * as ops from "./operations"
import {LoadContext} from "src/domain/loads/load-context"
import {syncPoolOp} from "src/electron/ops/sync-pool-op"
import {LoadOptions} from "src/core/loader/types"
import {getMainObject} from "src/core/main"
import {TypedEmitter} from "src/util/typed-emitter"

type Events = {
  create: (event: {pool: Pool}) => void
}

export class PoolsApi extends TypedEmitter<Events> {
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
    const id = await ops.create(window.lakeId, name, opts)
    return this.get(id)
  }

  async delete(id: string) {
    await ops.deletePool(window.lakeId, id)
  }

  async load(opts: LoadOptions) {
    const main = getMainObject()
    const context = new LoadContext(main, opts)
    const loader = await loads.initialize(context)
    try {
      await context.setup()
      await loader.run()
      await waitForPoolStats(context)
      loads.emit("success", context.ref)
    } catch (e) {
      await loader.rollback()
      loads.emit("error", context.ref)
      throw e
    } finally {
      context.teardown()
    }
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
    updateSettings({id: this.id, changes: {[key]: value}})
    return this
  }
}

async function waitForPoolStats(context: LoadContext) {
  let tries = 0
  while (tries < 20) {
    tries++
    const pool = await syncPoolOp(context.lakeId, context.poolId)
    if (pool.hasStats() && pool.size > 0) break
    await new Promise((r) => setTimeout(r, 300))
  }
}
