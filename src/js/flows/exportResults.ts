import fs from "fs"
import {pipeline} from "stream"
import util from "util"
import {QueryFormat} from "zealot-old"
import brim from "../brim"
import Columns from "../state/Columns"
import Current from "../state/Current"
import SearchBar from "../state/SearchBar"
import SystemTest from "../state/SystemTest"
import Tab from "../state/Tab"
import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"
import {annotateQuery} from "./search/mod"
import fetch from "node-fetch"

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
  format: QueryFormat
): Thunk<Promise<string>> => async (dispatch, getState): Promise<string> => {
  const zealot = dispatch(getZealot())
  const poolId = Current.getPoolId(getState())
  const baseProgram = SearchBar.getSearchProgram(getState())
  const columns = Columns.getCurrentTableColumns(getState())
  const program = prepareProgram(format, baseProgram, columns)

  const [from, to] = Tab.getSpan(getState())
    .map(brim.time)
    .map((t) => t.toDate())

  dispatch(SystemTest.hook("export-start"))
  const {body, path, method, headers} = zealot.inspect.query(
    annotateQuery(program, {
      from,
      to,
      poolId
    }),
    {
      format,
      controlMessages: false
    }
  )
  const res = await fetch(zealot.url(path), {method, body, headers})
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err)
  }
  try {
    await streamPipeline(res.body, fs.createWriteStream(filePath))
  } catch (e) {
    fs.unlink(filePath, () => {})
    throw e
  }
  dispatch(SystemTest.hook("export-complete"))
  return filePath
}
