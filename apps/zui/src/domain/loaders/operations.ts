import {createOperation} from "src/core/operations"
import * as zui from "src/zui"
import {derivePoolName} from "../pools/utils"
import {Pool} from "src/app/core/pools/pool"
import {loadFilesOp} from "src/electron/ops/load-files-op"

export const formAction = createOperation(
  "loaders.formAction",
  async (ctx, data) => {
    console.log(data)

    let pool: Pool

    if (data.poolId === "default") {
      const name = await derivePoolName(
        data.files,
        zui.pools.all.map((p) => p.name)
      )
      pool = await zui.pools.create(name)
    } else if (data.poolId === "new") {
      pool = await zui.pools.create(data.name, {
        key: data.key,
        order: data.order,
      })
      // pool = zui.pools.create({name: data.name, order: data.order, key: data.key})
    } else {
      pool = zui.pools.get(data.poolId)
    }

    await loadFilesOp.run({
      poolId: pool.id,
      lakeId: zui.window.lakeId,
      branch: "main",
      files: data.files,
    })

    // const stream = await zui.zq({files, data.script})
    // await zui.pools.load({id: pool.id, data: stream})
    zui.window.query({
      pins: [{type: "from", value: pool.name}],
      value: "",
    })
  }
)
