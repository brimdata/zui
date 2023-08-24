import {createOperation} from "src/core/operations"
import * as zui from "src/zui"
import {derivePoolName} from "../pools/utils"
import {Pool} from "src/app/core/pools/pool"
import {loadFilesOp} from "src/electron/ops/load-files-op"
import {zq} from "@brimdata/zed-node"
import MultiStream from "multistream"
import {createReadStream} from "fs"
import {zjson} from "@brimdata/zed-js"

export const formAction = createOperation(
  "loaders.formAction",
  async (ctx, data) => {
    let pool: Pool

    if (data.poolId === "new") {
      const poolNames = zui.pools.all.map((pool) => pool.name)
      const derivedName = await derivePoolName(data.files, poolNames)
      const name = data.name.trim() || derivedName
      const key = data.key
      const order = data.order
      pool = await zui.pools.create(name, {key, order})
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

export const zqOperation = createOperation(
  "loaders.previewShaper",
  async (_, files, shaper) => {
    const input = new MultiStream(files.map((f) => createReadStream(f)))
    if (files.length === 0) return {data: [], error: null}
    try {
      const data = await zq({query: shaper, as: "zjson", input})
      return {error: null, data: data as zjson.Obj[]}
    } catch (e) {
      return {error: e, data: []}
    }
  }
)
