/* @flow */

import React from "react"

import {XHistoryStepper} from "./HistoryStepper"
import {XSearchBar} from "./SearchBar"
import {XSpanPickers} from "./SpanPickers"
import SpacePicker from "./SpacePicker"

export default function ControlBar() {
  return (
    <div className="control-bar">
      <div className="row-1">
        <SpacePicker />
        <XSpanPickers />
      </div>
      <div className="row-2">
        <XHistoryStepper />
        <XSearchBar />
      </div>
    </div>
  )
}
