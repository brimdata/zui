import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {State} from "../types"

const init = () => ({
  sidebarIsOpen: true,
  sidebarWidth: 230
})

const slice = createSlice({
  name: "appearance",
  initialState: init(),
  reducers: {
    toggleSidebar(s) {
      s.sidebarIsOpen = !s.sidebarIsOpen
    },
    resizeSidebar(s, action: PayloadAction<number>) {
      s.sidebarWidth = action.payload
    }
  }
})

const sidebarIsOpen = (state: State) => {
  return state.appearance.sidebarIsOpen
}

const sidebarWidth = (state: State) => {
  return state.appearance.sidebarWidth
}

export default {
  reducer: slice.reducer,
  ...slice.actions,
  sidebarIsOpen,
  sidebarWidth
}

export type AppearanceState = ReturnType<typeof slice.reducer>
