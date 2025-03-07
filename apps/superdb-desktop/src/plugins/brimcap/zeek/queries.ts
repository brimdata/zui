import zedScript from "src/js/zed-script"
import {CommunityConnArgs} from "./util"

export function uidQuery(pool: string, uid: string) {
  return zedScript`from ${pool} | ${uidFilter(uid)}`
}

export function uidFilter(uid: string) {
  return zedScript`uid==${uid} or ${uid} in uids or referenced_file.uid==${uid}`
}

export function communityConnFilter(data: CommunityConnArgs) {
  const {ts, duration, cid, uid} = data
  const tsDate = ts.toDate()
  const dur = duration.asSeconds() + 90 // Add a 1.5 minute buffer for events that get logged late
  const endTsDate = new Date(new Date(tsDate).getTime() + dur * 1000)
  const cidFilter = zedScript`community_id == ${cid} and ts >= ${tsDate} and ts < ${endTsDate}`
  return `${uidFilter(uid)} or (${cidFilter})`
}

export function findConnLog(pool: string, uid: string) {
  return (
    zedScript`
  from ${pool}
  | (` +
    uidFilter(uid) +
    `)
  | _path=="conn" 
  | is(ts, <time>) 
  | is(duration, <duration>) 
  | is(uid, <string>)
  | head 1
  `
  )
}
