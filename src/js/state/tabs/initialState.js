/* @flow */
import brim from "../../brim"
import reducerSearchBar from "../reducers/searchBar"
import searchReducer from "../search/reducer"
import viewerReducer from "../viewer/reducer"

export function initTab() {
  let ret = {
    id: brim.randomHash(),

    // $FlowFixMe
    search: searchReducer(undefined, {type: "INIT"}),
    searchBar: reducerSearchBar(undefined, {type: "INIT"}),
    // $FlowFixMe
    viewer: viewerReducer(undefined, {type: "INIT"})
  }
  return ret
}

export default function() {
  return {active: 0, data: [initTab()]}
}
