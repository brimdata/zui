/* @flow */

import React from "react"
import {XSearchBar} from "./SearchBar"
import {XHistoryStepper} from "./HistoryStepper"
import {XSpanPickers} from "./SpanPickers"
import {ThinButton} from "./Buttons"
import {switchSpace} from "../actions/searchPage"
import DropMenu from "./DropMenu"
import MenuList from "./MenuList"
import {connect} from "react-redux"
import type {State} from "../reducers/types"
import * as spaces from "../reducers/spaces"
import {type DispatchProps} from "../reducers/types"
import dispatchToProps from "../lib/dispatchToProps"

type StateProps = {|
  spaces: string[],
  currentSpace: string
|}

type Props = {|...StateProps, ...DispatchProps|}

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

const stateToProps = (state: State) => ({
  spaces: spaces.getAllSpaceNames(state),
  currentSpace: spaces.getCurrentSpaceName(state)
})

export const XControlBar = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(ControlBar)
