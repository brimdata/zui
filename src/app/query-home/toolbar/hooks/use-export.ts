import {useDispatch} from "react-redux"
import {MenuItem} from "src/core/menu"
import Modal from "src/js/state/Modal"

export default function useExport(): MenuItem {
  const dispatch = useDispatch()

  return {
    label: "Export",
    description: "Export search results to file",
    iconName: "export",
    click: () => dispatch(Modal.show("export")),
  }
}
