/* @flow */

import type {Payload} from "./types"
import {spliceLogs} from "../actions/logs"
import * as logViewer from "../actions/logViewer"

export default (dispatch: Function, perPage: number) => {
  let count = 0

  return (payload: Payload) => {
    switch (payload.type) {
      case "SearchResult":
        if (count === 0) dispatch(spliceLogs())

        count += payload.results.tuples.length
        break
      case "SearchEnd":
        dispatch(logViewer.setMoreAhead(count >= perPage))
        break
    }
  }
}
