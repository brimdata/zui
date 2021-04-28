import {isEqual} from "lodash"
import {fetchCorrelation} from "ppl/detail/flows/fetch"
import {zed} from "zealot"
import ErrorFactory from "../models/ErrorFactory"
import Current from "../state/Current"
import LogDetails from "../state/LogDetails"
import Notice from "../state/Notice"
import {Thunk} from "../state/types"

export const viewLogDetail = (record: zed.Record): Thunk => (
  dispatch,
  getState
) => {
  const current = LogDetails.build(getState())
  if (record && !isEqual(record, current)) {
    dispatch(LogDetails.push(record))

    if (!Current.getSpaceId(getState())) return // It is possible for this code to be called without a space
    dispatch(LogDetails.updateUidStatus("FETCHING"))
    dispatch(fetchCorrelation(record))
      .then((records) => {
        dispatch(LogDetails.updateUidLogs(records))
        dispatch(LogDetails.updateUidStatus("SUCCESS"))
      })
      .catch((e) => dispatch(Notice.set(ErrorFactory.create(e))))
  }
}
