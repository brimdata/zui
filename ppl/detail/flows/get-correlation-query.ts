import {
  cidCorrelation,
  connCorrelation,
  uidCorrelation
} from "src/js/searches/programs"
import {zed} from "zealot"
import {Correlation} from "../models/Correlation"

export function getCorrelationQuery(record: zed.Record) {
  const {uid, cid} = new Correlation(record).getIds()

  if (cid && uid && record.has("ts") && record.has("duration")) {
    return connCorrelation(
      record.get("uid") as zed.String,
      record.get("community_id") as zed.String,
      record.get("ts") as zed.Time,
      record.get("duration") as zed.Float64
    )
  } else if (uid) {
    return uidCorrelation(uid)
  } else if (cid) {
    return cidCorrelation(cid)
  } else {
    return null
  }
}
