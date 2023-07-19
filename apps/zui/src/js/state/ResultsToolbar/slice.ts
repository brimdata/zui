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
      let index = state.findIndex((item) => {
        return item.id === action.payload.id
      })
      const item = state[index]
      if (item) {
        state[index] = {...item, ...action.payload.changes}
      }
    },
  },
})

export const reducer = slice.reducer
