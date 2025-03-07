import {initialResultData} from "./util"
import activeTabSelect from "../Tab/activeTabSelect"
import {paginate} from "./paginate"
import {ResultData, ResultsState} from "./types"

const initial = Object.freeze(initialResultData())

export function access(state: ResultsState, id: string) {
  if (state[id]) return state[id]
  else return initial
}

function resultsSelect<T>(selector: (r: ResultData) => T) {
  return (id: string) =>
    activeTabSelect((tab) => {
      return selector(access(tab.results, id))
    })
}

export const getValues = resultsSelect((results) => {
  return results.values
})

export const getShapes = resultsSelect((results) => {
  return results.shapes
})

export const getStatus = resultsSelect((results) => {
  return results.status
})

export const getPaginatedQuery = resultsSelect((results) => {
  return paginate(results.query, results.perPage, results.page)
})

export const getQuery = resultsSelect((results) => {
  return results.query
})

export const isFetching = resultsSelect((results) => {
  return results.status === "FETCHING"
})

export const canPaginate = resultsSelect((results) => {
  return results.canPaginate
})

export const isComplete = resultsSelect(
  (results) => results.status === "COMPLETE"
)

export const isIncomplete = resultsSelect(
  (results) => results.status === "INCOMPLETE"
)

export const getKey = resultsSelect((results) => {
  return results.key
})

export const getError = resultsSelect((results) => results.error)
export const getPage = resultsSelect((results) => results.page)
export const getPerPage = resultsSelect((results) => results.perPage)
export const getCount = resultsSelect((results) => results.values.length)
