import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {State} from "../types"
import {HistoryView, QueriesView, SectionName, OpenMap} from "./types"

const init = () => ({
  sidebarIsOpen: true,
  sidebarWidth: 250,
  secondarySidebarIsOpen: true,
  secondarySidebarWidth: 250,
  currentSectionName: "pools" as SectionName,
  queriesView: "local" as QueriesView,
  historyView: "linear" as HistoryView,
  poolsOpenState: {} as OpenMap,
  queriesOpenState: {} as OpenMap,
})

const select = {
  sidebarIsOpen: (state: State) => state.appearance.sidebarIsOpen,
  sidebarWidth: (state: State) => state.appearance.sidebarWidth,
  secondarySidebarIsOpen: (state: State) =>
    state.appearance.secondarySidebarIsOpen,
  secondarySidebarWidth: (state: State) =>
    state.appearance.secondarySidebarWidth,
  getCurrentSectionName: (state: State) => state.appearance.currentSectionName,
  getQueriesView: (state: State) => state.appearance.queriesView,
  getHistoryView: (state: State) => state.appearance.historyView,
  getPoolsOpenState: (state: State) => state.appearance.poolsOpenState,
  getQueriesOpenState: (state: State) => state.appearance.queriesOpenState,
}

// This is the window level appearance state
const slice = createSlice({
  name: "appearance",
  initialState: init(),
  reducers: {
    toggleSidebar(s) {
      s.sidebarIsOpen = !s.sidebarIsOpen
    },
    resizeSidebar(s, action: PayloadAction<number>) {
      s.sidebarWidth = Math.max(action.payload, 175)
    },
    toggleSecondarySidebar(s) {
      s.secondarySidebarIsOpen = !s.secondarySidebarIsOpen
    },
    showSecondarySidebar(s) {
      s.secondarySidebarIsOpen = true
    },
    resizeSecondarySidebar(s, action: PayloadAction<number>) {
      s.secondarySidebarWidth = Math.max(action.payload, 175)
    },
    setCurrentSectionName(s, action: PayloadAction<SectionName>) {
      s.currentSectionName = action.payload
    },
    setQueriesView(s, action: PayloadAction<QueriesView>) {
      s.queriesView = action.payload
    },
    setHistoryView: (s, a: PayloadAction<HistoryView>) => {
      s.historyView = a.payload
    },
    setQueriesOpenState: (s, a: PayloadAction<OpenMap>) => {
      s.queriesOpenState = a.payload
    },
    setPoolsOpenState: (s, a: PayloadAction<OpenMap>) => {
      s.poolsOpenState = a.payload
    },
  },
})

export default {
  reducer: slice.reducer,
  ...slice.actions,
  ...select,
}

export type AppearanceState = ReturnType<typeof slice.reducer>
