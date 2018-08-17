import * as actions from "."
import * as outMessages from "../boom/outMessages"
import {getCurrentSpace} from "../reducers/spaces"
import * as selectors from "../selectors"
import {showRightSidebar} from "./view"

export function logDetailsReceived({uid, correlatedEvents}) {
  return {
    type: "LOG_DETAILS_RECEIVED",
    uid,
    correlatedEvents
  }
}

export function logDetailsRequested(uid) {
  return (dispatch, getState, api) => {
    const space = getCurrentSpace(getState())
    const timeWindow = selectors.getTimeWindow(getState())

    api
      .send(outMessages.fetchUid(space, uid, timeWindow))
      .channel(0, payload => {
        if (payload.type === "SearchResult") {
          dispatch(
            logDetailsReceived({
              uid,
              correlatedEvents: payload.results.tuples || []
            })
          )
          dispatch(actions.discoverSchemas(payload.results.tuples))
          dispatch(showRightSidebar())
        }
      })
  }
}

export function logDetailModalRequested(lineId) {
  return {
    type: "LOG_DETAIL_MODAL_REQUESTED",
    lineId
  }
}

export const setLogDetail = ({tuple, descriptor}) => ({
  type: "LOG_DETAIL_SET",
  tuple,
  descriptor
})

export const unsetLogDetail = () => ({type: "LOG_DETAIL_UNSET"})
