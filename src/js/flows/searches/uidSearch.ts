import {isEmpty} from "lodash"

import {Thunk} from "../../state/types"
import {search} from "../search/mod"
import {uidCorrelation} from "../../searches/programs"
import Current from "../../state/Current"
import LogDetails from "../../state/LogDetails"
import Tab from "../../state/Tab"
import {createZeekLog} from "../../brim/zeekLog"
import {zng} from "zealot"

const id = "UidTimeline"

export const uidSearch = (log: zng.Record): Thunk => (dispatch, getState) => {
  if (!log) return
  const uid = createZeekLog(log).correlationId()
  if (isEmpty(uid)) return

  const state = getState()
  const [from, to] = Tab.getSpanAsDates(state)
  const spaceId = Current.getSpaceId(state)
  const query = uidCorrelation(uid)

  if (!spaceId) return

  const {response, promise} = dispatch(
    search({id, query, from, to, spaceId, target: "events"})
  )
  dispatch(handle(response))
  return promise
}

function handle(response) {
  return (dispatch) => {
    response
      .status((status) => dispatch(LogDetails.updateUidStatus(status)))
      .chan(0, (records) => dispatch(LogDetails.updateUidLogs(records)))
  }
}
