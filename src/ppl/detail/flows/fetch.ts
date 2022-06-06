import querySearch from "src/app/query-home/flows/search"
import {zed} from "@brimdata/zealot"
import {Correlation} from "../models/Correlation"
import {getCorrelationQuery} from "./get-correlation-query"
import Current from "src/js/state/Current"

function findConn(records) {
  return records.find((r) => r.try("_path")?.toString() === "conn")
}

export const fetchCorrelation = (record: zed.Record, id = "RELATED_EVENTS") => {
  return async (dispatch, getState) => {
    const query = getCorrelationQuery(record)
    const {uid, cid} = new Correlation(record).getIds()
    const run = () => {
      const poolId = Current.getQueryPool(getState())?.id
      return dispatch(
        querySearch({query: `from ${poolId} | ${query}`, id})
      ).then((r) => r.zed())
    }

    if (!uid && !cid) return []
    if (cid && uid) return run()
    if (cid) return run()

    // If there is only a uid and not a cid
    const records = await run()
    const conn = findConn(records)
    if (conn && conn.has("community_id"))
      return dispatch(fetchCorrelation(conn, id))
    else return records
  }
}
