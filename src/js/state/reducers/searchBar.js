/* @flow */

import createReducer from "./createReducer"
import * as Str from "../lib/Str"
import * as Arr from "../lib/Array"

export const initialState = {
  current: "",
  previous: "",
  pinned: [],
  editing: null,
  error: null
}

export type SearchBar = typeof initialState

export default createReducer(initialState, {
  SEARCH_BAR_CLEAR: () => ({...initialState}),
  SEARCH_BAR_RESTORE: (state, {value}) => {
    return {
      ...state,
      ...value
    }
  },
  QUERY_INCLUDE_APPEND: (state, {field}) => ({
    ...state,
    current: Str.trim(
      state.current + ` ${field.name}=${Str.escapeSpaces(field.value)}`
    )
  }),

  QUERY_EXCLUDE_APPEND: (state, {field}) => ({
    ...state,
    current: Str.trim(
      state.current + ` ${field.name}!=${Str.escapeSpaces(field.value)}`
    )
  }),

  QUERY_COUNT_BY_APPEND: (state, {field}) => {
    const query = [...state.pinned, state.current].join(" ")
    const current = Str.onlyWhitespace(query) ? "*" : state.current
    return {
      ...state,
      current: Str.trim(current + ` | count() by ${field.name}`)
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

  SEARCH_BAR_PIN: (state) => {
    if (Str.onlyWhitespace(state.current)) return state
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
    if (Arr.indexInBounds(index, state.pinned)) {
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
    if (Arr.indexInBounds(index, state.pinned)) {
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

  SEARCH_BAR_PIN_REMOVE_ALL: (state) => ({
    ...state,
    editing: null,
    pinned: [],
    previous: ""
  }),

  MAIN_SEARCH_QUERY_PROGRAM_APPEND: (state, {fragment}) => {
    return {
      ...state,
      current: Str.trim(state.current + " " + fragment)
    }
  },

  SEARCH_BAR_SUBMIT: (state) => {
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
