import {createOperation} from "src/core/operations"
import {zq} from "src/core/zq"
import {LoadFormat, jsup} from "../../../../../../packages/superdb-types/dist"

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
        as: "jsup",
        i: format,
        signal: ctl.signal,
        file: files,
      })
      return {error: null, data: data as jsup.Obj[], id}
    } catch (e) {
      return {error: e, data: [] as jsup.Obj[], id}
    } finally {
      main.abortables.remove(id)
    }
  }
)

export const abortPreview = createOperation(
  "loads.abortPreview",
  async ({main}, id: string) => {
    await main.abortables.abort(id)
  }
)
