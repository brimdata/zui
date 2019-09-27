/* @flow */

import type {Thunk} from "../state/types"
import {changeSearchBarInput} from "../state/actions"
import {
  getSearchBar,
  getSearchBarInputValue
} from "../state/selectors/searchBar"
import {onlyWhitespace} from "../lib/Str"
import Field from "../models/Field"
import brim from "../brim"

export function appendQueryInclude(field: Field): Thunk {
  return function(dispatch, getState) {
    dispatch(
      changeSearchBarInput(
        brim
          .program(getSearchBarInputValue(getState()))
          .include(brim.field(field.name, field.type, field.value))
          .string()
      )
    )
  }
}

export function appendQueryExclude(field: Field): Thunk {
  return function(dispatch, getState) {
    dispatch(
      changeSearchBarInput(
        brim
          .program(getSearchBarInputValue(getState()))
          .exclude(brim.field(field.name, field.type, field.value))
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
      changeSearchBarInput(
        brim
          .program(program)
          .countBy(brim.field(field.name, field.type, field.value))
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
      changeSearchBarInput(
        brim
          .program(program)
          .sortBy(name, direction)
          .string()
      )
    )
  }
}
