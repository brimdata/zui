/* @flow */
import React from "react"

import Sharkfin from "../icons/Sharkfin"
import SpacePicker from "./SpacePicker"
import SpanControls from "./Span/SpanControls"
import ToolBarButton from "./ToolBarButton"

export default function ToolBar() {
  return (
    <div className="tool-bar">
      <SpacePicker />
      <ToolBarButton name="Packets" icon={<Sharkfin />} disabled />
      <SpanControls />
    </div>
  )
}
