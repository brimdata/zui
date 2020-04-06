/* @flow */
import React from "react"

import ColumnChooser from "./ColumnChooser"
import PacketsButton from "./PacketsButton"
import SpacePicker from "./SpacePicker"
import SpanControls from "./Span/SpanControls"

export default function Toolbar() {
  return (
    <div className="toolbar">
      <SpacePicker />
      <div className="toolbar-group">
        <PacketsButton label />
        <ColumnChooser />
      </div>
      <SpanControls />
    </div>
  )
}
