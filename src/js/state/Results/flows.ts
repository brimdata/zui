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
  return async (dispatch, getState, {api}) => {
    const prevVals = selectors.getValues(getState())
    const prevShapes = selectors.getShapes(getState())
    const collect = ({rows, shapesMap}) => {
      dispatch(actions.setValues([...prevVals, ...rows], tabId))
      dispatch(actions.setShapes({...prevShapes, ...shapesMap}, tabId))
      dispatch(Viewer.updateColumns(tabId, shapesMap))
      dispatch(Columns.touch(shapesMap))
    }

    try {
      const res = await api.query(selectors.getPaginatedQuery(getState()), {
        id: "main-results",
        tabId,
        collect,
      })
      dispatch(actions.success(res.rows.length, tabId))
    } catch (e) {
      if (e instanceof DOMException && e.message.match(/user aborted/)) return
      dispatch(actions.error(ErrorFactory.create(e).message, tabId))
    }
  }
}
