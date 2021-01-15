import {isEqual} from "lodash"
import React, {useState} from "react"
import randomHash from "src/js/brim/randomHash"
import styled from "styled-components"
import Grid from "./grid"
import Tile from "./tile"

const BG = styled.div`
  height: 100%;
  overflow: auto;
  background-color: var(--snow);
`

type BarChart = {
  type: "bar-chart"
  x: string
  y: string
}

type Table = {
  type: "table"
}

type Number = {
  type: "number"
}

export type TileFormat = BarChart | Table | Number

type Tile = {
  id: string
  title: string
  query: string
  layout: {x: number; y: number; w: number; h: number}
  format: TileFormat
}

function getGridLayout(tiles) {
  return tiles.map((t) => ({i: t.id, ...t.layout}))
}

export default function Summary() {
  const [tiles, setTiles] = useState<Tile[]>([
    {
      id: randomHash(),
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
      id: randomHash(),
      title: "Total Records",
      query: "count()",
      layout: {x: 9, y: 0, w: 2, h: 2},
      format: {type: "number"}
    },
    {
      id: randomHash(),
      title: "Total Alerts",
      query: "event_type=alert | count()",
      layout: {x: 6, y: 0, w: 2, h: 2},
      format: {type: "number"}
    },
    {
      id: randomHash(),
      title: "Top Suricata Alerts by Severity",
      query:
        "event_type=alert | count() by alert.severity,alert.category,alert.signature | sort -r count | sort alert.severity",
      layout: {x: 0, y: 6, w: 12, h: 6},
      format: {type: "table"}
    }
  ])

  const onLayoutChange = (layout) => {
    const next = layout.map(({x, y, h, w, i}) => {
      const tile = tiles.find((t) => t.id === i)
      return {...tile, layout: {x, y, h, w}}
    })
    if (!isEqual(tiles, next)) {
      setTiles(next)
    }
  }

  return (
    <BG>
      <Grid layout={getGridLayout(tiles)} onLayoutChange={onLayoutChange}>
        {tiles.map((t) => (
          <Tile key={t.id} title={t.title} format={t.format} query={t.query} />
        ))}
      </Grid>
    </BG>
  )
}
