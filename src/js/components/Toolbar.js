/* @flow */
import React from "react"

import ColumnChooser from "./ColumnChooser"
import Sharkfin from "../icons/Sharkfin"
import SpacePicker from "./SpacePicker"
import SpanControls from "./Span/SpanControls"
import ToolbarButton from "./ToolbarButton"

export default function Toolbar() {
  return (
    <div className="toolbar">
      <SpacePicker />
      <div className="toolbar-group">
        <div className="packets-button">
          <ToolbarButton icon={<Sharkfin />} disabled />
          <label>Packets</label>
        </div>
        <ColumnChooser />
      </div>
      <SpanControls />
    </div>
  )
}
