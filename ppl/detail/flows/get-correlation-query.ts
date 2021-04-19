import {
  cidCorrelation,
  connCorrelation,
  uidCorrelation
} from "src/js/searches/programs"
import {ZedRecord, ZedPrimitive} from "zealot/zed/data-types"
import {Correlation} from "../models/Correlation"

export function getCorrelationQuery(record: ZedRecord) {
  const {uid, cid} = new Correlation(record).getIds()

  if (cid && uid && record.has("ts") && record.has("duration")) {
    return connCorrelation(
      record.get("uid") as ZedPrimitive,
      record.get("community_id") as ZedPrimitive,
      record.get("ts") as ZedPrimitive,
      record.get("duration") as ZedPrimitive
    )
  } else if (uid) {
    return uidCorrelation(uid)
  } else if (cid) {
    return cidCorrelation(cid)
  } else {
    return null
  }
}
