import {ResultStream} from "@brimdata/zed-js"
import ErrorFactory from "src/js/models/ErrorFactory"
import Current from "src/js/state/Current"
import QueryInfo from "src/js/state/QueryInfo"
import Results from "src/js/state/Results"
import {Thunk} from "src/js/state/types"
import {isAbortError} from "src/util/is-abort-error"

export function nextPage(id: string): Thunk {
  return async (dispatch, getState) => {
    if (Results.isFetching(id)(getState())) return
    if (Results.isComplete(id)(getState())) return
    if (Results.isLimited(id)(getState())) return
    dispatch(Results.nextPage({id}))
    dispatch(run(id))
  }
}

export function firstPage(opts: {id: string; query: string}): Thunk {
  return async (dispatch, getState, {api}) => {
    const {id, query} = opts
    const key = Current.getLocation(getState()).key
    const tabId = api.current.tabId
    const aggregation = QueryInfo.get(getState()).isSummarized
    dispatch(Results.init({query, key, id, tabId, aggregation}))
    dispatch(run(id))
  }
}

function run(id: string): Thunk<Promise<ResultStream | null>> {
  return async (dispatch, getState, {api}) => {
    const tabId = api.current.tabId
    const isFirstPage = Results.getPage(id)(getState()) === 1
    const prevVals = Results.getValues(id)(getState())
    const prevShapes = Results.getShapes(id)(getState())
    const paginatedQuery = Results.getPaginatedQuery(id)(getState())

    try {
      const res = await api.query(paginatedQuery, {id, tabId})
      await res.collect(({rows, shapesMap}) => {
        const values = isFirstPage ? rows : [...prevVals, ...rows]
        const shapes = isFirstPage ? shapesMap : {...prevShapes, ...shapesMap}
        dispatch(Results.setValues({id, tabId, values}))
        dispatch(Results.setShapes({id, tabId, shapes}))
      })
      dispatch(Results.success({id, tabId, count: res.rows.length}))
      return res
    } catch (e) {
      if (isAbortError(e)) {
        return null
      } else {
        dispatch(
          Results.error({id, tabId, error: ErrorFactory.create(e).message})
        )
      }
      return null
    }
  }
}
