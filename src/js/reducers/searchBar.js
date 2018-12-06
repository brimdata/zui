/* @flow */

import createReducer from "./createReducer"
import isNumber from "lodash/isNumber"
import trim from "lodash/trim"
import Ast from "../models/Ast"
import {createSelector} from "reselect"
import type {State} from "./types"

export const initialState = {
  current: "",
  previous: "",
  pinned: [],
  editing: null,
  error: null
}

export type SearchBar = typeof initialState

export default createReducer(initialState, {
  SEARCH_BAR_RESTORE: (state, {value}) => {
    return {
      ...state,
      ...value
    }
  },
  QUERY_INCLUDE_APPEND: (state, {field}) => ({
    ...state,
    current: trim(state.current + ` ${field.name}=${escapeSpaces(field.value)}`)
  }),

  QUERY_EXCLUDE_APPEND: (state, {field}) => ({
    ...state,
    current: trim(
      state.current + ` ${field.name}!=${escapeSpaces(field.value)}`
    )
  }),

  QUERY_COUNT_BY_APPEND: (state, {field}) => {
    const current = onlyWhitespace(state.current) ? "*" : state.current
    return {
      ...state,
      current: trim(current + ` | count() by ${field.name}`)
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

  SEARCH_BAR_PIN_REMOVE_ALL: state => ({
    ...state,
    editing: null,
    pinned: [],
    previous: ""
  }),

  MAIN_SEARCH_QUERY_PROGRAM_APPEND: (state, {fragment}) => {
    return {
      ...state,
      current: trim(state.current + " " + fragment)
    }
  },

  SEARCH_BAR_SUBMIT: state => {
    if (state.editing === null) {
      return {
        ...state,
        previous: state.current,
        error: null
      }
    } else {
      return {
        ...state,
        current: "",
        previous: "",
        editing: null,
        error: null
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
  },
  SEARCH_BAR_PARSE_ERROR: (state, {error}) => ({
    ...state,
    error
  })
})

const onlyWhitespace = string => /^\s*$/.test(string)

const escapeSpaces = value => {
  if (/\s+/.test(value)) {
    return `"${value}"`
  } else {
    return value
  }
}

const indexInBounds = (index, array) =>
  isNumber(index) && index >= 0 && index < array.length

export const getSearchBarInputValue = (state: State) => state.searchBar.current

export const getSearchBarPins = (state: State) => state.searchBar.pinned

export const getSearchBarPreviousInputValue = (state: State) =>
  state.searchBar.previous

export const getSearchBarEditingIndex = (state: State) =>
  state.searchBar.editing

export const getSearchBarError = (state: State) => state.searchBar.error

export const getSearchProgram = createSelector(
  getSearchBarPins,
  getSearchBarInputValue,
  (pinned, current) => {
    const program = [...pinned, current].map(s => trim(s)).join(" ")
    return program.length === 0 ? "*" : program
  }
)

export const getPrevSearchProgram = createSelector(
  getSearchBarPins,
  getSearchBarPreviousInputValue,
  (pinned, prev) => {
    const program = [...pinned, prev].map(s => trim(s)).join(" ")
    return program.length === 0 ? "*" : program
  }
)

export const getAst = createSelector(
  getSearchProgram,
  searchProgram => {
    const ast = new Ast(searchProgram).toJSON()
    return JSON.stringify(ast, null, 2)
  }
)
