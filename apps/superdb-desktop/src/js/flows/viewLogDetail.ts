import {isEqual} from "lodash"
import * as zed from "../../../../../packages/superdb-types/dist"
import LogDetails from "../state/LogDetails"
import {Thunk} from "../state/types"
import {startTransition} from "react"
import {runCorrelations} from "../../core/correlations"
import Current from "../state/Current"
import {invoke} from "src/core/invoke"

export const viewLogDetail =
  (record: zed.Value): Thunk =>
  (dispatch, getState) => {
    const current = LogDetails.build(getState())
    if (record && !isEqual(record, current)) {
      invoke(
        "emitRowDetailChangeOp",
        Current.getOpEventContext(getState()),
        zed.encode(record)
      )

      startTransition(() => {
        dispatch(LogDetails.push(record))
        dispatch(runCorrelations())
      })
    }
  }
