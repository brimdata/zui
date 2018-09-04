import createReducer from "./createReducer"
import isNumber from "lodash/isNumber"
import trim from "lodash/trim"
import Ast from "../models/Ast"
import {changeProgramTimeWindow} from "../changeProgramTimeWindow"
import {createSelector} from "reselect"

export const initialState = {
  current: "",
  previous: "",
  pinned: [],
  editing: null
}

export default createReducer(initialState, {
  QUERY_INCLUDE_APPEND: (state, {name, value}) => ({
    ...state,
    current: trim(state.current + ` ${name}=${value}`)
  }),

  QUERY_EXCLUDE_APPEND: (state, {name, value}) => ({
    ...state,
    current: trim(state.current + ` ${name}!=${value}`)
  }),

  QUERY_COUNT_BY_APPEND: (state, {name}) => {
    const current = onlyWhitespace(state.current) ? "*" : state.current
    return {
      ...state,
      current: trim(current + ` | count() by ${name}`)
    }
  },

  SEARCH_BAR_INPUT_CHANGE: (state, {value}) => {
    if (state.editing === null) {
      return {
        ...state,
        current: value
      }
    } else {
      state.pinned[state.editing] = value
      return {
        ...state,
        current: value,
        pinned: [...state.pinned]
      }
    }
  },

  SEARCH_BAR_PIN: state => {
    if (onlyWhitespace(state.current)) return state
    else
      return {
        ...state,
        pinned: [...state.pinned, state.current],
        current: "",
        previous: "",
        editing: null
      }
  },

  SEARCH_BAR_PIN_EDIT: (state, {index}) => {
    if (indexInBounds(index, state.pinned)) {
      return {
        ...state,
        current: state.pinned[index],
        editing: index
      }
    } else {
      throw new Error(`Trying to edit a pin that does not exist: ${index}`)
    }
  },

  SEARCH_BAR_PIN_REMOVE: (state, {index}) => {
    if (indexInBounds(index, state.pinned)) {
      return {
        ...state,
        pinned: state.pinned.filter((_e, i) => i != index),
        editing: null
      }
    } else if (index === null) {
      return {
        ...state,
        current: "",
        editing: null,
        previous: ""
      }
    } else {
      throw new Error(`Trying to remove a pin that does not exist: ${index}`)
    }
  },

  TIME_WINDOW_SET: (state, {timeWindow}) => {
    return {
      ...state,
      current: changeProgramTimeWindow(state.current, timeWindow)
    }
  },

  MAIN_SEARCH_QUERY_PROGRAM_APPEND: (state, {fragment}) => {
    return {
      ...state,
      current: trim(state.current + " " + fragment)
    }
  },

  MAIN_SEARCH_REQUEST: state => {
    if (state.editing === null) {
      return {
        ...state,
        previous: state.current
      }
    } else {
      return {
        ...state,
        current: "",
        previous: "",
        editing: null
      }
    }
  },

  SEARCH_BAR_PINS_SET: (state, {pinned}) => {
    return {
      ...state,
      pinned,
      previous: "",
      editing: null,
      current: ""
    }
  }
})

const onlyWhitespace = string => /^\s*$/.test(string)
const indexInBounds = (index, array) =>
  isNumber(index) && index >= 0 && index < array.length

export const getSearchBarInputValue = state => state.searchBar.current
export const getSearchBarPins = state => state.searchBar.pinned
export const getSearchBarPreviousInputValue = state => state.searchBar.previous
export const getSearchBarEditingIndex = state => state.searchBar.editing

export const getSearchProgram = createSelector(
  getSearchBarPins,
  getSearchBarInputValue,
  (pinned, current) => [...pinned, current].map(trim).join(" ")
)

export const getAst = createSelector(getSearchProgram, searchProgram => {
  const ast = new Ast(searchProgram).toJSON()
  return JSON.stringify(ast, null, 2)
})
