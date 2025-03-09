import ErrorFactory from "src/js/models/ErrorFactory"
import Current from "src/js/state/Current"
import Results from "src/js/state/Results"
import {Thunk} from "src/js/state/types"
import {isAbortError} from "src/util/is-abort-error"
import {createHandler} from "../handlers"
import {query} from "src/domain/lake/handlers"

// Add a signal param here
export function nextPage(id: string): Thunk {
  return async (dispatch, getState) => {
    if (Results.isFetching(id)(getState())) return
    if (Results.isComplete(id)(getState())) return
    if (Results.canPaginate(id)(getState())) {
      dispatch(Results.nextPage({id}))
      run(id)
    }
  }
}

// Add a signal param here
export function firstPage(opts: {id: string; query: string}): Thunk {
  return async (dispatch, getState, {api}) => {
    const {id, query} = opts
    const key = Current.getLocation(getState()).key
    const tabId = api.current.tabId
    dispatch(Results.init({query, key, id, tabId}))
    run(id)
  }
}

// Add a signal param here
const run = createHandler(
  async ({select, dispatch, asyncTasks}, id: string) => {
    const tabId = select(Current.getTabId)
    const isFirstPage = select(Results.getPage(id)) === 1
    const prevVals = select(Results.getValues(id))
    const prevShapes = select(Results.getShapes(id))
    const paginatedQuery = select(Results.getPaginatedQuery(id))
    const task = await asyncTasks.createOrReplace([tabId, id])
    task.run(async (signal) => {
      try {
        const res = await query(paginatedQuery, {signal})
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
    })
  }
)
