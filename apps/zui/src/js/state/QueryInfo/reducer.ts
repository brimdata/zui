import {createSlice} from "@reduxjs/toolkit"

const getInitialState = () => {
  return {
    isParsed: false,
    isSummarized: false,
    poolName: null,
    sorts: [],
    error: null,
    groupByKeys: [],
  }
}

const slice = createSlice({
  name: "TAB_QUERY_INFO",
  initialState: getInitialState(),
  reducers: {
    set(_, action) {
      return action.payload
    },
    reset(_) {
      return getInitialState()
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
