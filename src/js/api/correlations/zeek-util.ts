import {zed} from "@brimdata/zealot"

export function findUid(value: zed.Record) {
  const specialUids = {
    files: "conn_uids",
    dhcp: "uids",
  }
  if (value.has("_path")) {
    const path = value.get("_path").toString()
    const name = path in specialUids ? specialUids[path] : "uid"
    if (value.has(name)) {
      const data = value.get(name)
      if (data instanceof zed.Primitive) {
        return data.toString()
      } else if (data instanceof zed.Array || data instanceof zed.Set) {
        const uids = data.items.map((item) => {
          if (item instanceof zed.Primitive) return item.toString()
          else return ""
        })
        return uids.join(" ")
      }
    }
  }
  return null
}

export function findCid(value: zed.Record) {
  return value.has("community_id") ? value.get("community_id").toString() : null
}

export type CommunityConnArgs = {
  uid: string
  cid: string
  ts: zed.Time
  duration: zed.Duration
}

export function findCommunityConnArgs(value: zed.Value): CommunityConnArgs {
  if (value instanceof zed.Record) {
    const ts = value.try("ts")
    const duration = value.try("duration")
    const uid = findUid(value)
    const cid = findCid(value)
    if (value.try("_path").toJS() === "conn") {
      console.log(ts, duration, uid, cid)
    }
    if (
      ts &&
      !ts.isUnset() &&
      zed.isTime(ts) &&
      duration &&
      !duration.isUnset() &&
      zed.isDuration(duration) &&
      uid &&
      cid
    ) {
      return {ts, duration, uid, cid}
    }
  }
  return null
}

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
