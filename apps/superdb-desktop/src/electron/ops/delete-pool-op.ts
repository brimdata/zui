import {createOperation} from "../../core/operations"
import Loads from "src/js/state/Loads"
import Pools from "src/js/state/Pools"
import {MainObject} from "../../core/main/main-object"

export const deletePoolOp = createOperation(
  "deletePoolOp",
  async ({main}, lakeId: string, poolId: string) => {
    abortLoadsForPool(main, poolId)
    const client = await main.createClient(lakeId)
    await client.deletePool(poolId)
    main.dispatch(Pools.remove({lakeId, poolId}))
  }
)

function abortLoadsForPool(main: MainObject, poolId: string) {
  const loads = Loads.all(main.store.getState()).filter(
    (l) => l.poolId === poolId
  )
  for (let {id} of loads) main.abortables.abort({id})
}

export type DeletePoolOp = typeof deletePoolOp
