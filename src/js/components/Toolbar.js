/* @flow */
import React from "react"

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
      <SpanControls />
    </div>
  )
}
