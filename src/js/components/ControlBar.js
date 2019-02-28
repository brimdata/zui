/* @flow */

import React from "react"
import {XSearchBar} from "./SearchBar"
import {XHistoryStepper} from "./HistoryStepper"
import {XSpanPickers} from "./SpanPickers"
import {ThinButton} from "./Buttons"
import DropMenu from "./DropMenu"
import {connect} from "react-redux"
import type {State} from "../reducers/types"
import * as spaces from "../reducers/spaces"
import {XSpacesMenu} from "./SpacesMenu"

type Props = {|
  currentSpace: string
|}

export default class ControlBar extends React.Component<Props> {
  render() {
    return (
      <div className="control-bar">
        <div className="row-1">
          <DropMenu position="left" menu={XSpacesMenu} className="button-group">
            {<ThinButton>{this.props.currentSpace}</ThinButton>}
          </DropMenu>
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

const stateToProps = (state: State) => ({
  currentSpace: spaces.getCurrentSpaceName(state)
})

export const XControlBar = connect<Props, {||}, _, _, _, _>(stateToProps)(
  ControlBar
)
