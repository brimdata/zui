/* @flow */

import {connect} from "react-redux"
import React, {useEffect, useState} from "react"

import type {Dispatch, State} from "../state/types"
import {ThinButton} from "./Buttons"
import {XHistoryStepper} from "./HistoryStepper"
import {XSearchBar} from "./SearchBar"
import {XSpacesMenu} from "./SpacesMenu"
import {XSpanPickers} from "./SpanPickers"
import {switchSpace} from "../space/switch"
import DropMenu from "./DropMenu"
import dispatchToProps from "../lib/dispatchToProps"
import * as spaces from "../state/reducers/spaces"

type Props = {|
  currentSpace: string,
  dispatch: Dispatch
|}

export default function ControlBar({currentSpace, dispatch}: Props) {
  let [space, setSpace] = useState(currentSpace)

  useEffect(() => {
    setSpace(currentSpace)
  })

  function onSpaceChange(val) {
    setSpace(val)
    dispatch(switchSpace(val))
  }

  return (
    <div className="control-bar">
      <div className="row-1">
        <DropMenu
          position="left"
          menu={XSpacesMenu}
          onChange={onSpaceChange}
          className="button-group"
        >
          {<ThinButton>{space}</ThinButton>}
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

const stateToProps = (state: State) => ({
  currentSpace: spaces.getCurrentSpaceName(state)
})

export const XControlBar = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(ControlBar)
