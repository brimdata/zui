import {createOperation} from "src/core/operations"
import {deriveName} from "src/domain/pools/utils"
import * as zui from "src/zui"

export const quickLoad = createOperation(
  "loaders.quickLoad",
  async (ctx, files: string[]) => {
    if (files.length === 0) {
      throw new Error("No files provided")
    }

    let pool
    try {
      const poolNames = zui.pools.all.map((p) => p.name)
      const name = deriveName(files, poolNames)
      pool = await zui.pools.create(name)
      await zui.pools.load({
        windowId: zui.window.id,
        lakeId: zui.window.lakeId,
        poolId: pool.id,
        branch: "main",
        files,
        shaper: "*",
        author: "Zui",
        body: "Quick load files",
      })
      zui.window.query({
        pins: [{type: "from", value: name}],
        value: "",
      })
      return {poolId: pool.id, name}
    } catch (e) {
      if (pool) await zui.pools.delete(pool.id)
      throw e
    }
  }
)
