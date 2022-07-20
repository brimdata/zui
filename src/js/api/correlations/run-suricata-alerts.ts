import Current from "src/js/state/Current"
import {Thunk} from "src/js/state/types"
import {findCid, isSuricataAlert} from "./zeek-util"
import {run} from "./run"
import zql from "src/js/zql"

export const SURICATA_ALERTS = "zui/suricata-alerts-correlation"
const id = SURICATA_ALERTS

export const runSuricataAlertsCorrelation =
  (): Thunk =>
  async (dispatch, getState, {api}) => {
    const value = api.results.selectedValue
    if (isSuricataAlert(value)) {
      const tabId = api.current.tabId
      const key = Current.getLocation(getState()).key
      const pool = Current.getQuery(getState()).getPoolName()
      const cid = findCid(value)
      const query = zql`from ${pool} | _path=="conn" community_id==${cid} | sort ts`
      dispatch(run(query, {tabId, key, id}))
    }
  }
