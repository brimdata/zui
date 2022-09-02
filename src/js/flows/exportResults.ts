import {ResponseFormat} from "@brimdata/zealot"
import log from "electron-log"
import fs from "fs"
import {pipeline} from "stream"
import util from "util"
import brim from "../brim"
import Columns from "../state/Columns"
import Results from "../state/Results"
import {MAIN_RESULTS} from "../state/Results/types"
import {Thunk} from "../state/types"

const streamPipeline = util.promisify(pipeline)

function cutColumns(program, columns) {
  if (columns.allVisible()) {
    return program
  } else {
    const names = columns.getVisible().map((c) => c.name)
    return brim
      .program(program)
      .quietCut(...names)
      .string()
  }
}

export function prepareProgram(format, program, columns) {
  let p = cutColumns(program, columns)
  if (format === "csv") p += " | fuse"
  return p
}

export default (
    filePath: string,
    format: ResponseFormat
  ): Thunk<Promise<string>> =>
  async (dispatch, getState, {api}): Promise<string> => {
    const zealot = await api.getZealot(undefined, "node")
    const columns = Columns.getCurrentTableColumns(getState())
    const originalQuery = Results.getQuery(MAIN_RESULTS)(getState())
    const exportQuery = prepareProgram(format, originalQuery, columns)
    log.info("Exporting", exportQuery)
    const res = await zealot.query(exportQuery, {
      format,
      controlMessages: false,
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
