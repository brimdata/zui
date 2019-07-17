/* @flow */

import {connect} from "react-redux"
import React, {useEffect} from "react"

import type {Dispatch, State} from "../state/types"
import {getAllSpaceNames} from "../state/reducers/spaces"
import {refreshSpaces} from "../space/thunks"
import MenuList from "./MenuList"
import dispatchToProps from "../lib/dispatchToProps"

type OwnProps = {|
  onChange?: Function
|}

type Props = {|
  spaces: string[],
  dispatch: Dispatch,
  ...OwnProps
|}

export const SpacesMenu = ({spaces, dispatch, onChange}: Props) => {
  useEffect(() => {
    dispatch(refreshSpaces())
  }, [])

  return (
    <MenuList>
      {spaces.map((name, i) => (
        <li key={i} onClick={() => onChange && onChange(name)}>
          {name}
        </li>
      ))}
    </MenuList>
  )
}

const stateToProps = (state: State) => ({
  spaces: getAllSpaceNames(state)
})

export const XSpacesMenu = connect<Props, OwnProps, _, _, _, _>(
  stateToProps,
  dispatchToProps
)(SpacesMenu)
