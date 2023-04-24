import {createOperation} from "../../../core/operations"
import Pools from "src/js/state/Pools"
import {Pool} from "src/app/core/pools/pool"

export const syncPoolOp = createOperation(
  "syncPoolOp",
  async ({main}, lakeId: string, poolId: string) => {
    const client = await main.createClient(lakeId)
    const [data, stats] = await Promise.all([
      client.getPool(poolId),
      client.getPoolStats(poolId),
    ])
    main.dispatch(Pools.setData({lakeId, data}))
    main.dispatch(Pools.setStats({lakeId, poolId, stats}))
    return new Pool(data, stats)
  }
)

export type syncPoolOp = typeof syncPoolOp
