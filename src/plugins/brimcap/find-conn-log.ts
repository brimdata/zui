import * as zed from "@brimdata/zed-js"
import {findUid} from "../zui-zeek/util"

export function findConnLog(row: zed.Any) {
  if (!(row instanceof zed.Record)) return null
  const uid = findUid(row)
  if (!uid) return null
  //   const pool = this.api.current.poolName
  //     if (!pool || !uid) return null
  //     const res = await this.api.query(findConnLog(pool, uid), {
  //       id: `brimcap/try-conn-${queryId}`,
  //     })
  //     const [conn] = await res.zed()
  //     return conn as zed.Record | null
}
