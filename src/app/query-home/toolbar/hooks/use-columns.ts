import {useDispatch} from "react-redux"
import {MenuItem} from "src/core/menu"
import Modal from "src/js/state/Modal"

export default function useColumns(): MenuItem {
  const dispatch = useDispatch()

  return {
    label: "Columns",
    description: "Show or hide columns in the table",
    iconName: "columns",
    click: () => dispatch(Modal.show("columns")),
  }
}
