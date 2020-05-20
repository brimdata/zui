/* @flow */
import React from "react"

import ColumnChooser from "./ColumnChooser"
import ExportButton from "./ExportButton"
import PacketsButton from "./PacketsButton"
import SpacePicker from "./SpacePicker"
import SpanControls from "./Span/SpanControls"

export default function Toolbar() {
  return (
    <div className="toolbar">
      <SpacePicker />
      <div className="toolbar-group">
        <PacketsButton label id="toolbar-packets" />
        <ExportButton />
        <ColumnChooser />
      </div>
      <SpanControls />
    </div>
  )
}
