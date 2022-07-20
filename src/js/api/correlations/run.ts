import ErrorFactory from "src/js/models/ErrorFactory"
import Results from "src/js/state/Results"
import {Thunk} from "src/js/state/types"

type RunQueryOptions = {
  tabId: string
  id: string
  key: string
}

export const run =
  (query: string, options: RunQueryOptions): Thunk =>
  async (dispatch, getState, {api}) => {
    const {tabId, id, key} = options

    dispatch(Results.init({query, id, tabId, key}))

    const collect = (data) => {
      dispatch(Results.setValues({id, tabId, values: data.rows}))
      dispatch(Results.setShapes({id, tabId, shapes: data.shapesMap}))
    }

    try {
      const paginatedQuery = Results.getPaginatedQuery(id)(getState())
      const res = await api.query(paginatedQuery, {id, tabId, collect})
      await res.promise
      dispatch(Results.success({id, tabId, count: res.rows.length}))
      return res
    } catch (e) {
      if (e instanceof DOMException && e.message.match(/user aborted/)) return
      console.log(e)
      dispatch(
        Results.error({id, tabId, error: ErrorFactory.create(e).message})
      )
    }
  }
