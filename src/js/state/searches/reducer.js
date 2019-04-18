/* @flow */

import type {
  SEARCHES_CLEAR,
  SEARCH_REGISTER,
  SEARCH_RESULTS,
  SEARCH_STATS,
  SEARCH_STATUS,
  SearchesState
} from "./types"
import {deleteIf} from "../../stdlib/object"
import mergeResults from "./mergeResults"

type Action =
  | SEARCH_REGISTER
  | SEARCH_STATS
  | SEARCH_STATUS
  | SEARCHES_CLEAR
  | SEARCH_RESULTS

const init = {}

export default function(state: SearchesState = init, action: Action) {
  switch (action.type) {
    case "SEARCH_REGISTER":
      return {
        ...state,
        [action.search.name]: action.search
      }
    case "SEARCH_STATS":
      if (!state[action.name]) throwUpdateError(action.name)
      return {
        ...state,
        [action.name]: {...state[action.name], stats: action.stats}
      }
    case "SEARCH_STATUS":
      if (!state[action.name]) throwUpdateError(action.name)
      return {
        ...state,
        [action.name]: {...state[action.name], status: action.status}
      }
    case "SEARCH_RESULTS":
      var {name, results} = action
      var search = state[action.name]
      if (!search) throwUpdateError(action.name)

      return {
        ...state,
        [name]: {...search, results: mergeResults(search.results, results)}
      }
    case "SEARCHES_CLEAR":
      var tag = action.tag
      if (!tag) return {...init}
      return deleteIf(state, (search) => search.tag === tag)
    default:
      return state
  }
}

//
// export const james = createReducer(initialState, {
//   BOOM_SEARCHES_REGISTER: (state, {search}) => ({
//     ...state,
//     [search.name]: search
//   }),
//   BOOM_SEARCHES_SET_STATUS: (state, {name, status}) => {
//     if (!state[name]) throwUpdateError(name)
//     return {
//       ...state,
//       [name]: {...state[name], status}
//     }
//   },
//   BOOM_SEARCHES_SET_STATS: (state, {name, stats}) => {
//     if (!state[name]) throwUpdateError(name)
//     return {
//       ...state,
//       [name]: {...state[name], stats}
//     }
//   },
//   BOOM_SEARCHES_CLEAR: (state, {tag}) => {
// if (!tag) return {...initialState}
// const newState = {...state}
// for (let key in newState)
//   if (newState[key].tag === tag) delete newState[key]
// return newState
//   }
// })
//
const throwUpdateError = (name) => {
  throw new Error(`Trying to update search that does not exist: ${name}`)
}
//
// export const getBoomSearches = (state: State) => {
//   return state.boomSearches
// }
