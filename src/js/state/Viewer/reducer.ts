
import produce from "immer";

import { ViewerAction, ViewerState } from "./types";
import { concat, splice } from "../../lib/Array";
import { createSelection } from "./helpers/selection";

const init = (): ViewerState => ({
  records: [],
  endStatus: "INCOMPLETE",
  status: "INIT",
  columns: {},
  scrollPos: { x: 0, y: 0 },
  selection: {
    rows: {},
    currentRange: [0, 0]
  }
});

export default function (state: ViewerState = init(), action: ViewerAction): ViewerState {
  switch (action.type) {
    case "VIEWER_CLEAR":
      return { ...init() };
    case "VIEWER_RECORDS":
      return { ...state, records: concat(state.records, action.records) };
    case "VIEWER_SET_RECORDS":
      return { ...state, records: action.records };
    case "VIEWER_SPLICE":
      return { ...state, records: splice(state.records, action.index) };
    case "VIEWER_END_STATUS":
      return { ...state, endStatus: action.status };
    case "VIEWER_STATUS":
      return { ...state, status: action.status };
    case "VIEWER_COLUMNS":
      return { ...state, columns: { ...state.columns, ...action.columns } };
    case "VIEWER_SET_COLUMNS":
      return { ...state, columns: { ...action.columns } };
    case "VIEWER_SCROLL":
      return { ...state, scrollPos: action.scrollPos };
    case "VIEWER_SELECT":
      return produce(state, draft => {
        selectOne(action.index, draft);
      });
    case "VIEWER_SELECT_NEXT":
      return produce(state, draft => {
        selectOne(getNextIndex(state), draft);
      });
    case "VIEWER_SELECT_PREV":
      return produce(state, draft => {
        selectOne(getPrevIndex(state), draft);
      });
    case "VIEWER_SELECT_ALL":
      return produce(state, draft => {
        draft.selection.currentRange = [0, state.records.length - 1];
        writeRange(true, draft);
      });

    case "VIEWER_SELECT_MULTI":
      return produce(state, draft => {
        const s = createSelection(state.selection);
        const i = action.index;
        if (s.includes(i)) {
          const start = s.getIndices().find(index => index > i) || 0;
          const end = getEndOfRange(start, state);
          draft.selection.currentRange = [start, end];
          delete draft.selection.rows[i];
        } else {
          draft.selection.currentRange = getBoundedRange(i, state);
          writeRange(true, draft);
        }
      });
    case "VIEWER_SELECT_RANGE":
      return produce(state, draft => {
        updateRangeEnd(action.index, draft);
      });

    case "VIEWER_SELECT_RANGE_NEXT":
      return produce(state, draft => {
        let [start, end] = state.selection.currentRange;
        end = increment(end, state);
        if (start < end) end = getEndOfRange(end, state);

        updateRangeEnd(end, draft);
      });
    case "VIEWER_SELECT_RANGE_PREV":
      return produce(state, draft => {
        let [start, end] = state.selection.currentRange;
        end = decrement(end);
        if (end < start) end = getStartOfRange(end, state);

        updateRangeEnd(end, draft);
      });
    default:
      return state;

  }
}

function selectOne(index, draft) {
  draft.selection.rows = { [index]: true };
  draft.selection.currentRange = [index, index];
}

function updateRangeEnd(end, draft) {
  writeRange(false, draft);
  draft.selection.currentRange[1] = end;
  writeRange(true, draft);
}

function writeRange(value, draft) {
  const [start, end] = [...draft.selection.currentRange].sort((a, b) => a - b);
  for (let i = start; i <= end; ++i) {
    draft.selection.rows[i] = value;
  }
}

function getBoundedRange(index, state) {
  return [getStartOfRange(index, state), getEndOfRange(index, state)];
}

function getStartOfRange(index, state) {
  let s = createSelection(state.selection);
  while (index > 0) {
    if (s.includes(index - 1)) index--;else break;
  }
  return index;
}

function getEndOfRange(index, state) {
  let s = createSelection(state.selection);
  while (index < state.records.length - 1) {
    if (s.includes(index + 1)) index++;else break;
  }
  return index;
}

function increment(n, state) {
  return Math.min(state.records.length - 1, n + 1);
}

function decrement(n) {
  return Math.max(0, n - 1);
}

function getNextIndex(state) {
  const s = createSelection(state.selection);
  if (s.isEmpty()) return 0;
  return increment(s.currentRange[0], state);
}

function getPrevIndex(state) {
  const s = createSelection(state.selection);
  if (s.isEmpty()) return state.records.length - 1;
  return decrement(s.currentRange[0]);
}