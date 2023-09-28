import {createOperation} from "src/core/operations"
import {zq} from "@brimdata/zed-node"
import MultiStream from "multistream"
import {createReadStream} from "fs"
import {LoadFormat, zjson} from "@brimdata/zed-js"

export const preview = createOperation(
  "loaders.preview",
  async (
    {main},
    files: string[],
    shaper: string,
    format: LoadFormat,
    id: string
  ) => {
    if (files.length === 0) {
      return {data: [], error: null, id}
    }

    const input = new MultiStream(files.map((f) => createReadStream(f)))
    const ctl = main.abortables.create(id)
    try {
      const data = await zq({
        query: shaper,
        as: "zjson",
        input,
        i: format,
        signal: ctl.signal,
      })
      return {error: null, data: data as zjson.Obj[], id}
    } catch (e) {
      return {error: e, data: [] as zjson.Obj[], id}
    } finally {
      main.abortables.remove(id)
    }
  }
)

export const abortPreview = createOperation(
  "loaders.abortPreview",
  async ({main}, id: string) => {
    await main.abortables.abort(id)
  }
)
