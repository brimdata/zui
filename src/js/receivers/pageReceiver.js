/* @flow */

import * as logViewer from "../actions/logViewer"
import * as mainSearch from "../actions/mainSearch"
import type {Payload} from "./types"

export default (
  dispatch: Function,
  perPage: number,
  spliceIndex: number = 0
) => {
  let count = 0

  return (payload: Payload) => {
    switch (payload.type) {
      case "SearchResult":
        if (count === 0) {
          dispatch(mainSearch.spliceMainSearchEvents(spliceIndex))
        }
        count += payload.results.tuples.length
        break
      case "SearchEnd":
        dispatch(logViewer.setMoreAhead(count >= perPage))
        break
    }
  }
}
