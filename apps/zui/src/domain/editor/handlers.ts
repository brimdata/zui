import * as zed from "@brimdata/zed-js"
import program from "src/js/models/program"
import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryIn,
  appendQueryInclude,
  appendQueryNotIn,
  appendQuerySortBy,
} from "src/js/flows/searchBar/actions"
import {copyToClipboard} from "src/js/lib/doc"
import Editor from "src/js/state/Editor"
import {toZedScript} from "src/js/zed-script/toZedScript"
import {submitSearch} from "src/domain/session/handlers"
import {createHandler} from "src/core/handlers"
import Selection from "src/js/state/Selection"

type ColumnName = string | string[]

export const copyValueToClipboard = createHandler(
  "editor.copyValueToClipboard",
  ({select}) => {
    const value = select(Selection.getValue)
    const selection = document.getSelection()
    copyToClipboard(
      selection.isCollapsed ? value.toString() : selection.toString()
    )
  }
)

export const countByField = createHandler(
  "editor.countByField",
  ({select, dispatch}) => {
    const field = select(Selection.getField)
    dispatch(appendQueryCountBy(field.path))
    submitSearch()
  }
)

export const filterEqualsValue = createHandler(
  "editor.filterEqualsValue",
  ({select, dispatch}) => {
    const field = select(Selection.getField)
    dispatch(appendQueryInclude(field))
    submitSearch()
  }
)

export const filterNotEqualsValue = createHandler(
  "editor.filterNotEqualsValue",
  ({select, dispatch}) => {
    const field = select(Selection.getField)
    dispatch(appendQueryExclude(field))
    submitSearch()
  }
)

export const filterInField = createHandler(
  "editor.filterInField",
  ({select, dispatch}) => {
    const value = select(Selection.getValue)
    const field = select(Selection.getField)
    if (value) {
      dispatch(appendQueryIn(field, value as zed.Value))
      submitSearch()
    }
  }
)

export const filterNotInField = createHandler(
  "editor.filterNotInField",
  ({select, dispatch}) => {
    const value = select(Selection.getValue)
    const field = select(Selection.getField)
    if (value) {
      dispatch(appendQueryNotIn(field, value))
      submitSearch()
    }
  }
)

export const newSearchWithValue = createHandler(
  "editor.newSearchWithValue",
  ({select, dispatch}) => {
    const field = select(Selection.getField)
    dispatch(Editor.setValue(toZedScript(field.data)))
    submitSearch()
  }
)

export const pivotToValues = createHandler(
  "editor.pivotToValues",
  ({select, dispatch}) => {
    const field = select(Selection.getField)
    const query = select(Editor.getValue)
    // So this only works if the count() by field is in the editor, not in a pin.
    const record = field.rootRecord
    const newProgram = program(query)
      .drillDown(record as zed.Record)
      .string()

    if (newProgram) {
      dispatch(Editor.setValue(newProgram))
      submitSearch()
    }
  }
)

export const sortAsc = createHandler(
  "editor.sortAsc",
  ({dispatch}, columnName: ColumnName) => {
    dispatch(appendQuerySortBy(columnName, "asc"))
    submitSearch()
  }
)

export const sortDesc = createHandler(
  "editor.sortDesc",
  ({dispatch}, columnName: ColumnName) => {
    dispatch(appendQuerySortBy(columnName, "desc"))
    submitSearch()
  }
)

export const fuse = createHandler("editor.fuse", ({oldApi}) => {
  oldApi.editor.append(
    oldApi.editor.value.trim().length === 0 ? "fuse" : " | fuse"
  )
  submitSearch()
})
