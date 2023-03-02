import {ResponseFormat} from "@brimdata/zealot"
import log from "electron-log"
import fs from "fs"
import {pipeline} from "stream"
import util from "util"
import ZuiApi from "../api/zui-api"
import program from "../models/program"
import Results from "../state/Results"
import {MAIN_RESULTS} from "../state/Results/types"
import {Thunk} from "../state/types"

const streamPipeline = util.promisify(pipeline)

function cutColumns(script: string, api: ZuiApi) {
  if (api.table && api.table.hiddenColumnCount > 0) {
    const names = api.table.columns.map((c) => c.columnDef.header as string)
    return program(script)
      .quietCut(...names)
      .string()
  } else {
    return script
  }
}

function prepareProgram(format: string, program: string, api: ZuiApi) {
  let p = cutColumns(program, api)
  if (format === "csv" || format === "arrows") p += " | fuse"
  return p
}

export default (
    filePath: string,
    format: ResponseFormat
  ): Thunk<Promise<string>> =>
  async (dispatch, getState, {api}): Promise<string> => {
    const zealot = await api.getZealot(undefined, "node")
    const originalQuery = Results.getQuery(MAIN_RESULTS)(getState())
    const exportQuery = prepareProgram(format, originalQuery, api)
    log.info("Exporting", exportQuery)
    const res = await zealot.query(exportQuery, {
      format,
      controlMessages: false,
      timeout: Infinity,
    })
    try {
      await streamPipeline(
        res.body as NodeJS.ReadableStream,
        fs.createWriteStream(filePath)
      )
    } catch (e) {
      fs.unlink(filePath, () => {})
      throw e
    }
    return filePath
  }
