import {TableViewState} from "./types"

export function defaultTableViewState(): TableViewState {
  return {
    columnWidth: {},
    columnExpandedDefault: false,
    columnExpanded: {},
    columnResizeInfo: {
      startOffset: 0,
      startSize: 0,
      deltaOffset: 0,
      deltaPercentage: 0,
      columnSizingStart: [],
      isResizingColumn: false,
    },
    columnSorted: {},
    columnVisible: {},
    valueExpanded: {},
    valuePage: {},
  }
}
