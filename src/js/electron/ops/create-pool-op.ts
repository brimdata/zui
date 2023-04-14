import {CreatePoolOpts} from "@brimdata/zed-js"
import {createOperation} from "../operations"

export const createPoolOp = createOperation(
  "createPoolOp",
  async (
    {main},
    lakeId: string,
    name: string,
    opts: Partial<CreatePoolOpts>
  ) => {
    const client = await main.createClient(lakeId)
    const {pool} = await client.createPool(name, opts)
    return pool.id as string
  }
)

export type CreatePoolOp = typeof createPoolOp
