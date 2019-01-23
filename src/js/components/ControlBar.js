/* @flow */

import React from "react"
import XSearchBar from "../connectors/XSearchBar"
import {XHistoryStepper} from "./HistoryStepper"
import {XSpanPickers} from "./SpanPickers"
import {ThinButton} from "./Buttons"
import {switchSpace} from "../actions/searchPage"
import DropMenu from "./DropMenu"
import MenuList from "./MenuList"

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
          <DropMenu
            position="left"
            menu={
              <SpacesMenu
                spaces={this.props.spaces}
                dispatch={this.props.dispatch}
              />
            }
          >
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

export const SpacesMenu = ({
  spaces,
  dispatch
}: {
  spaces: string[],
  dispatch: Function
}) => {
  return (
    <MenuList>
      {spaces.map((name, i) => (
        <li key={i} onClick={() => dispatch(switchSpace(name))}>
          {name}
        </li>
      ))}
    </MenuList>
  )
}

import {connect} from "react-redux"
import type {State} from "../reducers/types"
import * as spaces from "../reducers/spaces"

const stateToProps = (state: State) => ({
  spaces: spaces.getAllSpaceNames(state),
  currentSpace: spaces.getCurrentSpaceName(state)
})

export const XControlBar = connect(stateToProps)(ControlBar)
