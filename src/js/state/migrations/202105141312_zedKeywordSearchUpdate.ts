import {parse} from "path"
import {getAllStates} from "src/js/test/helpers/getTestState"

export const UPDATED_V25_DEFAULT_QUERIES = [
  {id: "1", value: "count() by _path | sort -r"},
  {id: "2", value: '_path=="dns" | count() by query | sort -r'},
  {id: "3", value: '_path matches smb* OR _path=="dce_rpc"'},
  {
    id: "4",
    value:
      '_path=="http" | cut id.orig_h, id.resp_h, id.resp_p, method,host, uri | uniq -c'
  },
  {
    id: "5",
    value: '_path=="conn" | cut id.orig_h, id.resp_p, id.resp_h | sort | uniq'
  },
  {
    id: "6",
    value:
      '_path=="conn" | put total_bytes := orig_bytes + resp_bytes | sort -r total_bytes | cut uid, id, orig_bytes, resp_bytes, total_bytes'
  },
  {
    id: "7",
    value:
      "filename!=null | cut _path, tx_hosts, rx_hosts, conn_uids, mime_type, filename, md5, sha1"
  },
  {
    id: "8",
    value: 'method=="POST" | cut ts, uid, id, method, uri, status_code'
  },
  {
    id: "9",
    value:
      '_path=="conn" | put classnet := network_of(id.resp_h) | cut classnet | count() by classnet | sort -r'
  },
  {
    id: "10",
    value:
      'event_type=="alert" | count() by alert.severity,alert.category | sort count'
  },
  {
    id: "11",
    value:
      'event_type=="alert" | alerts := union(alert.category) by src_ip, dest_ip'
  },
  {
    id: "12",
    value:
      'event_type=="alert" | alerts := union(alert.category) by network_of(dest_ip)'
  }
]

export default function zedKeywordSearchUpdate(state: any) {
  for (const s of getAllStates(state)) {
    s.queries.items.forEach((i) => {
      const newQuery = UPDATED_V25_DEFAULT_QUERIES.find((q) => q.id === i.id)
      if (newQuery) {
        i.value = newQuery.value
      }
    })
  }

  return state
}
