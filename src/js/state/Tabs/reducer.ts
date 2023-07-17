import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit"
import {original} from "immer"
import {isEmpty, last, uniq} from "lodash"
import tabReducer from "../Tab/reducer"
import {TabState} from "../Tab/types"
import {isTabAction} from "./is-tab-action"
import {isReduxAction} from "./is-redux-action"

const compact = (array: any[]) => array.filter((item) => !!item)

const slice = createSlice({
  name: "TABS",
  initialState: {
    active: null,
    preview: null as string | null,
    data: [] as TabState[],
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
      const tab = findTab(s, a.payload)
      if (tab) {
        tab.lastFocused = new Date().toISOString()
        s.active = a.payload
      }
    },
    preview(s, a: PayloadAction<string | null>) {
      if (!a.payload) s.preview = null
      else if (findTab(s, a.payload)) s.preview = a.payload
    },
    order(s, a: PayloadAction<number[]>) {
      const indices = a.payload
      const newTabs = compact(uniq(indices).map((i) => original(s).data[i]))
      if (isEmpty(newTabs)) return
      s.data = newTabs
    },
    clearActive(s) {
      const index = findTabIndex(s, s.active)
      s.data[index] = tabReducer({id: s.active} as TabState, {
        type: "@INIT",
      })
    },
    loaded(s, a: PayloadAction<string>) {
      const tab = findTab(s, s.active)
      tab.lastLocationKey = a.payload
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
      s.data = original(s)?.data?.map((t) => tabReducer(t, a))
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

export const actions = slice.actions
export const reducer = slice.reducer
