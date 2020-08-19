/* @flow */
import type {Thunk} from "../state/types"
import Current from "../state/Current"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"

export const inspectSearch = (): Thunk => (
  dispatch,
  getState,
  {createZealot}
) => {
  const zealot = createZealot(Current.getConnectionId(getState()))
  const program = SearchBar.getSearchProgram(getState())
  const [from, to] = Tab.getSpan(getState())
  const spaceId = Current.getSpaceId(getState())
  const host = Tab.clusterUrl(getState())
  let search

  try {
    search = zealot.inspect.search(program, {from, to, spaceId})
  } catch (_) {
    // Parsing error
  }

  return {search, program, host}
}
