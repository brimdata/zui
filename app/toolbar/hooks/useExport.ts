import {useDispatch} from "react-redux"
import Modal from "src/js/state/Modal"
import {toolbarExportButton} from "src/js/test/locators"
import {ToolbarActionProps} from "../action"

export default function useExport(): ToolbarActionProps {
  const dispatch = useDispatch()

  return {
    label: "Export",
    title: "Export search results to file",
    icon: "export",
    click: () => dispatch(Modal.show("export")),
    buttonProps: toolbarExportButton.props
  }
}
