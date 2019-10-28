/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import {getAllSpaceNames, getCurrentSpaceName} from "../state/reducers/spaces"
import {initSpace, refreshSpaces} from "../space/thunks"
import {reactElementProps} from "../test/integration"
import MenuBarButton from "./MenuBarButton"
import PopMenuPointy from "./PopMenu/PopMenuPointy"

export default function SpacePicker() {
  let currentSpace = useSelector(getCurrentSpaceName)
  let [space, setSpace] = useState(currentSpace)
  let spaces = useSelector(getAllSpaceNames)
  let dispatch = useDispatch()

  useEffect(() => {
    setSpace(currentSpace)
  })

  function onSpaceChange(val) {
    setSpace(val)
    dispatch(initSpace(val))
  }

  if (!space) return <div style={{height: 14}} />

  let template = spaces.map((space) => ({
    label: space,
    click: () => onSpaceChange(space)
  }))

  return (
    <PopMenuPointy
      template={template}
      position="bottom center"
      {...reactElementProps("spacesMenu")}
    >
      <MenuBarButton
        {...reactElementProps("spaces_button")}
        dropdown
        onClick={() => dispatch(refreshSpaces())}
      >
        {space}
      </MenuBarButton>
    </PopMenuPointy>
  )
}
