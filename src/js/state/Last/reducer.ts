

import { LastAction, LastState } from "./types";

const init: LastState = {
  search: null
};

export default function reducer(state: LastState = init, action: LastAction): LastState {
  switch (action.type) {
    case "LAST_SEARCH_SET":
      return { ...state, search: action.search };
    default:
      return state;

  }
}