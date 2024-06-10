import activeTabSelect from "../Tab/activeTabSelect"
import {createSelector} from "@reduxjs/toolkit"
import {initialSettings} from "./reducer"
import * as zed from "@brimdata/zed-js"
import {TableSettingsState} from "./types"

export const getShape = activeTabSelect((tab) => tab.table.shape)
export const getSettings = activeTabSelect((tab) => tab.table.settings)

export const getShapeSettings = createSelector(
  getShape,
  getSettings,
  (shape, settings) => settings.get(shape) ?? initialSettings()
)

export const getScrollPosition = activeTabSelect(
  (tab) => tab.table.scrollPosition
)

export const getColumnExpandedDefault = activeTabSelect(
  (tab) => tab.table.columnExpandedDefault
)

export const getColumnVisible = createSelector(
  getShapeSettings,
  (settings) => settings.columnVisible
)

export const getColumnExpanded = createSelector(
  getShapeSettings,
  (settings) => settings.columnExpanded
)

export const getNestedColumns = createSelector(
  getShape,
  getShapeSettings,
  (shape, settings) => {
    return createColumns(shape as zed.TypeRecord, settings)
  }
)

export const getColumns = createSelector(getNestedColumns, (columns) => {
  return flatten(columns)
})

export const getVisibleColumns = createSelector(
  getShape,
  getShapeSettings,
  (shape, settings) => {
    return flatten(createColumns(shape as zed.TypeRecord, settings)).filter(
      (c) => c.isVisible
    )
  }
)

export const getColumnCount = createSelector(getColumns, (columns) => {
  return columns.length
})

export const getVisibleColumnCount = createSelector(
  getVisibleColumns,
  (columns) => {
    return columns.length
  }
)

export const getHiddenColumnCount = createSelector(
  getColumnCount,
  getVisibleColumnCount,
  (all, visible) => {
    return all - visible
  }
)

function flatten(columns: TableColumn[]) {
  let array = []
  for (let col of columns) {
    if (col.isExpanded) {
      array = array.concat(flatten(col.children))
    } else {
      array.push(col)
    }
  }
  return array
}

export type TableColumn = {
  id: string
  name: string
  namePath: string[]
  type: zed.Type
  index: number
  indexPath: number[]
  parent: TableColumn | null
  children: TableColumn[] | null
  isExpanded: boolean
  isVisible: boolean
  width: number
  sorted: "asc" | "desc" | null
}

function createColumns(
  typeRecord: zed.TypeRecord,
  settings: TableSettingsState,
  parent: TableColumn = null
) {
  const fields = typeRecord?.fields ?? []
  return fields.map((field, index) =>
    createColumn(parent, field, index, settings)
  )
}

function createColumn(
  parent: TableColumn,
  field: zed.TypeField,
  index: number,
  settings: TableSettingsState
) {
  const indexPath = parent ? [...parent.indexPath, index] : [index]
  const id = `col:${indexPath.join(",")}`
  const column: TableColumn = {
    id,
    parent,
    name: field.name,
    type: field.type,
    index: index,
    indexPath,
    namePath: parent ? [...parent.namePath, field.name] : [field.name],
    isExpanded: settings.columnExpanded[id],
    isVisible: settings.columnVisible[id] ?? true,
    width: settings.columnWidth[id],
    sorted: settings.columnSorted[id],
    children: null,
  }
  if (field.type instanceof zed.TypeRecord) {
    column.children = createColumns(field.type, settings, column)
  }
  return column
}
