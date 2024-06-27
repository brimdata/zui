import {lake} from "src/zui"
import {findConnLog} from "../zeek/queries"
import * as zed from "@brimdata/zed-js"

export async function queryForConnLog(pool: string, uid: string) {
  const query = findConnLog(pool, uid)
  const results = await lake.query(query).then((r) => r.zed())
  const [conn] = results
  return conn as zed.Record
}
