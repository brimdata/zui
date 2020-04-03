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
      <ToolbarButton name="Packets" icon={<Sharkfin />} disabled />
      <SpanControls />
    </div>
  )
}
