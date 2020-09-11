import {ModalAction, ModalState} from "./types"
import produce from "immer"

const init = (): ModalState => ({
  name: "",
  args: {}
})

export default produce((draft: ModalState, action: ModalAction) => {
  switch (action.type) {
    case "MODAL_SHOW":
      draft.name = action.name
      draft.args = action.args
      return
    case "MODAL_HIDE":
      return init()
  }
}, init())
