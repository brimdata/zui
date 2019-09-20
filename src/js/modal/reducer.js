/* @flow */
import type {ModalActions, ModalState} from "./types"

const init: ModalState = {
  name: "",
  args: {}
}

export default function(
  state: ModalState = init,
  action: ModalActions
): ModalState {
  switch (action.type) {
    case "MODAL_SHOW":
      return {
        name: action.name,
        args: action.args
      }
    case "MODAL_HIDE":
      return {
        ...init
      }
    default:
      return state
  }
}
