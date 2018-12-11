/* @flow */

import React from "react"
import XSearchBar from "../connectors/XSearchBar"
import {XHistoryStepper} from "./HistoryStepper"
import {XSpanPickers} from "./SpanPickers"
import {ThinButton, ThinPicker, ButtonGroup} from "./Buttons"
import {switchSpace} from "../actions/searchPage"

type Props = {
  spaces: string[],
  currentSpace: string,
  dispatch: Function
}

export default class ControlBar extends React.Component<Props> {
  render() {
    return (
      <div className="control-bar">
        <div className="row-1">
          <ButtonGroup>
            <ThinButton>{this.props.currentSpace}</ThinButton>
            <ThinPicker align="left">
              {this.props.spaces.map((name, i) => (
                <li
                  key={i}
                  onClick={() => {
                    this.props.dispatch(switchSpace(name))
                  }}
                >
                  {name}
                </li>
              ))}
            </ThinPicker>
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

import {connect} from "react-redux"
import type {State} from "../reducers/types"
import * as spaces from "../reducers/spaces"

const stateToProps = (state: State) => ({
  spaces: spaces.getAllSpaceNames(state),
  currentSpace: spaces.getCurrentSpaceName(state)
})

export const XControlBar = connect(stateToProps)(ControlBar)
