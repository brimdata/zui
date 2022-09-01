import {Collector} from "@brimdata/zealot"
import Results from "src/js/state/Results"
import {Thunk} from "src/js/state/types"
import {buildHistogramQuery} from "./build-query"

export const HISTOGRAM_RESULTS = "zui/histogram"
const id = HISTOGRAM_RESULTS

// This is looking very similar to Results/flows.ts fetchResults()
// Maybe this can be part of the api. It automatically saves it to
// the results reducer, and it paginates the query for you?
export const runHistogramQuery =
  (): Thunk =>
  async (dispatch, getState, {api}) => {
    const tabId = api.current.tabId
    const key = api.current.location.key
    dispatch(Results.init({id, tabId, query: "", key}))
    const query = await dispatch(buildHistogramQuery())
    if (!query) return
    dispatch(Results.init({id, tabId, query, key}))
    const collect: Collector = ({rows, shapesMap}) => {
      dispatch(Results.setValues({id, tabId, values: rows}))
      dispatch(Results.setShapes({id, tabId, shapes: shapesMap}))
    }

    try {
      const res = await api.query(query, {tabId, id, collect})
      await res.promise
      dispatch(Results.success({id, tabId, count: res.rows.length}))
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.message.match(/user aborted/)
      ) {
        return
      }
      dispatch(Results.error({id, error, tabId}))
    }
  }
