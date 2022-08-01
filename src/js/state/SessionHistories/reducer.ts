import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {SessionHistoriesState, SessionHistoryEntry} from "./types"
import {actions as tabs} from "../Tabs/reducer"

const slice = createSlice({
  name: "sessionHistories",
  initialState: {} as SessionHistoriesState,
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
    deleteEntry(s, a: PayloadAction<{sessionId: string; index: number}>) {
      const session = s[a.payload.sessionId]
      if (session) {
        session.splice(a.payload.index, 1)
      }
    },
  },
  extraReducers: {
    [tabs.remove.toString()]: (s, a: ReturnType<typeof tabs.remove>) => {
      delete s[a.payload]
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
