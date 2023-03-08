import {zed} from "packages/zealot/src"
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
import submitSearch from "../query-home/flows/submit-search"
import {createCommand} from "./command"

type ColumnName = string | string[]

export const copyValueToClipboard = createCommand(
  "copyValueToClipboard",
  (_, value: zed.Any) => {
    const selection = document.getSelection()
    copyToClipboard(
      selection.isCollapsed ? value.toString() : selection.toString()
    )
  }
)

export const countByField = createCommand(
  "countByField",
  ({api}, field: zed.Field) => {
    api.dispatch(appendQueryCountBy(field.path))
    api.dispatch(submitSearch())
  }
)

export const filterEqualsValue = createCommand(
  "filterEqualsValue",
  ({api}, field: zed.Field) => {
    api.dispatch(appendQueryInclude(field))
    api.dispatch(submitSearch())
  }
)

export const filterNotEqualsValue = createCommand(
  "filterNotEqualsValue",
  ({api}, field: zed.Field) => {
    api.dispatch(appendQueryExclude(field))
    api.dispatch(submitSearch())
  }
)

export const filterInField = createCommand(
  "filterInField",
  ({api}, field: zed.Field, value: zed.Any) => {
    if (value) {
      api.dispatch(appendQueryIn(field, value as zed.Value))
      api.dispatch(submitSearch())
    }
  }
)

export const filterNotInField = createCommand(
  "filterNotInField",
  ({api}, field: zed.Field, value: zed.Any) => {
    if (value) {
      api.dispatch(appendQueryNotIn(field, value))
      api.dispatch(submitSearch())
    }
  }
)

export const newSearchWithValue = createCommand(
  "newSearchWithValue",
  ({api}, field: zed.Field) => {
    api.dispatch(Editor.setValue(toZedScript(field.data)))
    api.dispatch(submitSearch())
  }
)

export const pivotToValues = createCommand(
  "pivotToValues",
  ({api}, field: zed.Field) => {
    // So this only works if the count() by field is in the editor, not in a pin.
    const record = field.rootRecord
    api.current.query.toZed()
    const newProgram = program(api.editor.value)
      .drillDown(record as zed.Record)
      .string()

    if (newProgram) {
      api.dispatch(Editor.setValue(newProgram))
      api.dispatch(submitSearch())
    }
  }
)

export const sortAsc = createCommand(
  "sortAsc",
  ({api}, columnName: ColumnName) => {
    api.dispatch(appendQuerySortBy(columnName, "asc"))
    api.dispatch(submitSearch())
  }
)

export const sortDesc = createCommand(
  "sortDesc",
  ({api}, columnName: ColumnName) => {
    api.dispatch(appendQuerySortBy(columnName, "desc"))
    api.dispatch(submitSearch())
  }
)

export const fuse = createCommand("fuse", ({api}) => {
  api.editor.append(api.editor.value.trim().length === 0 ? "fuse" : " | fuse")
  api.dispatch(submitSearch())
})
