import {createOperation} from "src/core/operations"
import {QueryFormat} from "@brimdata/zed-js"
import fs from "fs"
import {pipeline} from "stream"
import util from "util"
import {lake} from "src/zui"

const pipe = util.promisify(pipeline)

export const resultsExport = createOperation(
  "results.export",
  async (ctx, query: string, format: QueryFormat, outPath: string) => {
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
