import {ResultStream} from "@brimdata/zed-js"
import ErrorFactory from "src/js/models/ErrorFactory"
import Current from "src/js/state/Current"
import Results from "src/js/state/Results"
import {Thunk} from "src/js/state/types"

export function nextPage(id: string): Thunk {
  return async (dispatch, getState) => {
    const query = Results.getQuery(id)(getState())
    if (Results.isFetching(id)(getState())) return
    if (Results.isComplete(id)(getState())) return
    if (Results.isLimited(id)(getState())) return
    dispatch(Results.nextPage({id}))
    dispatch(run({id, query}))
  }
}

export function run(opts: {
  id: string
  query?: string
}): Thunk<Promise<ResultStream | null>> {
  return async (dispatch, getState, {api}) => {
    const key = Current.getLocation(getState()).key
    const tabId = api.current.tabId
    const {id} = opts
    const query = opts.query ?? Results.getQuery(id)(getState())
    const isFirstPage = Results.getPage(id)(getState()) === 1
    if (isFirstPage) {
      if (!query) throw new Error("No query provided for id: " + id)
      dispatch(Results.init({query, key, id, tabId}))
    }
    const prevVals = Results.getValues(id)(getState())
    const prevShapes = Results.getShapes(id)(getState())
    const paginatedQuery = Results.getPaginatedQuery(id)(getState())

    try {
      const res = await api.query(paginatedQuery, {
        id,
        tabId,
        collect: ({rows, shapesMap}) => {
          const values = isFirstPage ? rows : [...prevVals, ...rows]
          const shapes = isFirstPage ? shapesMap : {...prevShapes, ...shapesMap}
          dispatch(Results.setValues({id, tabId, values}))
          dispatch(Results.setShapes({id, tabId, shapes}))
        },
      })
      dispatch(Results.success({id, tabId, count: res.rows.length}))
      return res
    } catch (e) {
      if (e instanceof DOMException && e.message.match(/user aborted/)) {
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
