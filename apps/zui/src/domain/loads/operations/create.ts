import {createOperation} from "src/core/operations"
import * as zui from "src/zui"
import {Pool} from "src/models/pool"
import {ZedScript} from "src/models/zed-script"
import {LoadFormData} from "../messages"
import {errorToString} from "src/util/error-to-string"
import {deriveName} from "src/domain/pools/utils"
import {poolPath} from "src/app/router/utils/paths"
import {isAbortError} from "src/util/is-abort-error"

/* Called when the user submits the preview & load form */
export const create = createOperation(
  "loads.create",
  async (ctx, data: LoadFormData) => {
    const pool = await createPool(data)
    // Async so that we can return this and subscribe to updates on the load.
    // Do not wait for the load to finish in this operation.
    zui.pools
      .load({
        windowId: data.windowId,
        format: data.format,
        poolId: pool.id,
        lakeId: zui.window.lakeId,
        branch: "main",
        query: data.query,
        files: data.files,
        shaper: data.shaper,
        author: data.author,
        body: data.body,
      })
      .then(() => {
        zui.window.showSuccessMessage("Successfully loaded into " + pool.name)
      })
      .catch((e) => {
        if (isAbortError(e)) return
        console.log(e)
        zui.window.showErrorMessage("Load error " + errorToString(e))
      })

    zui.window.openTab(poolPath(pool.id))
  }
)

async function createPool(data: LoadFormData): Promise<Pool> {
  if (data.poolId === "new") {
    const poolNames = zui.pools.all.map((pool) => pool.name)
    const derivedName = await deriveName(data.files, poolNames)
    const name = data.name?.trim() || derivedName
    const key = data.key?.trim() || "ts"
    const order = data.order
    return zui.pools.create(name, {key, order})
  } else {
    return zui.pools.get(data.poolId)
  }
}
