import {nanoid} from "@reduxjs/toolkit"
import {Board} from "src/js/state/Boards"
import {Tile} from "src/js/state/Tiles"

export const initialTiles: Tile[] = [
  {
    id: nanoid(),
    title: "Non-Conn Zeek Log Types",
    query: "_path != conn | count() by _path | sort -r count",
    layout: {x: 0, y: 0, w: 6, h: 6},
    format: {
      type: "bar-chart",
      x: "_path",
      y: "count"
    }
  },
  {
    id: nanoid(),
    title: "Total Records",
    query: "count()",
    layout: {x: 9, y: 0, w: 2, h: 2},
    format: {type: "number"}
  },
  {
    id: nanoid(),
    title: "Total Alerts",
    query: "event_type=alert | count()",
    layout: {x: 6, y: 0, w: 2, h: 2},
    format: {type: "number"}
  },
  {
    id: nanoid(),
    title: "Top Suricata Alerts by Severity",
    query:
      "event_type=alert | count() by alert.severity,alert.category,alert.signature | sort -r count | sort alert.severity",
    layout: {x: 0, y: 6, w: 12, h: 6},
    format: {type: "table"}
  }
]

export const initialBoard: Board = {
  id: nanoid(),
  title: "Security Summary",
  tiles: initialTiles.map((t) => t.id)
}
