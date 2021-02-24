import React, {useEffect} from "react"
import styled from "styled-components"
import {initialTiles} from "./flows/initial-state"
import Grid from "./grid"
import Tile from "app/tile/tile"

const BG = styled.div`
  height: 100%;
  overflow: auto;
  background-color: var(--coconut);
`

type BarChart = {
  type: "bar-chart"
  x: string
  y: string
}

type Table = {
  type: "table"
  x?: string
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
  return tiles.map((t) => ({i: t.id, ...t.layout, static: true}))
}

const Title = styled.h2`
  ${(p) => p.theme.typography.headingPage}
  margin: 24px 12px 12px 12px;
  text-align: center;
  user-select: none;
`

const SummaryUI = ({title, tiles, onLayoutChange}) => {
  tiles = [tiles[0]]

  return (
    <BG>
      <Title>{title}</Title>
      <Grid layout={getGridLayout(tiles)} onLayoutChange={onLayoutChange}>
        {tiles.map((t) => (
          <Tile key={t.id} title={t.title} format={t.format} query={t.query} />
        ))}
      </Grid>
    </BG>
  )
}

export default function Summary() {
  const tiles = initialTiles
  const onLayoutChange = (_layout) => {
    /* Will do later */
  }

  return (
    <SummaryUI
      title="Security Summary"
      tiles={tiles}
      onLayoutChange={onLayoutChange}
    />
  )
}
