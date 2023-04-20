import {isEqual} from "lodash"
import * as zed from "@brimdata/zed-js"
import LogDetails from "../state/LogDetails"
import {Thunk} from "../state/types"
import {startTransition} from "react"
import {runCorrelations} from "../api/correlations/run-correlations"
import {emitRowDetailChange} from "../electron/ops"
import Current from "../state/Current"

export const viewLogDetail =
  (record: zed.Record): Thunk =>
  (dispatch, getState) => {
    const current = LogDetails.build(getState())
    if (record && !isEqual(record, current)) {
      emitRowDetailChange(
        Current.getOpEventContext(getState()),
        zed.encode(record)
      )

      startTransition(() => {
        dispatch(LogDetails.push(record))
        dispatch(runCorrelations())
      })
    }
  }
