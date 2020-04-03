/* @flow */
import React from "react"

import ColumnChooser from "./ColumnChooser"
import ColumnsIcon from "../icons/ColumnsIcon"
import Sharkfin from "../icons/Sharkfin"
import SpacePicker from "./SpacePicker"
import SpanControls from "./Span/SpanControls"
import ToolbarButton from "./ToolbarButton"

export default function Toolbar() {
  return (
    <div className="toolbar">
      <SpacePicker />
      <div>
        <ToolbarButton icon={<Sharkfin />} disabled />
        <label>Packets</label>
      </div>
      <ColumnChooser />
      <SpanControls />
    </div>
  )
}
