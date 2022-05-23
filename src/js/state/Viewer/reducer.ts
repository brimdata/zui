import produce from "immer"
import {ViewerAction, ViewerState} from "./types"

const init = (): ViewerState => ({
  columns: {},
  scrollPos: {x: 0, y: 0},
  selection: {
    rows: {},
    currentRange: [0, 0],
  },
})

export default function (
  state: ViewerState = init(),
  action: ViewerAction
): ViewerState {
  switch (action.type) {
    case "VIEWER_CLEAR":
      return {...init()}
    case "VIEWER_COLUMNS":
      return {...state, columns: {...state.columns, ...action.columns}}
    case "VIEWER_SET_COLUMNS":
      return {...state, columns: action.columns}
    case "VIEWER_SCROLL":
      return {...state, scrollPos: action.scrollPos}
    case "VIEWER_SELECT":
      return produce(state, (draft) => {
        selectOne(action.index, draft)
      })
    default:
      return state
  }
}

function selectOne(index, draft) {
  draft.selection.rows = {[index]: true}
  draft.selection.currentRange = [index, index]
}
