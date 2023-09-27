import {createOperation} from "src/core/operations"
import {zq} from "@brimdata/zed-node"
import MultiStream from "multistream"
import {createReadStream} from "fs"
import {LoadFormat, zjson} from "@brimdata/zed-js"
import {errorToString} from "src/util/error-to-string"
import {isAbortError} from "src/util/is-abort-error"

export const preview = createOperation(
  "loaders.preview",
  async (
    {main},
    files: string[],
    shaper: string,
    format: LoadFormat,
    id: string
  ) => {
    await main.abortables.abort(id)
    const input = new MultiStream(files.map((f) => createReadStream(f)))
    if (files.length === 0) return {data: [], error: null}
    const ctl = main.abortables.create(id)
    try {
      const data = await zq({
        query: shaper,
        as: "zjson",
        input,
        i: format,
        signal: ctl.signal,
      })
      return {error: null, data: data as zjson.Obj[]}
    } catch (e) {
      if (isAbortError(e)) {
        return {error: null, data: [] as zjson.Obj[]}
      } else {
        return {error: errorToString(e), data: [] as zjson.Obj[]}
      }
    } finally {
      main.abortables.remove(id)
    }
  }
)

export const abortPreview = createOperation(
  "loaders.abortPreview",
  ({main}, id: string) => {
    main.abortables.abort(id)
  }
)
