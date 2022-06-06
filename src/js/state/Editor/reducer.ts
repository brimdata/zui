import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import buildPin from "./models/build-pin"
import {QueryPin} from "./types"

const slice = createSlice({
  name: "TAB_EDITOR",
  initialState: {
    value: "",
    pins: [] as QueryPin[],
    pinEditIndex: null as null | number,
    pinHoverIndex: null as null | number,
  },
  reducers: {
    setValue(s, a: PayloadAction<string>) {
      s.value = a.payload
    },
    setPins(s, a: PayloadAction<QueryPin[]>) {
      s.pins = a.payload
    },
    pinValue(s) {
      s.pins.push({type: "generic", value: s.value})
      s.value = ""
    },
    addPin(s, a: PayloadAction<QueryPin>) {
      if (!s.pins) s.pins = [a.payload]
      else s.pins.push(a.payload)
    },
    editPin(s, a: PayloadAction<number>) {
      s.pinEditIndex = a.payload
    },
    disablePin(s, a: PayloadAction<number>) {
      s.pins[a.payload].disabled = true
    },
    disableOtherPins(s, a: PayloadAction<number>) {
      s.pins.forEach((p, i) => {
        if (i === a.payload) return
        p.disabled = true
      })
    },
    enableOtherPins(s, a: PayloadAction<number>) {
      s.pins.forEach((p, i) => {
        if (i === a.payload) return
        p.disabled = false
      })
    },
    enablePin(s, a: PayloadAction<number>) {
      s.pins[a.payload].disabled = false
    },
    deletePin(s, a: PayloadAction<number>) {
      delete s.pins[a.payload]
    },
    deletePinsToTheRight(s, a: PayloadAction<number>) {
      s.pins.splice(a.payload + 1)
    },
    deleteAllPins(s) {
      s.pins = []
    },
    hoverOverPin(s, a: PayloadAction<number>) {
      s.pinHoverIndex = a.payload
    },
    dropPin(s, a: PayloadAction<number>) {
      const dropIndex = a.payload
      let insertIndex = s.pinHoverIndex
      s.pinHoverIndex = null
      // We dropped an item to it's right, messing with the array indexes
      if (insertIndex > dropIndex) insertIndex -= 1

      if (dropIndex === insertIndex) return
      const pin = s.pins[dropIndex]
      s.pins.splice(dropIndex, 1)
      s.pins.splice(insertIndex, 0, pin)
    },

    updatePin(s, a: PayloadAction<Partial<QueryPin>>) {
      const pin = s.pins[s.pinEditIndex]
      if (!pin) return
      const newPin = {...pin, ...a.payload} as QueryPin

      if (buildPin(newPin).empty()) {
        delete s.pins[s.pinEditIndex]
      } else {
        s.pins[s.pinEditIndex] = newPin
      }
      s.pinEditIndex = null
    },
    cancelPinEdit(s) {
      s.pinEditIndex = null
    },
  },
  extraReducers: {
    // Remove this when we remove search bar
    SEARCH_BAR_INPUT_CHANGE: (s, a) => {
      s.value = a.value
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
