import {
  cidCorrelation,
  connCorrelation,
  uidCorrelation
} from "src/js/searches/programs"
import {zng} from "zealot"
import {Correlation} from "../models/Correlation"

export function getCorrelationQuery(record: zng.Record) {
  const {uid, cid} = new Correlation(record).getIds()

  if (cid && uid && record.has("ts") && record.has("duration")) {
    return connCorrelation(
      record.get("uid") as zng.Primitive,
      record.get("community_id") as zng.Primitive,
      record.get("ts") as zng.Primitive,
      record.get("duration") as zng.Primitive
    )
  } else if (uid) {
    return uidCorrelation(uid)
  } else if (cid) {
    return cidCorrelation(cid)
  } else {
    return null
  }
}
