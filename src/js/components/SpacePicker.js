/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"

import {initSpace} from "../flows/initSpace"
import Folder from "../icons/Folder"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import ToolbarButton from "./ToolbarButton"
import refreshSpaceNames from "../flows/refreshSpaceNames"
import usePopupMenu from "./hooks/usePopupMenu"

export default function SpacePicker() {
  let clusterId = useSelector(Tab.clusterId)
  let spaces = useSelector(Spaces.getSpaces(clusterId))
  let currentSpace = useSelector(Tab.getSpaceName) || "Choose a space"
  let [space, setSpace] = useState(currentSpace)
  let dispatch = useDispatch()
  let template = spaces.map(({id, name}) => ({
    label: name,
    click: () => onSpaceChange(id)
  }))
  if (template.length === 0) {
    template = [{label: "No spaces in this cluster", disabled: true}]
  }
  let openMenu = usePopupMenu(template)

  useEffect(() => {
    setSpace(currentSpace)
  }, [currentSpace])

  function onClick(e) {
    openMenu(e.currentTarget)
    dispatch(refreshSpaceNames())
  }

  function onSpaceChange(val) {
    setSpace(val)
    setTimeout(() => dispatch(initSpace(val)))
  }

  return (
    <div>
      <ToolbarButton
        icon={<Folder />}
        text={space}
        onClick={onClick}
        dropdown
      />
      <label>Space</label>
    </div>
  )
}
