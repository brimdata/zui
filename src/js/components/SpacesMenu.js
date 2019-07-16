/* @flow */

import {connect} from "react-redux"
import React, {useEffect} from "react"

import type {Dispatch, State} from "../state/types"
import {getAllSpaceNames} from "../state/reducers/spaces"
import {refreshSpaces} from "../space/refresh"
import {setCurrentSpaceName} from "../state/actions"
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

  if (spaces.length === 0) {
    return (
      <MenuList>
        <li onClick={() => dispatch(setCurrentSpaceName(null))}>
          Create space
        </li>
      </MenuList>
    )
  }

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
