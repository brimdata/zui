import {nanoid} from "@reduxjs/toolkit"
import {Board} from "src/js/state/Boards"
import {Tile} from "src/js/state/Tiles"

export const initialTiles: Tile[] = [
  {
    id: nanoid(),
    title: "Zeek Log Types (without conn)",
    query: `_path!="conn" _path!="capture_loss" _path!="reporter" | count() by _path | sort -r`,
    layout: {x: 0, y: 0, w: 2, h: 12},
    format: {
      type: "table",
      x: "count"
    }
  },
  {
    id: nanoid(),
    title: "Top DNS Queries",
    query: "_path=dns | count() by query | sort -r | head 10",
    layout: {x: 2, y: 0, w: 2, h: 12},
    format: {type: "table", x: "count"}
  },
  {
    id: nanoid(),
    title: "Top Hosts by Throughput",
    query: `_path=conn | put total_bytes = orig_bytes + resp_bytes | sort -r total_bytes | cut id, orig_bytes, resp_bytes, total_bytes | head 10`,
    layout: {x: 0, y: 0, w: 4, h: 9},
    format: {type: "table", x: "total_bytes"}
  },
  {
    id: nanoid(),
    title: "Files Present",
    query: `filename!=null | cut _path, tx_hosts, rx_hosts, mime_type, filename, md5, sha1 | head 10`,
    layout: {x: 0, y: 0, w: 4, h: 9},
    format: {type: "table"}
  },
  {
    id: nanoid(),
    title: "Top Windows Networking Activity",
    query: `_path=~smb* OR _path=dce_rpc | cut id.orig_h, id.resp_h, named_pipe, endpoint, operation | sort id.orig_h, id.resp_h, named_pipe, endpoint, operation | uniq -c | head 10`,
    layout: {x: 0, y: 0, w: 4, h: 9},
    format: {type: "table"}
  },
  {
    id: nanoid(),
    title: "Top HTTP POST Requests",
    query: `method=POST | cut ts, uid, id, method, uri, status_code | head 10`,
    layout: {x: 0, y: 0, w: 4, h: 9},
    format: {type: "table"}
  },
  {
    id: nanoid(),
    title: "Alert Signature by Severity and Count",
    query: `event_type=alert | count() by alert.severity,alert.signature | sort -r alert.severity, count | head 10`,
    layout: {x: 0, y: 0, w: 2, h: 9},
    format: {type: "table", x: "count"}
  },
  {
    id: nanoid(),
    title: "Top Alerts by Severity",
    query: `event_type=alert | cut src_ip, dest_ip, alert.severity, alert.signature| sort -r alert.severity | uniq -c | head 10`,
    layout: {x: 2, y: 0, w: 2, h: 9},
    format: {type: "table"}
  },
  {
    id: nanoid(),
    title: "Severity 3 Alert Signatures by Source",
    query: `event_type=alert alert.severity=3 | count() by src_ip, alert.signature | sort -r count | head 10`,
    layout: {x: 0, y: 0, w: 2, h: 9},
    format: {type: "table"}
  },
  {
    id: nanoid(),
    title: "Severity 3 Alert Signatures by Destination",
    query: `event_type=alert alert.severity=3 | count() by dest_ip, alert.signature | sort -r count | head 10`,
    layout: {x: 2, y: 0, w: 2, h: 9},
    format: {type: "table"}
  },
  {
    id: nanoid(),
    title: "Severity 2 Alert Signatures by Source",
    query: `event_type=alert alert.severity=2 | count() by src_ip, alert.signature | sort -r count | head 10`,
    layout: {x: 0, y: 0, w: 2, h: 9},
    format: {type: "table"}
  },
  {
    id: nanoid(),
    title: "Severity 2 Alert Signatures by Destination",
    query: `event_type=alert alert.severity=2 | count() by dest_ip, alert.signature | sort -r count | head 10`,
    layout: {x: 2, y: 0, w: 2, h: 9},
    format: {type: "table"}
  }
]

export const initialBoard: Board = {
  id: nanoid(),
  title: "Security Summary",
  tiles: initialTiles.map((t) => t.id)
}
