import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {QueryPin} from "./types"

const slice = createSlice({
  name: "TAB_EDITOR",
  initialState: {pins: [] as QueryPin[], pinEditIndex: null as null | number},
  reducers: {
    addPin(s, a: PayloadAction<QueryPin>) {
      s.pins.push(a.payload)
    },
    editPin(s, a: PayloadAction<number>) {
      s.pinEditIndex = a.payload
    },
    deletePin(s, a: PayloadAction<number>) {
      delete s.pins[a.payload]
    },
    updatePin(s, a: PayloadAction<Partial<QueryPin>>) {
      const pin = s.pins[s.pinEditIndex]
      if (!pin) return
      s.pins[s.pinEditIndex] = {...pin, ...a.payload}
      s.pinEditIndex = null
    },
    cancelPinEdit(s) {
      s.pinEditIndex = null
    }
  }
})

export const reducer = slice.reducer
export const actions = slice.actions
