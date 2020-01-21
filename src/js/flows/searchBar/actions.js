/* @flow */

import type {Thunk} from "../../state/types"
import {
  getSearchBar,
  getSearchBarInputValue
} from "../../state/SearchBar/selectors"
import {onlyWhitespace} from "../../lib/Str"
import Field from "../../models/Field"
import SearchBar from "../../state/SearchBar"
import brim, {type $Field} from "../../brim"

export function appendQueryInclude(field: Field): Thunk {
  return function(dispatch, getState) {
    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(getSearchBarInputValue(getState()))
          .include(brim.field(field))
          .string()
      )
    )
  }
}

export function appendQueryExclude(field: Field): Thunk {
  return function(dispatch, getState) {
    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(getSearchBarInputValue(getState()))
          .exclude(brim.field(field))
          .string()
      )
    )
  }
}

export function appendQueryCountBy(field: Field): Thunk {
  return function(dispatch, getState) {
    let {current, pinned} = getSearchBar(getState())
    let query = [...pinned, current].join(" ")
    let program = onlyWhitespace(query) ? "*" : current

    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(program)
          .countBy(brim.field(field))
          .string()
      )
    )
  }
}

export function appendQuerySortBy(
  name: string,
  direction: "asc" | "desc"
): Thunk {
  return function(dispatch, getState) {
    let {current, pinned} = getSearchBar(getState())
    let query = [...pinned, current].join(" ")
    let program = onlyWhitespace(query) ? "*" : current

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

export function appendQueryIn(field: $Field): Thunk {
  return function(dispatch, getState) {
    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(getSearchBarInputValue(getState()))
          .in(field)
          .string()
      )
    )
  }
}

export function appendQueryNotIn(field: $Field): Thunk {
  return function(dispatch, getState) {
    dispatch(
      SearchBar.changeSearchBarInput(
        brim
          .program(getSearchBarInputValue(getState()))
          .notIn(field)
          .string()
      )
    )
  }
}
