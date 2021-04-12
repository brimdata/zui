import LogDetails from "../state/LogDetails"
import {Thunk} from "../state/types"
import {zng} from "zealot"
import {isEqual} from "lodash"
import {fetchCorrelation} from "ppl/detail/flows/fetch"
import Notice from "../state/Notice"
import ErrorFactory from "../models/ErrorFactory"
import Current from "../state/Current"

export const viewLogDetail = (record: zng.Record): Thunk => (
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
        /*
        TODO: This correlation fetching and logic should all belong to the brimcap plugin. Since we have not yet
          solidified how we want to give plugins access to the dom to write their own UI, and there are a few
          components that rely on these uid logs (and expect them to be stored in the redux store), then for now
          we can keep this process internal and just expose both the record and uidLogs data together in the same
          brim-command.
        */
      })
      .catch((e) => dispatch(Notice.set(ErrorFactory.create(e))))
  }
}
