import {createSlice} from "@reduxjs/toolkit"

const slice = createSlice({
  name: "$sessionQueries",
  initialState: {},
  reducers: {
    set(s, a) {
      s[a.payload.id] = a.payload
    },
    remove(s, a) {
      delete s[a.payload.id]
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
