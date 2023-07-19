import Modal from "src/js/state/Modal"
import {createCommand} from "./command"

export const connectToLake = createCommand(
  {id: "connectToLake"},
  ({dispatch}) => {
    dispatch(Modal.show("new-lake"))
  }
)
