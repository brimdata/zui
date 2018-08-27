import {getCurrentSpace} from "../reducers/spaces"
import * as selectors from "../selectors"
import {showRightSidebar} from "./view"
import {discoverDescriptors} from "./descriptors"
import moment from "moment"
import Ast from "../models/Ast"

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

    api.send(fetchUid(space, uid, timeWindow)).channel(0, payload => {
      if (payload.type === "SearchResult") {
        dispatch(
          logDetailsReceived({
            uid,
            correlatedEvents: payload.results.tuples || []
          })
        )
        dispatch(discoverDescriptors(payload.results.tuples))
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

export function fetchUid(space, uid, timeWindow) {
  const ast = new Ast(`${uid} | head 300`).toJSON()
  return {
    method: "POST",
    path: "/search",
    payload: {
      space: space.name,
      search: ast.search,
      proc: ast.proc,
      from: toTs(timeWindow[0]),
      to: toTs(timeWindow[1])
    }
  }
}

const BRO_TS_FORMAT = "X.SSSSSS"

const toTs = date => moment.utc(date).format(BRO_TS_FORMAT)
