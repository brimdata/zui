import {Thunk} from "../state/types"
import Current from "../state/Current"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import {getZealot} from "./getZealot"

type ReturnValue = {
  search: {
    method: string
    path: string
    body: string
  }
  program: string
  host: string
}

export const inspectSearch = (): Thunk<ReturnValue> => (dispatch, getState) => {
  const zealot = dispatch(getZealot())
  const program = SearchBar.getSearchProgram(getState())
  const [from, to] = Tab.getSpan(getState())
  const poolId = Current.getPoolId(getState())
  const host = Tab.workspaceUrl(getState())
  let search

  try {
    search = zealot.inspect.search(program, {from, to, poolId})
  } catch (_) {
    // Parsing error
  }

  return {search, program, host}
}
