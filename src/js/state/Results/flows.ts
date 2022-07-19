import {ResultStream, Collector} from "@brimdata/zealot"
import ErrorFactory from "src/js/models/ErrorFactory"
import Columns from "../Columns"
import * as selectors from "./selectors"
import {Thunk} from "../types"
import Viewer from "../Viewer"
import {actions} from "./reducer"
import Current from "../Current"

export function fetchFirstPage(query: string): Thunk {
  return async (dispatch, getState) => {
    const tabId = Current.getTabId(getState())
    const key = Current.getLocation(getState()).key

    dispatch(Viewer.clear())
    dispatch(actions.init({query, key}))
    dispatch(fetchResults(tabId))
  }
}

export function fetchNextPage(): Thunk {
  return async (dispatch, getState) => {
    const tabId = Current.getTabId(getState())

    dispatch(actions.nextPage())
    dispatch(fetchResults(tabId))
  }
}

function fetchResults(tabId: string): Thunk {
  return async (dispatch, getState) => {
    const prevVals = selectors.getValues(getState())
    const prevShapes = selectors.getShapes(getState())

    const collect = ({rows, shapesMap}) => {
      dispatch(actions.setValues([...prevVals, ...rows], tabId))
      dispatch(actions.setShapes({...prevShapes, ...shapesMap}, tabId))
      dispatch(Viewer.updateColumns(tabId, shapesMap))
      dispatch(Columns.touch(shapesMap))
    }
    try {
      const res = await dispatch(
        issueSearch({
          query: selectors.getPaginatedQuery(getState()),
          tabId,
          id: "main-results",
          collect,
        })
      )
      dispatch(actions.success(res.rows.length, tabId))
    } catch (e) {
      if (e instanceof DOMException && e.message.match(/user aborted/)) return
      dispatch(actions.error(ErrorFactory.create(e).message, tabId))
    }
  }
}

function issueSearch(args: {
  query: string
  id: string
  tabId: string
  collect: Collector
}): Thunk<Promise<ResultStream>> {
  return async (dispatch, _, {api}) => {
    const zealot = await api.getZealot()
    const [signal, cleanup] = createAbortable(api, args.tabId, args.id)
    let res: ResultStream
    try {
      res = await zealot.query(args.query, {signal})
      await res.collect(args.collect)
    } finally {
      cleanup()
    }
    return res
  }
}

function createAbortable(api, tab, tag) {
  api.abortables.abort({tab, tag})
  const ctl = new AbortController()
  const id = api.abortables.add({abort: () => ctl.abort(), tab, tag})
  const cleanup = () => api.abortables.remove(id)
  return [ctl.signal, cleanup] as const
}
