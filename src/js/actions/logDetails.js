import {getCurrentSpaceName} from "../reducers/spaces"
import {getTimeWindow} from "../reducers/timeWindow"
import {showRightSidebar} from "./view"
import {discoverDescriptors} from "./descriptors"

export const viewLogDetail = ({tuple, descriptor}) => ({
  type: "LOG_DETAIL_VIEW",
  tuple,
  descriptor
})

export const backLogDetail = () => ({
  type: "LOG_DETAIL_BACK"
})

export const forwardLogDetail = () => ({
  type: "LOG_DETAIL_FORWARD"
})

const receiveCorrelatedLogs = (uid, tuples) => ({
  type: "CORRELATED_LOGS_RECEIVE",
  uid,
  tuples
})

const requestCorrelatedLogs = uid => ({
  type: "CORRELATED_LOGS_REQUEST",
  uid
})

export const errorCorrelatedLogs = (uid, error) => ({
  type: "CORRELATED_LOGS_ERROR",
  uid,
  error
})

export const fetchCorrelatedLogs = uid => (dispatch, getState, api) => {
  const state = getState()
  const timeWindow = getTimeWindow(state)
  const space = getCurrentSpaceName(state)
  const string = `${uid} | head 500`

  dispatch(requestCorrelatedLogs(uid))
  api
    .search({
      space,
      string,
      timeWindow
    })
    .channel(0, ({type, results}) => {
      if (type === "SearchResult") {
        const {tuples} = results
        dispatch(receiveCorrelatedLogs(uid, tuples))
        dispatch(discoverDescriptors(tuples))
        dispatch(showRightSidebar())
      }
    })
    .error(e => dispatch(errorCorrelatedLogs(uid, e)))
}
