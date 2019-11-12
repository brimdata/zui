/* @flow */

import React from "react"

import {XHistoryStepper} from "./HistoryStepper"
import {XSearchBar} from "./SearchBar"
import ClusterPicker from "./ClusterPicker"
import SpacePicker from "./SpacePicker"
import TimeSpanPickers from "./TimeSpanPickers"

export default function ControlBar() {
  return (
    <div className="control-bar">
      <div className="row-1">
        <div className="group">
          <ClusterPicker />
          <SpacePicker />
        </div>
        <TimeSpanPickers />
      </div>
      <div className="row-2">
        <XHistoryStepper />
        <XSearchBar />
      </div>
    </div>
  )
}
