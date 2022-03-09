import {ResponseFormat} from "@brimdata/zealot"
import fs from "fs"
import {pipeline} from "stream"
import util from "util"
import brim from "../brim"
import Columns from "../state/Columns"
import Current from "../state/Current"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"
import {annotateQuery} from "./search/mod"
import {featureIsEnabled} from "../../app/core/feature-flag"

const streamPipeline = util.promisify(pipeline)

function cutColumns(program, columns) {
  if (columns.allVisible()) {
    return program
  } else {
    const names = columns.getVisible().map((c) => c.name)
    return brim
      .program(program)
      .cut(...names)
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
): Thunk<Promise<string>> => async (dispatch, getState): Promise<string> => {
  const zealot = await dispatch(getZealot(undefined, "node"))
  const columns = Columns.getCurrentTableColumns(getState())
  const baseProgram = SearchBar.getSearchProgram(getState())
  const program = prepareProgram(format, baseProgram, columns)

  let poolId = Current.getPoolId(getState())
  let from = null
  let to = null
  if (featureIsEnabled("query-flow")) {
    poolId = Current.getQuery(getState()).getFromPin()
  } else {
    const span = Tab.getSpan(getState())
    if (span) {
      const dates = span.map(brim.time).map((t) => t.toDate())
      from = dates[0]
      to = dates[1]
    }
  }

  const query = annotateQuery(program, {from, to, poolId})
  const res = await zealot.query(query, {
    format,
    controlMessages: false
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
