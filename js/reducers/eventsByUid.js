import get from "lodash/get"
import uniqBy from "lodash/uniqBy"

const tsPath = ([_descriptor, path, ts]) => path + ts

export default function eventsByUid(state = {}, action) {
  switch (action.type) {
    case "LOG_DETAILS_RECEIVED":
      var {uid, correlatedEvents} = action
      var currentCorrelatedEvents = get(state, uid, [])

      var events = uniqBy(
        currentCorrelatedEvents.concat(correlatedEvents),
        tsPath
      )

      return {
        ...state,
        [uid]: events
      }
    default:
      return state
  }
}

export const getTuplesByUid = state => state.eventsByUid
