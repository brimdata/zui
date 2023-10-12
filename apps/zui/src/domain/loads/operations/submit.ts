import {createOperation} from "src/core/operations"
import * as zui from "src/zui"
import {Pool} from "src/app/core/pools/pool"
import {ZedScript} from "src/app/core/models/zed-script"
import {LoadFormData} from "../messages"
import {errorToString} from "src/util/error-to-string"
import {deriveName} from "src/domain/pools/utils"
import {poolPath} from "src/app/router/utils/paths"

/* Called when the user submits the preview & load form */
export const submit = createOperation(
  "loaders.submit",
  async (ctx, data: LoadFormData) => {
    const [pool, undoPool] = await createPool(data)
    const script = new ZedScript(data.shaper)

    // Async so that we can return this and subscribe to updates on the load.
    zui.pools
      .load({
        windowId: data.windowId,
        format: data.format,
        poolId: pool.id,
        lakeId: zui.window.lakeId,
        branch: "main",
        files: data.files,
        shaper: script.isEmpty() ? "*" : data.shaper,
        author: data.author,
        body: data.body,
      })
      .then(() => {
        zui.window.showSuccessMessage("Successfully loaded into " + pool.name)
      })
      .catch((e) => {
        undoPool()
        zui.window.showErrorMessage("Load error " + errorToString(e))
      })

    zui.window.openTab(poolPath(pool.id))
  }
)

async function createPool(
  data: LoadFormData
): Promise<[Pool, () => Promise<void> | void]> {
  if (data.poolId === "new") {
    const poolNames = zui.pools.all.map((pool) => pool.name)
    const derivedName = await deriveName(data.files, poolNames)
    const name = data.name?.trim() || derivedName
    const key = data.key
    const order = data.order
    const pool = await zui.pools.create(name, {key, order})
    const undo = () => zui.pools.delete(pool.id)
    return [pool, undo]
  } else {
    const pool = zui.pools.get(data.poolId)
    return [pool, () => {}]
  }
}
