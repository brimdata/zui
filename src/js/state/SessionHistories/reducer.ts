import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {SessionHistoryEntry} from "./types"

const slice = createSlice({
  name: "$sessionHistories",
  initialState: {},
  reducers: {
    pushById(
      s,
      a: PayloadAction<{sessionId: string; entry: SessionHistoryEntry}>
    ) {
      if (!s[a.payload.sessionId]) s[a.payload.sessionId] = [a.payload.entry]
      else s[a.payload.sessionId].push(a.payload.entry)
    },
    deleteById(s, a: PayloadAction<{sessionId: string}>) {
      delete s[a.payload.sessionId]
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
