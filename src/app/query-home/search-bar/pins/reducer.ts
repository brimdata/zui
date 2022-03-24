import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export type GenericQueryPin = {
  type: "generic"
  value: string
  label?: string
}

export type FromQueryPin = {
  type: "from"
  value: string
}

export type QueryPin = GenericQueryPin | FromQueryPin

const slice = createSlice({
  name: "pins",
  initialState: {pins: [], editing: null as null | number},
  reducers: {
    add(s, a: PayloadAction<QueryPin>) {
      s.pins.push(a.payload)
    },
    edit(s, a: PayloadAction<number>) {
      s.editing = a.payload
    },
    submit(s, a: PayloadAction<Partial<QueryPin>>) {
      const pin = s.pins[s.editing]
      if (!pin) {
        console.log("no pin??", s.editing)
        return
      }
      s.pins[s.editing] = {...pin, ...a.payload}
      s.editing = null
    },
    delete(s, a: PayloadAction<number>) {
      delete s.pins[a.payload]
    },
    reset(s) {
      s.editing = null
    }
  }
})

export default {
  reducer: slice.reducer,
  ...slice.actions
}
