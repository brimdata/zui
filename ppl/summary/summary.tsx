import React, {useMemo} from "react"
import {useDispatch, useSelector} from "react-redux"
import Boards from "src/js/state/Boards"
import Tiles from "src/js/state/Tiles"
import styled from "styled-components"
import updateTileLayout from "./flows/update-tile-layout"
import Grid from "./grid"
import Tile from "./tile"

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

const Title = styled.h2`
  margin: 12px;
  ${(p) => p.theme.typography.headingPage}
`

const SummaryUI = ({title, tiles, onLayoutChange}) => {
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
  const dispatch = useDispatch()
  const board = useSelector(Boards.all)[0]
  const allTiles = useSelector(Tiles.entities)
  const tiles = useMemo(() => {
    return board.tiles.map((id) => allTiles[id])
  }, [board.tiles, allTiles])
  const onLayoutChange = (layout) => {
    dispatch(updateTileLayout(layout))
  }

  return (
    <SummaryUI
      title={board.title}
      tiles={tiles}
      onLayoutChange={onLayoutChange}
    />
  )
}
