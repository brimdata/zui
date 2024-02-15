import {createOperation} from "src/core/operations"
import {ResponseFormat} from "@brimdata/zed-js"
import fs from "fs"
import {pipeline} from "stream"
import util from "util"
import {lake, pools} from "src/zui"
import {clipboard} from "electron"
import {isAbortError} from "src/util/is-abort-error"

const pipe = util.promisify(pipeline)

export const exportToFile = createOperation(
  "results.exportToFile",
  async (ctx, query: string, format: ResponseFormat, outPath: string) => {
    const res = await lake.query(query, {
      format,
      controlMessages: false,
      timeout: Infinity,
    })
    try {
      await pipe(
        res.body as unknown as NodeJS.ReadableStream,
        fs.createWriteStream(outPath)
      )
    } catch (e) {
      fs.unlink(outPath, () => {})
      throw e
    }
    return outPath
  }
)

const CLIPBOARD_ID = "copy-to-clipboard"
export const copyToClipboard = createOperation(
  "results.copyToClipboard",
  async (ctx, query: string, format: ResponseFormat) => {
    try {
      const ctl = ctx.main.abortables.create(CLIPBOARD_ID)
      const res = await lake.query(query, {
        format,
        controlMessages: false,
        timeout: Infinity,
        signal: ctl.signal,
      })
      const result = await res.resp.text()
      clipboard.writeText(result)
      return "success"
    } catch (e) {
      if (isAbortError(e)) return "aborted"
      throw e
    }
  }
)

export const cancelCopyToClipboard = createOperation(
  "results.cancelCopyToClipboard",
  (ctx) => {
    ctx.main.abortables.abort({id: CLIPBOARD_ID})
  }
)
