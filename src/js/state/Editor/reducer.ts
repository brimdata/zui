import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import buildPin from "./models/build-pin"
import {FromQueryPin, QueryPin, TimeRangeQueryPin} from "./types"

const slice = createSlice({
  name: "TAB_EDITOR",
  initialState: {
    value: "",
    pins: [] as QueryPin[],
    pinEditIndex: null as null | number,
    pinHoverIndex: null as null | number,
    height: 96,
  },
  reducers: {
    setHeight(s, a: PayloadAction<number>) {
      s.height = a.payload
    },
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
      s.pins.splice(a.payload, 1)
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
        s.pins.splice(s.pinEditIndex, 1)
      } else {
        s.pins[s.pinEditIndex] = newPin
      }
      s.pinEditIndex = null
    },
    cancelPinEdit(s) {
      s.pinEditIndex = null
    },
    setFrom(s, a: PayloadAction<string>) {
      const index = s.pins.findIndex((p) => p.type === "from")
      if (index === -1) {
        s.pins.unshift({type: "from", value: a.payload})
      } else {
        ;(s.pins[index] as FromQueryPin).value = a.payload
      }
    },
    setTimeRange(s, a: PayloadAction<{field: string; from: Date; to: Date}>) {
      const {field, from, to} = a.payload
      const pin = s.pins.find(
        (p) => p.type === "time-range"
      ) as TimeRangeQueryPin

      if (pin) {
        pin.from = from.toISOString()
        pin.to = to.toISOString()
        pin.field = field
      } else {
        s.pins.push({
          type: "time-range",
          field,
          from: from.toISOString(),
          to: to.toISOString(),
        })
      }
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
