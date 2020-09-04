

import produce from "immer";

import { ColumnsAction, ColumnsState } from "./types";

const init = {};

function forEachCol(draft, tableId, fn) {
  if (!draft[tableId]) return;
  for (const key in draft[tableId]) fn(draft[tableId][key]);
}

export default function (state: ColumnsState = init, action: ColumnsAction) {
  switch (action.type) {
    case "COLUMNS_SHOW_ALL":
      return produce(state, draft => {
        forEachCol(draft, action.tableId, c => {
          c.isVisible = true;
        });
      });
    case "COLUMNS_HIDE_ALL":
      return produce(state, draft => {
        forEachCol(draft, action.tableId, c => {
          c.isVisible = false;
        });
      });
    case "COLUMNS_UPDATE":
      return produce(state, draft => {
        const {
          tableId,
          updates
        } = action;
        if (!(tableId in draft)) draft[tableId] = {};
        for (const key in updates) {
          draft[tableId][key] = { ...draft[tableId][key], ...updates[key] };
        }
      });
    default:
      return state;

  }
}