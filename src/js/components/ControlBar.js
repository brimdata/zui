/* @flow */

import React from "react"

import {XHistoryStepper} from "./HistoryStepper"
import {XSearchBar} from "./SearchBarComponent"
import Toolbar from "./Toolbar"

export default function ControlBar() {
  return (
    <div className="control-bar">
      <div className="row-1">
        <Toolbar />
      </div>
      <div className="row-2">
        <XHistoryStepper />
        <XSearchBar />
      </div>
    </div>
  )
}
