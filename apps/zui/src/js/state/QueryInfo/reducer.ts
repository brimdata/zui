import {createSlice} from "@reduxjs/toolkit"

const slice = createSlice({
  name: "TAB_QUERY_INFO",
  initialState: {
    isSummarized: false,
    poolName: null,
    sorts: [],
    error: null,
    groupByKeys: [],
  },
  reducers: {
    set(_, action) {
      return action.payload
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
