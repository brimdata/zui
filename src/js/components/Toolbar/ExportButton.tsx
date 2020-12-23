import React from "react"

import {toolbarExportButton} from "../../test/locators"
import ExportIcon from "../../icons/ExportIcon"
import Label from "./Label"
import ToolbarButton from "./Button"
import Modal from "src/js/state/Modal"
import {useDispatch} from "react-redux"

export default function ExportButton() {
  const dispatch = useDispatch()

  const onClick = () => dispatch(Modal.show("export"))

  return (
    <div title="Export search results to file">
      <ToolbarButton
        {...toolbarExportButton.props}
        icon={<ExportIcon />}
        onClick={onClick}
      />
      <Label>Export</Label>
    </div>
  )
}
