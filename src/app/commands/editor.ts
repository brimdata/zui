import {zed} from "packages/zealot/src"
import brim from "src/js/brim"
import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryIn,
  appendQueryInclude,
  appendQueryNotIn,
  appendQuerySortBy,
} from "src/js/flows/searchBar/actions"
import {copyToClipboard} from "src/js/lib/doc"
import {ColumnName} from "src/js/state/Columns/models/column"
import SearchBar from "src/js/state/SearchBar"
import {toZql} from "src/js/zql/toZql"
import submitSearch from "../query-home/flows/submit-search"
import {createCommand} from "./command"

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
    api.dispatch(SearchBar.clearSearchBar())
    api.dispatch(SearchBar.changeSearchBarInput(toZql(field.data)))
    api.dispatch(submitSearch())
  }
)

export const pivotToValues = createCommand(
  "pivotToValues",
  ({api}, field: zed.Field) => {
    // So this only works if the count() by field is in the editor, not in a pin.
    const record = field.rootRecord
    api.current.query.toZed()
    const newProgram = brim
      .program(api.editor.value)
      .drillDown(record as zed.Record)
      .string()

    if (newProgram) {
      api.dispatch(SearchBar.clearSearchBar())
      api.dispatch(SearchBar.changeSearchBarInput(newProgram))
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
