import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {SectionData} from "src/pkg/sectional"
import {State} from "../types"

const init = () => ({
  sidebarIsOpen: true,
  sidebarWidth: 230,
  sidebarSections: [{id: "pools"}, {id: "queries"}, {id: "history"}]
})

const select = {
  sidebarIsOpen: (state: State) => state.appearance.sidebarIsOpen,
  sidebarWidth: (state: State) => state.appearance.sidebarWidth,
  sidebarSections: (state: State) => state.appearance.sidebarSections
}

const slice = createSlice({
  name: "appearance",
  initialState: init(),
  reducers: {
    toggleSidebar(s) {
      s.sidebarIsOpen = !s.sidebarIsOpen
    },
    resizeSidebar(s, action: PayloadAction<number>) {
      s.sidebarWidth = action.payload
    },
    updateSidebarSections(s, action: PayloadAction<SectionData[]>) {
      s.sidebarSections = action.payload
    }
  }
})

export default {
  reducer: slice.reducer,
  ...slice.actions,
  ...select
}

export type AppearanceState = ReturnType<typeof slice.reducer>
