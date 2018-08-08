import * as actions from "../actions"
import throttle from "lodash/throttle"

export default function(dispatch) {
  let buffer = []

  const dispatchEvents = throttle(() => {
    if (buffer.lenth == 0) return
    dispatch(actions.mainSearchEvents(buffer))
    dispatch(actions.discoverSchemas(buffer))
    buffer = []
  }, 200)

  return payload => {
    if (payload.type === "SearchResult") {
      const tuples = payload.results.tuples
      if (tuples.length) {
        buffer = [...buffer, ...tuples]
        dispatchEvents()
      }
    }
  }
}
