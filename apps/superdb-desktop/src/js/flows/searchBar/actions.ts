import * as zed from "../../../../../../packages/superdb-types/dist"
import program from "src/js/models/program"
import Editor from "src/js/state/Editor"
import {Thunk} from "../../state/types"

const changeTo =
  (value: string): Thunk =>
  (dispatch) => {
    dispatch(Editor.setValue(value))
  }

export function appendQueryInclude(field: zed.Field): Thunk {
  return function (dispatch, getState) {
    dispatch(
      changeTo(program(Editor.getValue(getState())).include(field).string())
    )
  }
}

export function appendQueryExclude(field: zed.Field): Thunk {
  return function (dispatch, getState) {
    dispatch(
      changeTo(program(Editor.getValue(getState())).exclude(field).string())
    )
  }
}

export function appendQueryCountBy(name: string | string[]): Thunk {
  return function (dispatch, getState) {
    const current = Editor.getValue(getState())
    dispatch(changeTo(program(current).countBy(name).string()))
  }
}

export function appendQuerySortBy(
  name: string | string[],
  direction: "asc" | "desc"
): Thunk {
  return function (dispatch, getState) {
    dispatch(
      changeTo(
        program(Editor.getValue(getState())).sortBy(name, direction).string()
      )
    )
  }
}

export function appendQueryIn(field: zed.Field, value: zed.Value): Thunk {
  return function (dispatch, getState) {
    dispatch(
      changeTo(program(Editor.getValue(getState())).in(field, value).string())
    )
  }
}

export function appendQueryNotIn(field: zed.Field, value: zed.Value): Thunk {
  return function (dispatch, getState) {
    dispatch(
      changeTo(
        program(Editor.getValue(getState())).notIn(field, value).string()
      )
    )
  }
}
