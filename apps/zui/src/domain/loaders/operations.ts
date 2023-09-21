import {createOperation} from "src/core/operations"
import * as zui from "src/zui"
import {derivePoolName} from "../pools/utils"
import {Pool} from "src/app/core/pools/pool"
import {loadFilesOp} from "src/electron/ops/load-files-op"
import {zq} from "@brimdata/zed-node"
import MultiStream from "multistream"
import {createReadStream} from "fs"
import {zjson} from "@brimdata/zed-js"
import {ZedScript} from "src/app/core/models/zed-script"
import {isPcap} from "src/plugins/brimcap/packets/is-pcap"

export const formAction = createOperation(
  "loaders.formAction",
  async (ctx, data) => {
    let pool: Pool

    if (data.poolId === "new") {
      const poolNames = zui.pools.all.map((pool) => pool.name)
      const derivedName = await derivePoolName(data.files, poolNames)
      const name = data.name?.trim() || derivedName
      const key = data.key
      const order = data.order
      pool = await zui.pools.create(name, {key, order})
    } else {
      pool = zui.pools.get(data.poolId)
    }

    const script = new ZedScript(data.shaper)

    await loadFilesOp.run({
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

    // const stream = await zui.zq({files, data.script})
    // await zui.pools.load({id: pool.id, data: stream})
    zui.window.query({
      pins: [{type: "from", value: pool.name}],
      value: "",
    })
    zui.window.showSuccessMessage("Successfully loaded into " + pool.name)
  }
)

export const previewShaper = createOperation(
  "loaders.previewShaper",
  async (_, files, shaper, format) => {
    const input = new MultiStream(files.map((f) => createReadStream(f)))
    if (files.length === 0) return {data: [], error: null}
    try {
      const data = await zq({query: shaper, as: "zjson", input, i: format})
      return {error: null, data: data as zjson.Obj[]}
    } catch (e) {
      return {error: e, data: []}
    }
  }
)

async function getFileType(path: string) {
  if (await isPcap(path)) return {type: "pcap", path}
  else return {type: "text", path}
}

export const getFileTypes = createOperation(
  "loaders.getFileTypes",
  async (_, paths: string[]) => {
    const data = []
    for (const path of paths) data.push(await getFileType(path))
    return data
  }
)
