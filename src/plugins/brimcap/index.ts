import * as zed from "@brimdata/zed-js"
import {findUid} from "../zui-zeek/util"
import {findConnLog} from "../zui-zeek/queries"
import {lake, menus, results, session} from "src/zui"

export function activate() {
  session.on("result-selection-change", async ({row}) => {
    results.expandAll()
    if (row instanceof zed.Record) {
      const uid = findUid(row)
      const pool = session.poolName
      let enabled = false
      if (uid && pool) {
        const query = findConnLog(pool, uid)
        const results = await lake.query(query).then((r) => r.zed())
        const [conn] = results
        if (conn) {
          enabled = true
        }
      }
      menus.get("results-toolbar").update("packets", {enabled})
    }
  })
}
