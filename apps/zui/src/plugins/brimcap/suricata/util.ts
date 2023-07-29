import * as zed from "@brimdata/zed-js"
import {session} from "src/zui"

export function isSuricataAlert(value: zed.Value) {
  if (value instanceof zed.Record) {
    return (
      value.has("event_type", zed.TypeString) &&
      value.has("ts", zed.TypeTime) &&
      value.has("community_id", zed.TypeString)
    )
  }
  return false
}

export function findCid(value: zed.Value) {
  return value instanceof zed.Record && value.has("community_id")
    ? value.get("community_id").toString()
    : null
}

export const whenSuricata = () => {
  return !!(
    isSuricataAlert(session.selectedRow) &&
    findCid(session.selectedRow) &&
    session.poolName
  )
}
