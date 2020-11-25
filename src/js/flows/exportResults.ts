import {Thunk} from "../state/types"
import {saveToFile} from "../lib/response"
import Columns from "../state/Columns"
import Current from "../state/Current"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import brim from "../brim"
import {getZealot} from "./getZealot"

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

export default (filePath: string): Thunk => (dispatch, getState) => {
  const zealot = dispatch(getZealot())
  const spaceId = Current.getSpaceId(getState())
  const baseProgram = SearchBar.getSearchProgram(getState())
  const columns = Columns.getCurrentTableColumns(getState())
  const program = cutColumns(baseProgram, columns)
  const [from, to] = Tab.getSpan(getState())
    .map(brim.time)
    .map((t) => t.toDate())

  return zealot
    .search(program, {
      from,
      to,
      spaceId,
      format: "zng",
      controlMessages: false
    })
    .then((resp) => saveToFile(resp.origResp as Response, filePath))
}
