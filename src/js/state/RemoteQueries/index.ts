import {createSlice} from "@reduxjs/toolkit"

const slice = createSlice({
  name: "$remoteQueries",
  initialState: {
    id: "root",
    name: "root",
    isOpen: true,
    items: []
  },
  reducers: {
    set(s, a) {
      s.items = a.payload
    }
  }
})

export default {
  reducer: slice.reducer,
  ...slice.actions,
  get: (s) => s.remoteQueries
}
