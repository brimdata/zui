import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {State} from "../types"

export type LaunchesState = {
  [version: string]: string // Date string
}

const slice = createSlice({
  name: "$Launches",
  initialState: {},
  reducers: {
    touchVersion: (state, action: PayloadAction<string>) => {
      state[action.payload] = new Date().toISOString()
    }
  }
})

function firstRunOfVersion(state: State, version: string) {
  return !(version in state.launches)
}

function all(state: State) {
  return state.launches
}

export default {
  reducer: slice.reducer,
  ...slice.actions,
  all,
  firstRunOfVersion
}
