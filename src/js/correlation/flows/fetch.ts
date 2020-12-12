import {zng} from "../../../../zealot/dist"
import {BrimSearch, search} from "../../flows/search/mod"
import * as zql from "../../searches/programs"
import {Correlation} from "../models/Correlation"

const id = "RELATED_EVENTS"
export const fetchCorrelation = (record: zng.Record) => async (dispatch) => {
  const {uid, cid} = new Correlation(record).getIds()

  if (cid && uid) {
    return dispatch(getFromConn(record))
  } else if (uid) {
    const records = await dispatch(getFromUid(uid))
    const conn = findConn(records)
    if (conn && conn.has("community_id")) return dispatch(getFromConn(conn))
    else return records
  } else if (cid) {
    return dispatch(getFromCommunityId(cid))
  } else {
    return []
  }
}

function findConn(records) {
  return records.find((r) => r.try("_path")?.toString() === "conn")
}

function getFromConn(conn: zng.Record) {
  return (dispatch) => {
    const query = zql.connCorrelation(conn)
    return collect(dispatch(search({query, id})))
  }
}
function getFromUid(uid: string) {
  return (dispatch) => {
    const query = zql.uidCorrelation(uid)
    return collect(dispatch(search({query, id})))
  }
}

function getFromCommunityId(uid: string) {
  return (dispatch) => {
    const query = zql.cidCorrelation(uid)
    return collect(dispatch(search({query, id})))
  }
}

const collect = ({response, promise}: BrimSearch) => {
  let records: zng.Record[] = []
  response.chan(0, (r) => (records = r))
  return promise.then(() => records)
}
