import {createSlice} from "@reduxjs/toolkit"
import {actions as tabs} from "../Tabs/reducer"

const slice = createSlice({
  name: "$sessionQueries",
  initialState: {},
  reducers: {
    set(s, a) {
      s[a.payload.id] = a.payload
    },
  },
  extraReducers: {
    [tabs.remove.toString()]: (s, a: ReturnType<typeof tabs.remove>) => {
      delete s[a.payload]
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
