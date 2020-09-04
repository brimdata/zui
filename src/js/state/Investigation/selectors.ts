

import { State } from "../types";
import { last } from "../../lib/Array";

export default {
  getInvestigation(state: State) {
    return state.investigation;
  },

  getCurrentFinding(state: State) {
    return last(state.investigation);
  }
};