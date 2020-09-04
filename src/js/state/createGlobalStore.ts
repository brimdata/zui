
import { createStore } from "redux";

import globalReducer, { GlobalState } from "./globalReducer";

export default function (initState: GlobalState | void) {
  // $FlowFixMe
  return createStore(globalReducer, initState);
}