/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import {ThinButton} from "./Buttons"
import {XSpacesMenu} from "./SpacesMenu"
import {getCurrentSpaceName} from "../state/reducers/spaces"
import {initSpace} from "../space/thunks"
import {reactElementProps} from "../test/integration"
import DropMenu from "./DropMenu"

export default function SpacePicker() {
  let currentSpace = useSelector(getCurrentSpaceName)
  let [space, setSpace] = useState(currentSpace)
  let dispatch = useDispatch()

  useEffect(() => {
    setSpace(currentSpace)
  })

  function onSpaceChange(val) {
    setSpace(val)
    dispatch(initSpace(val))
  }

  if (!space) return <div style={{height: 14}} />

  return (
    <DropMenu
      position="left"
      menu={XSpacesMenu}
      onChange={onSpaceChange}
      className="button-group"
    >
      {<ThinButton {...reactElementProps("spaces_button")}>{space}</ThinButton>}
    </DropMenu>
  )
}
