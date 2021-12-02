import {search} from "src/js/flows/search/mod"
import {zed} from "zealot-old"
import {Correlation} from "../models/Correlation"
import {getCorrelationQuery} from "./get-correlation-query"

function findConn(records) {
  return records.find((r) => r.try("_path")?.toString() === "conn")
}

const collect = ({response, promise}) => {
  let records: zed.Record[] = []
  response.chan(0, ({rows}) => {
    records = rows
  })
  return promise.then(() => records)
}

export const fetchCorrelation = (
  record: zed.Record,
  id = "RELATED_EVENTS"
) => async (dispatch) => {
  const query = getCorrelationQuery(record)
  const {uid, cid} = new Correlation(record).getIds()
  const run = () => collect(dispatch(search({query, id})))

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
