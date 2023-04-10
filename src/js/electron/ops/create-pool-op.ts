import {CreatePoolOpts} from "@brimdata/zed-js"
import {createOperation} from "../operations"
import Lakes from "src/js/state/Lakes"
import createLake from "src/js/models/lake"
import {Client} from "@brimdata/zed-node"
import {getAuthToken} from "src/js/api/core/get-zealot"

export const createPoolOp = createOperation(
  "createPoolOp",
  async (
    {main},
    lakeId: string,
    name: string,
    opts: Partial<CreatePoolOpts>
  ) => {
    const lakeData = Lakes.id(lakeId)(main.store.getState())
    const lake = createLake(lakeData)
    const auth = await main.dispatch(getAuthToken(lake))
    const client = new Client(lake.getAddress(), {auth})
    debugger
    const {pool} = await client.createPool(name, opts)
    return pool.id
  }
)

export type CreatePoolOp = typeof createPoolOp
