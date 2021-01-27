import {createEntityAdapter, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {initialBoard} from "ppl/summary/flows/initial-state"
import {State} from "../types"

export type Board = {id: string; title: string; tiles: string[]}
export type BoardsState = ReturnType<typeof slice.reducer>

const adapter = createEntityAdapter<Board>()
const selectors = adapter.getSelectors((state: State) => state.boards)
const slice = createSlice({
  name: "boards",
  initialState: {
    ids: [initialBoard.id],
    entities: {[initialBoard.id]: initialBoard}
  },
  reducers: {
    create: adapter.addOne,
    delete: adapter.removeOne,
    appendTile: (
      state,
      action: PayloadAction<{id: string; tileId: string}>
    ) => {
      const board = state.entities[action.payload.id]
      if (board) board.tiles.push(action.payload.tileId)
    }
  }
})

export default {
  reducer: slice.reducer,
  ...slice.actions,
  get: (id) => (state) => selectors.selectById(state, id),
  all: selectors.selectAll
}
