import {ListViewState} from "./types"

export function defaultListViewState(): ListViewState {
  return {
    valueExpanded: {},
    valueExpandedDefault: false,
    valuePage: {},
  }
}
