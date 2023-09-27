import {createOperation} from "src/core/operations"
import * as zui from "src/zui"
import {Pool} from "src/app/core/pools/pool"
import {loadFilesOp} from "src/electron/ops/load-files-op"
import {ZedScript} from "src/app/core/models/zed-script"
import {LoadFormData} from "../messages"
import {errorToString} from "src/util/error-to-string"
import {derivePoolName} from "src/domain/pools/utils"

/* Called when the user submits the preview & load form */
export const submit = createOperation(
  "loaders.submit",
  async (ctx, data: LoadFormData) => {
    const [pool, undoPool] = await createPool(data)
    const script = new ZedScript(data.shaper)

    try {
      await loadFilesOp({
        windowId: data.windowId,
        format: data.format,
        poolId: pool.id,
        lakeId: zui.window.lakeId,
        branch: "main",
        files: data.files,
        shaper: script.isEmpty() ? "*" : data.shaper,
        author: data.author,
        body: data.message,
      })
      zui.window.query({
        pins: [{type: "from", value: pool.name}],
        value: "",
      })
      zui.window.showSuccessMessage("Successfully loaded into " + pool.name)
      return null
    } catch (e) {
      await undoPool()
      zui.window.showErrorMessage("Load error " + errorToString(e))
      return e
    }
  }
)

async function createPool(
  data: LoadFormData
): Promise<[Pool, () => Promise<void> | void]> {
  if (data.poolId === "new") {
    const poolNames = zui.pools.all.map((pool) => pool.name)
    const derivedName = await derivePoolName(data.files, poolNames)
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
