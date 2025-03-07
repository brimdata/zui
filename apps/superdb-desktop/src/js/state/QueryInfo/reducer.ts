import {createSlice} from "@reduxjs/toolkit"

const getInitialState = () => {
  return {
    isParsed: false,
    sources: null,
    channels: null,
    error: null,
  }
}

const slice = createSlice({
  name: "TAB_QUERY_INFO",
  initialState: getInitialState(),
  reducers: {
    set(_, action) {
      return action.payload
    },
    merge(state, action) {
      return {...state, ...action.payload}
    },
    reset(_) {
      return getInitialState()
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
