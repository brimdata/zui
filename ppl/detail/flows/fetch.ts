import {search} from "src/js/flows/search/mod"
import {zed} from "@brimdata/zealot"
import {Correlation} from "../models/Correlation"
import {getCorrelationQuery} from "./get-correlation-query"

function findConn(records) {
  return records.find((r) => r.try("_path")?.toString() === "conn")
}

export const fetchCorrelation = (
  record: zed.Record,
  id = "RELATED_EVENTS"
) => async (dispatch) => {
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
