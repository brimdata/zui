/* @flow */
import React from "react"

import SpacePicker from "./SpacePicker"
import SpanControls from "./Span/SpanControls"

export default function ToolBar() {
  return (
    <div className="tool-bar">
      <SpacePicker />
      <SpanControls />
    </div>
  )
}
