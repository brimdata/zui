import ErrorFactory from "src/js/models/ErrorFactory"
import Columns from "../Columns"
import * as selectors from "./selectors"
import {Thunk} from "../types"
import Viewer from "../Viewer"
import {actions} from "./reducer"
import Current from "../Current"
import {MAIN_RESULTS} from "./types"

const id = MAIN_RESULTS

export function fetchFirstPage(query: string): Thunk {
  return async (dispatch, getState) => {
    const tabId = Current.getTabId(getState())
    const key = Current.getLocation(getState()).key

    dispatch(Viewer.clear())
    dispatch(actions.init({query, key, id, tabId}))
    dispatch(fetchResults(tabId))
  }
}

export function fetchNextPage(): Thunk {
  return async (dispatch, getState) => {
    const tabId = Current.getTabId(getState())

    dispatch(actions.nextPage({id: MAIN_RESULTS, tabId}))
    dispatch(fetchResults(tabId))
  }
}

function fetchResults(tabId: string): Thunk {
  return async (dispatch, getState, {api}) => {
    const prevVals = selectors.getValues(id)(getState())
    const prevShapes = selectors.getShapes(id)(getState())
    const collect = ({rows, shapesMap}) => {
      const values = [...prevVals, ...rows]
      const shapes = {...prevShapes, ...shapesMap}
      dispatch(actions.setValues({id, tabId, values}))
      dispatch(actions.setShapes({id, tabId, shapes}))
      dispatch(Viewer.updateColumns(tabId, shapesMap))
      dispatch(Columns.touch(shapesMap))
    }

    try {
      const res = await api.query(selectors.getPaginatedQuery(id)(getState()), {
        id,
        tabId,
        collect,
      })
      dispatch(actions.success({id, tabId, count: res.rows.length}))
    } catch (e) {
      if (e instanceof DOMException && e.message.match(/user aborted/)) return
      dispatch(
        actions.error({id, tabId, error: ErrorFactory.create(e).message})
      )
    }
  }
}
