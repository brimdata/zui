import {Correlation} from "src/js/api/correlations/types"
import zedScript from "src/js/zed-script"
import {communityConnFilter, findConnLog, uidFilter} from "./queries"
import {findCommunityConnArgs, findUid} from "./util"

export const uidCorrelation: Correlation = {
  id: "zui-zeek/uid-correlation",
  when: (api) => !!findUid(api.current.value),
  query: async (api) => {
    const uid = findUid(api.current.value)
    const pool = api.current.poolName
    const res = await api.query(findConnLog(pool, uid), {id: "conn-check"})
    const [conn] = await res.zed()
    const args = findCommunityConnArgs(conn)
    if (args) {
      return zedScript`from ${pool} | ` + communityConnFilter(args)
    } else {
      return zedScript`from ${pool} | ` + uidFilter(uid)
    }
  },
}
