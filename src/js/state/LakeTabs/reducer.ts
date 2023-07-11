import {createSlice} from "@reduxjs/toolkit"
import {TabsState} from "../Tabs/types"
import {reducer as tabsReducer} from "../Tabs/reducer"
import {isTabAction} from "../Tabs/is-tab-action"
import {isReduxAction} from "../Tabs/is-redux-action"
import {actions as Current} from "../Current/reducer"

const init = {type: "@@INIT"}

const isTabsAction = ({type}) => type.startsWith("TABS/") || isTabAction({type})

const slice = createSlice({
  name: "LAKE_TABS",
  initialState: {
    active: null as null | string,
    data: {} as Record<string, TabsState>,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(Current.setLakeId, (state, action) => {
      state.active = action.payload
      state.data[state.active] = tabsReducer(state.data[state.active], init)
    })

    builder.addMatcher(isTabsAction, (state, action) => {
      state.data[state.active] = tabsReducer(state.data[state.active], action)
    })

    builder.addMatcher(isReduxAction, (state, action) => {
      for (const id in state.data) {
        state.data[id] = tabsReducer(state.data[id], action)
      }
    })
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
