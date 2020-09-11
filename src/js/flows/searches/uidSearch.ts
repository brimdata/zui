import {isEmpty} from "lodash"

import {Thunk} from "../../state/types"
import {search} from "../search/mod"
import {uidCorrelation} from "../../searches/programs"
import Current from "../../state/Current"
import Log from "../../models/Log"
import LogDetails from "../../state/LogDetails"
import Tab from "../../state/Tab"

const id = "UidTimeline"

export const uidSearch = (log: Log): Thunk => (dispatch, getState) => {
  if (!log) return
  let uid = log.correlationId()
  if (isEmpty(uid)) return

  let state = getState()
  let [from, to] = Tab.getSpanAsDates(state)
  let spaceId = Current.getSpaceId(state)
  let query = uidCorrelation(uid)

  if (!spaceId) return

  const {response, promise} = dispatch(
    search({id, query, from, to, spaceId, target: "events"})
  )
  dispatch(handle(response))
  return promise
}

function handle(response) {
  return (dispatch) => {
    let results = []
    response
      .status((uidStatus) => dispatch(LogDetails.update({uidStatus})))
      .chan(0, (records) => {
        results = results.concat(records)
        dispatch(LogDetails.update({uidLogs: results}))
      })
  }
}
