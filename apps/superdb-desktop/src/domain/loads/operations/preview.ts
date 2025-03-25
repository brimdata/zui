import {createOperation} from "src/core/operations"
import {zq} from "src/core/zq"
import {LoadFormat, zjson} from "../../../../../../packages/superdb-types/dist"

export const preview = createOperation(
  "loads.preview",
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

    const ctl = main.abortables.create(id)
    try {
      const data = await zq({
        query: shaper,
        as: "zjson",
        i: format,
        signal: ctl.signal,
        file: files,
      })
      console.log("Preview Success: " + id, data)
      return {error: null, data: data as zjson.Obj[], id}
    } catch (e) {
      console.log("Preview Error: " + id, e)
      return {error: e, data: [] as zjson.Obj[], id}
    } finally {
      main.abortables.remove(id)
    }
  }
)

export const abortPreview = createOperation(
  "loads.abortPreview",
  async ({main}, id: string) => {
    console.log("Preview Abort: " + id)
    await main.abortables.abort(id)
  }
)
