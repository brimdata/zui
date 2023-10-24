import {createHandler} from "src/core/handlers"
import Modal from "src/js/state/Modal"

export const newPool = createHandler("pools.new", ({dispatch}) => {
  dispatch(Modal.show("new-pool"))
})
