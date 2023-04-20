import {PayloadAction, Update, createSlice} from "@reduxjs/toolkit"
import {MenuItem} from "src/core/menu"

export const slice = createSlice({
  name: "TAB_RESULTS_TOOLBAR",
  initialState: [] as MenuItem[],
  reducers: {
    set(_, action: PayloadAction<MenuItem[]>) {
      return action.payload
    },
    update(state, action: PayloadAction<Update<MenuItem>>) {
      let item = state.find((item) => item.id === action.payload.id)
      if (item) {
        item = {...item, ...action.payload.changes}
      }
    },
  },
})

export const reducer = slice.reducer
