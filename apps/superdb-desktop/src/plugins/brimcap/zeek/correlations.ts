import zedScript from "src/js/zed-script"
import {communityConnFilter, findConnLog, uidFilter} from "./queries"
import {findCommunityConnArgs, findUid, getMd5, hasMd5} from "./util"
import {correlations, lake, session} from "src/zui"
import {
  MD5_CORRELATION,
  TX_HOSTS_CORRELATION,
  RX_HOSTS_CORRELATION,
  FILENAME_CORRELATION,
  UID_CORRELATION,
} from "./ids"
import * as zed from "../../../../../../packages/superdb-types/dist"

export function activateZeekCorrelations() {
  correlations.create(MD5_CORRELATION, {
    when: hasMd5,
    query: () => {
      return zedScript`
        from ${session.poolName}
        | md5==${getMd5()}
        | count() by md5
        | sort -r
        | head 5`
    },
  })

  correlations.create(TX_HOSTS_CORRELATION, {
    when: hasMd5,
    query: () => {
      return zedScript`
        from ${session.poolName}
        | md5==${getMd5()}
        | count() by tx_host := (is_orig ? id.orig_h : id.resp_h)
        | sort -r
        | head 5`
    },
  })

  correlations.create(RX_HOSTS_CORRELATION, {
    when: hasMd5,
    query: () => {
      return zedScript`
          from ${session.poolName}
          | md5==${getMd5()}
          | count() by rx_host := (is_orig ? id.resp_h : id.orig_h)
          | sort -r
          | head 5`
    },
  })

  correlations.create(FILENAME_CORRELATION, {
    when: hasMd5,
    query: () => {
      return zedScript`
          from ${session.poolName}
          | md5==${getMd5()}
          | count() by filename, mime_type
          | sort -r
          | head 5`
    },
  })

  correlations.create(UID_CORRELATION, {
    when: () =>
      session.selectedRow instanceof zed.Record &&
      !!session.poolName &&
      !!findUid(session.selectedRow),
    query: async () => {
      const uid = findUid(session.selectedRow)
      const pool = session.poolName
      const res = await lake.query(findConnLog(pool, uid))
      const [conn] = await res.zed()
      const args = findCommunityConnArgs(conn)
      if (args) {
        return zedScript`from ${pool} | ` + communityConnFilter(args)
      } else {
        return zedScript`from ${pool} | ` + uidFilter(uid)
      }
    },
  })
}
