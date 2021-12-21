import {createSlice} from "@reduxjs/toolkit"

const slice = createSlice({
  name: "TAB_INSPECTOR",
  initialState: {
    rows: [] as never[],
    scrollTop: 0,
    maxVisibleRowIndex: 0
  },
  reducers: {},
  extraReducers: {
    VIEWER_SET_RECORDS: (state, action) => {
      console.log("caught ya")
    }
  }
})

export default {
  reducer: slice.reducer
}
