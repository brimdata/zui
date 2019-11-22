/* @flow */

import React from "react"

import {XHistoryStepper} from "./HistoryStepper"
import {XSearchBar} from "./SearchBar"
import ClusterPicker from "./ClusterPicker"
import SpacePicker from "./SpacePicker"
import SpanControls from "./Span/SpanControls"

export default function ControlBar() {
  return (
    <div className="control-bar">
      <div className="row-1">
        <div className="group">
          <ClusterPicker />
          <SpacePicker />
        </div>
        <SpanControls />
      </div>
      <div className="row-2">
        <XHistoryStepper />
        <XSearchBar />
      </div>
    </div>
  )
}
