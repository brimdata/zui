import {search} from "src/js/flows/search/mod"
import querySearch from "src/app/query-home/flows/search"
import {zed} from "@brimdata/zealot"
import {Correlation} from "../models/Correlation"
import {getCorrelationQuery} from "./get-correlation-query"
import {featureIsEnabled} from "../../../app/core/feature-flag"
import {BrimQuery} from "../../../app/query-home/utils/brim-query"
import Current from "src/js/state/Current"

function findConn(records) {
  return records.find((r) => r.try("_path")?.toString() === "conn")
}

const legacyFetchCorrelation =
  (record: zed.Record, id = "RELATED_EVENTS") =>
  async (dispatch) => {
    const query = getCorrelationQuery(record)
    const {uid, cid} = new Correlation(record).getIds()
    const run = () => dispatch(search({query, id})).then((r) => r.zed())

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

export const fetchCorrelation = (record: zed.Record, id = "RELATED_EVENTS") => {
  if (!featureIsEnabled("query-flow")) return legacyFetchCorrelation(record, id)
  return async (dispatch, getState) => {
    const query = getCorrelationQuery(record)
    const {uid, cid} = new Correlation(record).getIds()
    const run = () => {
      const poolId = Current.getQueryPool(getState())?.id
      const q = new BrimQuery({
        id: "",
        name: "",
        value: query,
        pins: {from: poolId, filters: []},
      })
      return dispatch(querySearch({query: q, id})).then((r) => r.zed())
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
