import {
  cidCorrelation,
  connCorrelation,
  uidCorrelation
} from "src/js/searches/programs"
import * as zed from "zealot/zed"
import {Correlation} from "../models/Correlation"

export function getCorrelationQuery(record: zed.Record) {
  const {uid, cid} = new Correlation(record).getIds()

  if (cid && uid && record.has("ts") && record.has("duration")) {
    return connCorrelation(
      record.get("uid") as zed.Primitive,
      record.get("community_id") as zed.Primitive,
      record.get("ts") as zed.Primitive,
      record.get("duration") as zed.Primitive
    )
  } else if (uid) {
    return uidCorrelation(uid)
  } else if (cid) {
    return cidCorrelation(cid)
  } else {
    return null
  }
}
