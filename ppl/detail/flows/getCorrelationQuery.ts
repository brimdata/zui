import {
  cidCorrelation,
  connCorrelation,
  uidCorrelation
} from "src/js/searches/programs"
import {zng} from "zealot"
import {Correlation} from "../models/Correlation"

export function getCorrelationQuery(record: zng.Record) {
  const {uid, cid} = new Correlation(record).getIds()

  if (cid && uid) {
    return connCorrelation(record)
  } else if (uid) {
    return uidCorrelation(uid)
  } else if (cid) {
    return cidCorrelation(cid)
  } else {
    return null
  }
}
