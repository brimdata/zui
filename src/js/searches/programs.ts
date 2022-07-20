import {zed} from "@brimdata/zealot"
import zql from "../zql"

export function uidFilter(uid: string | zed.Primitive) {
  return zql`uid==${uid} or ${uid} in conn_uids or ${uid} in uids or referenced_file.uid==${uid}`
}

export function cidFilter(cid: string | zed.Primitive) {
  return zql`community_id==${cid}`
}

export const UID_CORRELATION_LIMIT = 100
export function correlationLimit() {
  return `head ${UID_CORRELATION_LIMIT}`
}

export function uidCorrelation(uid: string | zed.Primitive) {
  return `${uidFilter(uid)} | ${correlationLimit()}`
}

export function cidCorrelation(cid: string | zed.Primitive) {
  return `${cidFilter(cid)} | ${correlationLimit()}`
}

export function connCorrelation(
  uid: zed.String,
  cid: zed.String,
  ts: zed.Time,
  duration: zed.Duration
) {
  const tsDate = ts.toDate()
  const dur = duration.asSeconds() + 90 // Add a 1.5 minute buffer for events that get logged late
  const endTsDate = new Date(new Date(tsDate).getTime() + dur * 1000)
  const cidFilter = zql`community_id == ${cid} and ts >= ${tsDate} and ts < ${endTsDate}`
  return `${uidFilter(uid)} or (${cidFilter}) | ${correlationLimit()}`
}
