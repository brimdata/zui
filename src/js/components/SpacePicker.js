/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import {getCurrentSpaceName} from "../state/reducers/spaces"
import {initSpace} from "../flows/initSpace"
import {reactElementProps} from "../test/integration"
import {refreshSpaces} from "../flows/space/thunks"
import MenuBarButton from "./MenuBarButton"
import PopMenuPointy from "./PopMenu/PopMenuPointy"
import Spaces from "../state/spaces"
import Tab from "../state/tab"

export default function SpacePicker() {
  let currentSpace = useSelector(getCurrentSpaceName) || "(No space)"
  let [space, setSpace] = useState(currentSpace)
  let clusterId = useSelector(Tab.clusterId)
  let spaces = useSelector(Spaces.names(clusterId))
  let dispatch = useDispatch()

  useEffect(() => {
    setSpace(currentSpace)
  }, [currentSpace])

  function onSpaceChange(val) {
    setSpace(val)
    dispatch(initSpace(val))
  }

  let template = spaces.map((space) => ({
    label: space,
    click: () => onSpaceChange(space)
  }))

  if (template.length === 0)
    template = [{label: "No spaces in this cluster", disabled: true}]

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
