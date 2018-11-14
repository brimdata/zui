/* @flow */

import * as logViewer from "../actions/logViewer"
import type {Payload} from "./types"

export default (dispatch: Function, perPage: number) => {
  let count = 0

  return (payload: Payload) => {
    switch (payload.type) {
      case "SearchResult":
        count += payload.results.tuples.length
        break
      case "SearchEnd":
        dispatch(logViewer.setMoreAhead(count >= perPage))
        break
    }
  }
}
