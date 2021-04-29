import {
  cidCorrelation,
  connCorrelation,
  uidCorrelation
} from "src/js/searches/programs"
import {zed} from "zealot"
import {Correlation} from "../models/Correlation"

export function getCorrelationQuery(record: zed.Record) {
  const {uid, cid} = new Correlation(record).getIds()
  const ts = record.try<zed.Time>("ts")
  const dur = record.try<zed.Duration>("duration")

  if (cid && uid && ts && ts.isSet() && dur && dur.isSet()) {
    return connCorrelation(
      record.get("uid") as zed.String,
      record.get("community_id") as zed.String,
      ts,
      dur
    )
  } else if (uid) {
    return uidCorrelation(uid)
  } else if (cid) {
    return cidCorrelation(cid)
  } else {
    return null
  }
}
