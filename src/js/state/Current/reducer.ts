import {PayloadAction, createSlice} from "@reduxjs/toolkit"

const slice = createSlice({
  name: "CURRENT",
  initialState: {lakeId: null as string | null},
  reducers: {
    setLakeId(s, a: PayloadAction<string>) {
      s.lakeId = a.payload
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
