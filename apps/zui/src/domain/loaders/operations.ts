import {createOperation} from "src/core/operations"
import * as zui from "src/zui"
import {derivePoolName} from "../pools/utils"
import {Pool} from "src/app/core/pools/pool"
import {loadFilesOp} from "src/electron/ops/load-files-op"
import {zq} from "@brimdata/zed-node"
import MultiStream from "multistream"
import {createReadStream} from "fs"

export const formAction = createOperation(
  "loaders.formAction",
  async (ctx, data) => {
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
      shaper: data.shaper,
      author: data.author,
      body: data.message,
    })

    // const stream = await zui.zq({files, data.script})
    // await zui.pools.load({id: pool.id, data: stream})
    zui.window.query({
      pins: [{type: "from", value: pool.name}],
      value: "",
    })
  }
)

export const zqOperation = createOperation("zq", async (ctx, files, script) => {
  const input = new MultiStream(files.map((f) => createReadStream(f)))

  if (files.length === 0) return {data: [], error: null}
  try {
    const data = await zq({query: script, as: "zjson", input})
    return {error: null, data}
  } catch (e) {
    return {error: e, data: []}
  }
})
