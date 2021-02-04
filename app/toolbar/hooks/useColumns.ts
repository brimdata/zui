import {useDispatch} from "react-redux"
import Modal from "src/js/state/Modal"
import {ToolbarActionProps} from "../action"

export default function useColumns(): ToolbarActionProps {
  const dispatch = useDispatch()

  return {
    label: "Columns",
    title: "Show or hide columns in the table",
    icon: "columns",
    click: () => dispatch(Modal.show("columns"))
  }
}
