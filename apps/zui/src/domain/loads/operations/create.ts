import {createOperation} from "src/core/operations"
import * as zui from "src/zui"
import {Pool} from "src/app/core/pools/pool"
import {ZedScript} from "src/app/core/models/zed-script"
import {LoadFormData} from "../messages"
import {errorToString} from "src/util/error-to-string"
import {deriveName} from "src/domain/pools/utils"
import {poolPath} from "src/app/router/utils/paths"
import {isAbortError} from "src/util/is-abort-error"

/* Called when the user submits the preview & load form */
export const submit = createOperation(
  "loads.create",
  async (ctx, data: LoadFormData) => {
    const pool = await createPool(data)
    const script = new ZedScript(data.shaper || "")
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
        if (isAbortError(e)) return
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
    const key = data.key
    const order = data.order
    return zui.pools.create(name, {key, order})
  } else {
    return zui.pools.get(data.poolId)
  }
}
