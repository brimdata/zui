import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit"
import {original} from "immer"
import {isEmpty, last} from "lodash"
import lib from "src/js/lib"
import tabReducer from "../Tab/reducer"
import {TabState} from "../Tab/types"

const isTabAction = ({type}) => {
  return (
    type.startsWith("TAB_") ||
    type.startsWith("SEARCH_") ||
    type.startsWith("VIEWER_") ||
    type.startsWith("CHART_") ||
    type.startsWith("COLUMNS_") ||
    type.startsWith("HISTORY_") ||
    type.startsWith("LOG_DETAIL_") ||
    type.startsWith("LAYOUT_") ||
    type.startsWith("CURRENT_") ||
    type.startsWith("LAST_") ||
    type.startsWith("TAB_LOCAL_STATE")
  )
}

const isReduxAction = ({type}) => {
  /* Redux dispatches a few actions that start with @@ to populate the store
    with all the initial states. When our app starts up, we want to populate
    each tab with it's initial state since we don't persist the entire state
    of each tab. */
  return type.startsWith("@@")
}

const firstTab = tabReducer(undefined, {type: "INIT"})

const slice = createSlice({
  name: "TABS",
  initialState: {
    active: firstTab.id as string | null,
    preview: null as string | null,
    data: [firstTab] as TabState[],
  },
  reducers: {
    add(s, a: PayloadAction<string>) {
      const id = a.payload
      const tab = {
        ...tabReducer(undefined, {type: "INIT"}),
        id,
      }
      // @ts-ignore
      s.data.push(tab)
    },
    remove(s, a: PayloadAction<string>) {
      if (s.data.length === 1) return
      const id = a.payload
      const index = findTabIndex(s, id)
      const isLast = index === s.data.length - 1
      s.data.splice(index, 1)
      if (id === s.active) {
        if (isEmpty(s.data)) s.active = null
        else if (isLast) s.active = last(s.data).id
        else s.active = s.data[index].id
      }
      if (id === s.preview) s.preview = null
    },
    activate(s, a: PayloadAction<string>) {
      if (findTab(s, a.payload)) s.active = a.payload
    },
    preview(s, a: PayloadAction<string | null>) {
      if (!a.payload) s.preview = null
      else if (findTab(s, a.payload)) s.preview = a.payload
    },
    order(s, a: PayloadAction<number[]>) {
      const indices = a.payload
      const newTabs = lib.compact(
        lib.uniq(indices).map((i) => original(s).data[i])
      )
      if (isEmpty(newTabs)) return
      s.data = newTabs
    },
    clearActive(s) {
      const index = findTabIndex(s, s.active)
      s.data[index] = tabReducer({id: s.active} as TabState, {
        type: "@INIT",
      })
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isTabAction, (s, a) => {
      const id = a.tabId || a.payload?.tabId || s.active
      if (!findTab(s, id)) return

      const index = findTabIndex(s, id)
      const tab = s.data[index]
      // @ts-ignore
      s.data[index] = tabReducer(original(tab), a)
    })
    builder.addMatcher(isReduxAction, (s, a) => {
      // @ts-ignore
      s.data = original(s).data.map((t) => tabReducer(t, a))
    })
  },
})

type TabsState = ReturnType<typeof slice.reducer>

const findTab = (s: Draft<TabsState>, id: string) => {
  return s.data.find((t) => t.id === id)
}

const findTabIndex = (s: Draft<TabsState>, id: string) => {
  return s.data.findIndex((t) => t.id === id)
}

export default slice
