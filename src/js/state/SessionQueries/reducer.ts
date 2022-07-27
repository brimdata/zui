import {createSlice} from "@reduxjs/toolkit"
import Tabs from "../Tabs/slice"

const slice = createSlice({
  name: "sessionQueries",
  initialState: {},
  reducers: {
    set(s, a) {
      s[a.payload.id] = a.payload
    },
  },
  extraReducers: {
    [Tabs.actions.remove.toString()]: (
      s,
      a: ReturnType<typeof Tabs.actions.remove>
    ) => {
      delete s[a.payload]
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
