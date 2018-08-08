import * as actions from "../actions"

export default function(dispatch) {
  return payload => {
    if (payload.type === "SearchResult") {
      dispatch(
        actions.updateCountByTime(
          payload.results.descriptor,
          payload.results.tuples
        )
      )
    }
  }
}
