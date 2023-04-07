import {isEqual} from "lodash"
import {zed} from "@brimdata/zed-js"
import LogDetails from "../state/LogDetails"
import {Thunk} from "../state/types"
import {startTransition} from "react"
import {runCorrelations} from "../api/correlations/run-correlations"

export const viewLogDetail =
  (record: zed.Record): Thunk =>
  (dispatch, getState) => {
    const current = LogDetails.build(getState())
    if (record && !isEqual(record, current)) {
      startTransition(() => {
        dispatch(LogDetails.push(record))
        dispatch(runCorrelations())
      })
    }
  }
