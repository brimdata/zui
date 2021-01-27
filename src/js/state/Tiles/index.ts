import {createEntityAdapter, createSlice} from "@reduxjs/toolkit"
import {initialTiles} from "ppl/summary/flows/initial-state"
import {State} from "../types"

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

export type TilesState = ReturnType<typeof slice.reducer>
export type Tile = {
  id: string
  title: string
  query: string
  format: Number | BarChart | Table
  layout: {x: number; y: number; w: number; h: number}
}

const adapter = createEntityAdapter<Tile>()
const selectors = adapter.getSelectors((s: State) => s.tiles)
const slice = createSlice({
  name: "tiles",
  initialState: {
    ids: initialTiles.map((t) => t.id),
    entities: initialTiles.reduce(
      (obj, tile) => ({...obj, [tile.id]: tile}),
      {}
    )
  },
  reducers: {
    create: adapter.addOne,
    delete: adapter.removeOne,
    updateMany: adapter.updateMany
  }
})

export default {
  reducer: slice.reducer,
  ...slice.actions,
  get: (id: string) => (state: State) => selectors.selectById(state, id),
  all: selectors.selectAll,
  entities: selectors.selectEntities
}
