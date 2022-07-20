import {isEqual} from "lodash"
import {zed} from "@brimdata/zealot"
import LogDetails from "../state/LogDetails"
import {Thunk} from "../state/types"
import {runZeekCorrelation} from "../api/correlations/run-zeek-correlation"
import {runSuricataConnsCorrelation} from "../api/correlations/run-suricata-conns"
import {runSuricataAlertsCorrelation} from "../api/correlations/run-suricata-alerts"
import {runMd5Correlation} from "../api/correlations/run-md5"
import {startTransition} from "react"

export const viewLogDetail =
  (record: zed.Record): Thunk =>
  (dispatch, getState) => {
    const current = LogDetails.build(getState())
    if (record && !isEqual(record, current)) {
      dispatch(LogDetails.push(record))
      startTransition(() => {
        dispatch(runZeekCorrelation())
        dispatch(runSuricataConnsCorrelation())
        dispatch(runSuricataAlertsCorrelation())
        dispatch(runMd5Correlation())
      })
    }
  }
