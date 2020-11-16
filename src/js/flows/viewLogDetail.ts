import {uidSearch} from "./searches/uidSearch"
import LogDetails from "../state/LogDetails"
import {Thunk} from "../state/types"
import {zng} from "zealot"
import {isEqual} from "lodash"

export const viewLogDetail = (log: zng.Record): Thunk => (
  dispatch,
  getState
) => {
  const current = LogDetails.build(getState())
  if (!isEqual(log, current)) {
    dispatch(uidSearch(log))
    dispatch(LogDetails.push(log))
  }
}
