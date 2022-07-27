import {createSlice} from "@reduxjs/toolkit"
import Tabs from "../Tabs"

const slice = createSlice({
  name: "sessionQueries",
  initialState: {},
  reducers: {
    set(s, a) {
      s[a.payload.id] = a.payload
    },
  },
  extraReducers: {
    // WHY DOES THIS LINE BREAK THE APP??
    // [Tabs.remove.toString()]: (s, a: ReturnType<typeof Tabs.remove>) => {
    "TABS/remove": (s, a: ReturnType<typeof Tabs.remove>) => {
      delete s[a.payload]
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
