import {createOperation} from "src/core/operations"
import {ResponseFormat} from "@brimdata/zed-js"
import fs from "fs"
import {pipeline} from "stream"
import util from "util"
import {lake} from "src/zui"
import {clipboard} from "electron"
import {addLoad} from "./utils"
import { debug } from "src/core/log"

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

export const copyToClipboard = createOperation(
  "results.copyToClipboard",
  async (ctx, query: string, format: ResponseFormat) => {
    const res = await lake.query(query, {
      format,
      controlMessages: false,
      timeout: Infinity,
    })
    const result = await res.resp.text()
    clipboard.writeText(result)
  }
)

export const exportToPool = createOperation(
  "results.exportToPool",
  async (ctx, query: string, poolId) => {
    if (!poolId) throw new Error("Argument missing: poolId")
    if (!query) throw new Error("Argument missing: query")
    const loadQuery = addLoad(query, poolId)
    debug(loadQuery)
    const res = await lake.query(loadQuery)
    const result = await res.js()
    console.log(result)
  }
)
