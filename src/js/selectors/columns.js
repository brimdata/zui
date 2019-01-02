/* @flow */
import {createSelector} from "reselect"
import * as columnWidths from "../reducers/columnWidths"
import * as mainSearch from "../reducers/mainSearch"
import * as descriptors from "../reducers/descriptors"
import * as spaces from "../reducers/spaces"
import * as analysis from "../reducers/analysis"
import * as selectedColumns from "../reducers/selectedColumns"
import * as view from "../reducers/view"
import UniqArray from "../models/UniqArray"
import Columns from "../models/Columns"
import columnOrder from "../lib/columnOrder"
import type {ColumnWidths} from "../reducers/columnWidths"
import type {SelectedColumns} from "../reducers/selectedColumns"

type TdColumns = {name: string, type: string, td: string}[]

export const getColumnsFromTds = createSelector(
  mainSearch.getTds,
  descriptors.getDescriptors,
  spaces.getCurrentSpaceName,
  (tds, descriptors, space): TdColumns => {
    const uniq = new UniqArray(isSame)
    tds.forEach(td => {
      const desc = descriptors[space + "." + td]
      if (desc) {
        desc.forEach(field => uniq.push({td, ...field}))
      }
    })
    return uniq.toArray()
  }
)

export const getAnalysisColumns = createSelector(
  analysis.getAnalysis,
  ({descriptor}) => {
    if (descriptor) return descriptor.map(field => ({...field, td: null}))
    else return []
  }
)

export const getAllColumns = createSelector(
  view.getResultsTab,
  getColumnsFromTds,
  getAnalysisColumns,
  (tab, eventColumns, analysisColumns) => {
    switch (tab) {
      case "logs":
        return eventColumns
      case "analytics":
        return analysisColumns
      default:
        return []
    }
  }
)

export const getColumns = createSelector(
  getAllColumns,
  selectedColumns.getSelected,
  columnWidths.getAll,
  (all, selected, widths) => createColumns(all, selected, widths)
)

export const createColumns = (
  all: TdColumns,
  selected: SelectedColumns,
  widths: ColumnWidths
) => {
  const noSelection = selected.length === 0
  const ordered = columnOrder(all)
  const columns = ordered.map(col => ({
    name: col.name,
    type: col.type,
    td: col.td,
    isVisible: noSelection || !!selected.find(c => isSame(c, col)),
    width: col.name in widths ? widths[col.name] : widths.default
  }))

  return new Columns(columns)
}

const isSame = (a, b) => {
  return a.name === b.name && a.type === b.type
}
