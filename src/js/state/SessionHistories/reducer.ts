import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {SessionHistoryEntry} from "./types"
import Tabs from "../Tabs/slice"

const slice = createSlice({
  name: "sessionHistories",
  initialState: {},
  reducers: {
    replaceById(
      s,
      a: PayloadAction<{sessionId: string; entry: SessionHistoryEntry}>
    ) {
      if (!s[a.payload.sessionId]) s[a.payload.sessionId] = [a.payload.entry]
      else {
        s[a.payload.sessionId].pop()
        s[a.payload.sessionId].push(a.payload.entry)
      }
    },
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
  extraReducers: {
    [Tabs.actions.remove.toString()]: (
      s,
      a: ReturnType<typeof Tabs.actions.remove>
    ) => {
      delete s[a.payload]
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
