/* @flow */

import React from "react"
import MenuList from "./MenuList"
import {switchSpace} from "../actions/searchPage"
import {connect} from "react-redux"
import dispatchToProps from "../lib/dispatchToProps"
import type {State, Dispatch} from "../reducers/types"
import {getAllSpaceNames} from "../reducers/spaces"

type Props = {|
  spaces: string[],
  dispatch: Dispatch
|}

export const SpacesMenu = ({spaces, dispatch}: Props) => {
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
  spaces: getAllSpaceNames(state)
})

export const XSpacesMenu = connect<Props, {||}, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SpacesMenu)
