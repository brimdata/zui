import zedScript from "src/js/zed-script"
import {findCid, whenSuricata} from "./util"
import {correlations, session} from "src/zui"
import {SURICATA_CONNS, SURICATA_ALERTS} from "./ids"

export function activateSuricataCorrelations() {
  correlations.create(SURICATA_CONNS, {
    when: whenSuricata,
    query: () => {
      debugger
      return zedScript`
        from ${session.poolName} 
        | _path=="conn"
        | community_id==${findCid(session.selectedRow)} 
        | sort ts`
    },
  })

  correlations.create(SURICATA_ALERTS, {
    when: whenSuricata,
    query: () => {
      return zedScript`
        from ${session.poolName} 
        | event_type=="alert" 
        | community_id==${findCid(session.selectedRow)} 
        | sort ts
        `
    },
  })
}
