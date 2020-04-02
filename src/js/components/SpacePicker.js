/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import {initSpace} from "../flows/initSpace"
import Folder from "../icons/Folder"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import ToolBarButton from "./ToolBarButton"
import refreshSpaceNames from "../flows/refreshSpaceNames"

export default function SpacePicker() {
  let clusterId = useSelector(Tab.clusterId)
  let spaces = useSelector(Spaces.names(clusterId))
  let currentSpace = useSelector(Tab.spaceName) || "Choose a space"
  let [space, setSpace] = useState(currentSpace)
  let dispatch = useDispatch()

  useEffect(() => {
    setSpace(currentSpace)
  }, [currentSpace])

  function onSpaceChange(val) {
    setSpace(val)
    setTimeout(() => dispatch(initSpace(val)))
  }

  let template = spaces.map((space) => ({
    label: space,
    click: () => onSpaceChange(space)
  }))

  if (template.length === 0) {
    template = [{label: "No spaces in this cluster", disabled: true}]
  }

  return (
    <ToolBarButton
      icon={<Folder />}
      label={space}
      menu={template}
      onClick={() => dispatch(refreshSpaceNames())}
      name="Space"
    />
  )
}
