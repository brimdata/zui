import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {getVersion} from "app/core/utils/get-version"
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

function firstRunOfVersion(state: State, v = getVersion()) {
  return !(v in state.launches)
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
