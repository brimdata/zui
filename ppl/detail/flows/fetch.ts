import {zng} from "zealot"
import {search} from "src/js/flows/search/mod"
import {Correlation} from "../models/Correlation"
import {getCorrelationQuery} from "./getCorrelationQuery"

const id = "RELATED_EVENTS"

function findConn(records) {
  return records.find((r) => r.try("_path")?.toString() === "conn")
}

const collect = ({response, promise}) => {
  let records: zng.Record[] = []
  response.chan(0, (r) => (records = r))
  return promise.then(() => records)
}

export const fetchCorrelation = (record: zng.Record) => async (dispatch) => {
  const query = getCorrelationQuery(record)
  const {uid, cid} = new Correlation(record).getIds()

  const run = () => collect(dispatch(search({query, id})))

  if (!uid && !cid) return []
  if (cid && uid) return run()
  if (cid) return run()

  // If there is only a uid and not a cid
  const records = await run()
  const conn = findConn(records)
  if (conn && conn.has("community_id")) return dispatch(fetchCorrelation(conn))
  else return records
}
