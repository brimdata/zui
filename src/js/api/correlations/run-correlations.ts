import {Collector} from "@brimdata/zed-js"
import ErrorFactory from "src/js/models/ErrorFactory"
import Results from "src/js/state/Results"
import {Thunk} from "src/js/state/types"
import {Correlation} from "./types"

export const runCorrelations =
  (): Thunk =>
  (dispatch, _, {api}) => {
    api.correlations.configs.forEach((c) => {
      dispatch(runCorrelation(c))
    })
  }

const runCorrelation =
  (correlation: Correlation): Thunk =>
  async (dispatch, getState, {api}) => {
    if (correlation.when(api)) {
      const query = await correlation.query(api)
      const id = correlation.id
      const tabId = api.current.tabId
      const key = api.current.location.key
      const collect: Collector = (data) => {
        dispatch(Results.setValues({id, tabId, values: data.rows}))
        dispatch(Results.setShapes({id, tabId, shapes: data.shapesMap}))
      }

      dispatch(Results.init({query, id, tabId, key}))
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
  }
