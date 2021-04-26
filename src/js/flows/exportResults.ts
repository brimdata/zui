import {Thunk} from "../state/types"
import {saveToFile} from "../lib/response"
import Columns from "../state/Columns"
import Current from "../state/Current"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import brim from "../brim"
import {SearchFormat} from "zealot"
import {getZealot} from "./getZealot"
import SystemTest from "../state/SystemTest"

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

export default (
  filePath: string,
  format: SearchFormat
): Thunk<Promise<string>> => (dispatch, getState) => {
  const zealot = dispatch(getZealot())
  const poolId = Current.getPoolId(getState())
  const baseProgram = SearchBar.getSearchProgram(getState())
  const columns = Columns.getCurrentTableColumns(getState())
  const program = cutColumns(baseProgram, columns)
  const [from, to] = Tab.getSpan(getState())
    .map(brim.time)
    .map((t) => t.toDate())

  dispatch(SystemTest.hook("export-start"))
  return zealot
    .search(program, {
      from,
      to,
      poolId,
      format,
      controlMessages: false
    })
    .then((resp) => saveToFile(resp.origResp as Response, filePath))
    .then((result) => {
      dispatch(SystemTest.hook("export-complete"))
      return result
    })
}
