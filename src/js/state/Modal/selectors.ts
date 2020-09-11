import {State} from "../types"

export default {
  getName(state: State) {
    return state.modal.name
  },

  getArgs(state: State): any {
    return state.modal.args
  }
}
