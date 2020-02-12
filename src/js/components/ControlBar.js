/* @flow */

import React from "react"

import {XHistoryStepper} from "./HistoryStepper"
import {XSearchBar} from "./SearchBarComponent"
import SpanControls from "./Span/SpanControls"

export default function ControlBar() {
  return (
    <div className="control-bar">
      <div className="row-1">
        <div />
        <SpanControls />
      </div>
      <div className="row-2">
        <XHistoryStepper />
        <XSearchBar />
      </div>
    </div>
  )
}
