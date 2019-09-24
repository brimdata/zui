/* @flow */
import type {MODAL_HIDE, MODAL_SHOW, ModalName} from "./types"
import type {State} from "../state/types"
import reducer from "./reducer"

export default {
  reducer,

  show: (name: ModalName, args: Object): MODAL_SHOW => ({
    type: "MODAL_SHOW",
    name,
    args
  }),

  hide: (): MODAL_HIDE => ({
    type: "MODAL_HIDE"
  }),

  getName(state: State) {
    return state.modal.name
  },

  getArgs(state: State) {
    return state.modal.args
  }
}
