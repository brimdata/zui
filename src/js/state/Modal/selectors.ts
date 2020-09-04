
import { State } from "../types";

export default {
  getName(state: State) {
    return state.modal.name;
  },

  getArgs(state: State) {
    return state.modal.args;
  }
};