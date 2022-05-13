import {ResultStream} from "packages/zealot/src"
import {Collector} from "packages/zealot/src/query/channel"
import {getZealot} from "src/js/flows/getZealot"
import ErrorFactory from "src/js/models/ErrorFactory"
import Columns from "../Columns"
import * as selectors from "./selectors"
import {Thunk} from "../types"
import Viewer from "../Viewer"
import {actions} from "./reducer"
import Current from "../Current"

function createAbortable(api, tab, tag) {
  api.abortables.abort({tab, tag})
  const ctl = new AbortController()
  const id = api.abortables.add({abort: () => ctl.abort(), tab, tag})
  const cleanup = () => api.abortables.remove(id)
  return [ctl.signal, cleanup] as const
}

function issueSearch(args: {
  query: string
  id: string
  tabId: string
  collect: Collector
}): Thunk<Promise<ResultStream>> {
  return async (dispatch, _, {api}) => {
    const zealot = await dispatch(getZealot())
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

export function fetchFirstPage(
  query: string,
  key: string,
  tabId: string
): Thunk {
  return async (dispatch, getState) => {
    dispatch(actions.init({query, key}))

    const collect = ({rows, shapesMap}) => {
      dispatch(actions.setValues(rows, tabId))
      dispatch(Viewer.updateColumns(tabId, shapesMap))
      dispatch(Columns.touch(shapesMap))
    }

    try {
      console.log(selectors.getPaginatedQuery(getState()))
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
      dispatch(actions.error(ErrorFactory.create(e), tabId))
    }
  }
}

export function fetchNextPage(): Thunk {
  return async (dispatch, getState) => {
    const prevVals = selectors.getValues(getState())
    const tabId = Current.getTabId(getState())

    dispatch(actions.nextPage())

    const collect = ({rows, shapesMap}) => {
      dispatch(actions.setValues([...prevVals, ...rows], tabId))
      dispatch(Viewer.updateColumns(tabId, shapesMap))
      dispatch(Columns.touch(shapesMap))
    }

    console.log(selectors.getPaginatedQuery(getState()))
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
      dispatch(actions.error(ErrorFactory.create(e), tabId))
    }
  }
}
