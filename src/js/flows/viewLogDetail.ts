import {isEqual} from "lodash"
import {zed} from "@brimdata/zealot"
import LogDetails from "../state/LogDetails"
import {Thunk} from "../state/types"
import {runZeekCorrelation} from "../api/correlations/run-zeek-correlation"
import {runSuricataConnsCorrelation} from "../api/correlations/run-suricata-conns"
import {runSuricataAlertsCorrelation} from "../api/correlations/run-suricata-alerts"

export const viewLogDetail =
  (record: zed.Record): Thunk =>
  (dispatch, getState) => {
    const current = LogDetails.build(getState())
    if (record && !isEqual(record, current)) {
      dispatch(LogDetails.push(record))
      dispatch(runZeekCorrelation())
      dispatch(runSuricataConnsCorrelation())
      dispatch(runSuricataAlertsCorrelation())
    }
  }
