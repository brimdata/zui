import {zed} from "zealot-old"
import brim from "../../brim"
import {onlyWhitespace} from "../../lib/Str"
import SearchBar from "../../state/SearchBar"
import {
  getSearchBar,
  getSearchBarInputValue
} from "../../state/SearchBar/selectors"
import {Thunk} from "../../state/types"

export function appendQueryInclude(field: zed.Field): Thunk {
  return function(dispatch, getState) {
    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(getSearchBarInputValue(getState()))
          .include(field)
          .string()
      )
    )
  }
}

export function appendQueryExclude(field: zed.Field): Thunk {
  return function(dispatch, getState) {
    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(getSearchBarInputValue(getState()))
          .exclude(field)
          .string()
      )
    )
  }
}

export function appendQueryCountBy(field: zed.Field): Thunk {
  return function(dispatch, getState) {
    const {current, pinned} = getSearchBar(getState())
    const query = [...pinned, current].join(" ")
    const program = onlyWhitespace(query) ? "*" : current

    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(program)
          .countBy(field)
          .string()
      )
    )
  }
}

export function appendQuerySortBy(
  name: string | string[],
  direction: "asc" | "desc"
): Thunk {
  return function(dispatch, getState) {
    const {current, pinned} = getSearchBar(getState())
    const query = [...pinned, current].join(" ")
    const program = onlyWhitespace(query) ? "*" : current

    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(program)
          .sortBy(name, direction)
          .string()
      )
    )
  }
}

export function appendQueryIn(field: zed.Field, value: zed.AnyValue): Thunk {
  return function(dispatch, getState) {
    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(getSearchBarInputValue(getState()))
          .in(field, value)
          .string()
      )
    )
  }
}

export function appendQueryNotIn(field: zed.Field, value: zed.AnyValue): Thunk {
  return function(dispatch, getState) {
    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(getSearchBarInputValue(getState()))
          .notIn(field, value)
          .string()
      )
    )
  }
}
