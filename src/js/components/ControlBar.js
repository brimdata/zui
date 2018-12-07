/* @flow */

import React from "react"
import XSearchBar from "../connectors/XSearchBar"
import {XHistoryStepper} from "./HistoryStepper"
import {XSpanPickers} from "./SpanPickers"
import {ThinButton, ThinPicker, ButtonGroup} from "./Buttons"

type Props = {}

export default class ControlBar extends React.Component<Props> {
  render() {
    return (
      <div className="control-bar">
        <div className="row-1">
          <ButtonGroup>
            <ThinButton>default</ThinButton>
            <ThinPicker />
          </ButtonGroup>
          <XSpanPickers />
        </div>
        <div className="row-2">
          <XHistoryStepper />
          <XSearchBar />
        </div>
      </div>
    )
  }
}
