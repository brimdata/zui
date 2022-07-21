import BrimApi from "src/js/api"
import zql from "src/js/zql"
import {findCid, whenSuricata} from "./util"

export const SURICATA_CONNS = "zui-suricata/related-conns"
export const SURICATA_ALERTS = "zui-suricata/related-alerts"

const relatedConns = {
  id: SURICATA_CONNS,
  when: whenSuricata,
  query: (api: BrimApi) => {
    return zql`
        from ${api.current.poolName} 
        | _path=="conn"
        | community_id==${findCid(api.current.value)} 
        | sort ts`
  },
}

const relatedAlerts = {
  id: SURICATA_ALERTS,
  when: whenSuricata,
  query: (api: BrimApi) => {
    return zql`
        from ${api.current.poolName} 
        | event_type=="alert" 
        | community_id==${findCid(api.current.value)} 
        | sort ts
        `
  },
}

export function activate(api: BrimApi) {
  api.correlations.add(relatedConns)
  api.correlations.add(relatedAlerts)
}

export function deactivate(api: BrimApi) {
  api.correlations.remove(relatedConns.id)
  api.correlations.remove(relatedAlerts.id)
}
