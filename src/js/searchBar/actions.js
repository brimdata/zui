/* @flow */

import type {Thunk} from "../state/types"
import {changeSearchBarInput} from "../state/actions"
import {getSearchBarInputValue} from "../state/selectors/searchBar"
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
