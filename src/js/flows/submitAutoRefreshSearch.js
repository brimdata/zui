/* @flow */
import type {Thunk} from "../state/types"
import Search from "../state/Search"
import SearchBar from "../state/SearchBar"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import executeHistogramSearch from "./executeHistogramSearch"

export default function submitAutoRefreshSearch(): Thunk {
  return function(dispatch, getState, {zealot}) {
    const state = getState()
    const prevArgs = Search.getArgs(state)
    if (!dispatch(SearchBar.validate())) return Promise.reject()

    const tabId = Tabs.getActive(state)
    const args = Search.getArgs(state)
    const spaceId = Tab.getSpaceId(state)
    const {tableProgram, span} = args
    const [from, to] = span

    switch (args.type) {
      case "analytics":
      case "zoom":
        break
      default:
        dispatch(executeHistogramSearch(tabId, args, prevArgs))
    }

    zealot.search(tableProgram, {from, to, spaceId}).then((stream) => {
      stream.flatRecords().then((records) => {
        dispatch(Viewer.setRecords(tabId, records))
      })
    })
  }
}
