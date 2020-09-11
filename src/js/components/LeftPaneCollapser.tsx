import {connect, useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"
import classNames from "classnames"

import CircleChevron from "./CircleChevron"
import MouseoverWatch from "../lib/MouseoverWatch"
import dispatchToProps from "../lib/dispatchToProps"
import Layout from "../state/Layout"

export function LeftPaneCollapser() {
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const width = useSelector(Layout.getLeftSidebarWidth)

  useEffect(() => {
    const watcher = new MouseoverWatch()
      .addListener()
      .condition(([x]) => x < width)
      .onEnter(() => setShow(true))
      .onExit(() => setShow(false))

    return () => {
      watcher.removeListener()
    }
  })

  function onClick() {
    dispatch(Layout.hideLeftSidebar())
  }

  return (
    <div
      className={classNames("left-pane-collapser", {show})}
      onClick={onClick}
    >
      <CircleChevron collapse left dark />
    </div>
  )
}

export const XLeftPaneCollapser = connect(
  null,
  dispatchToProps
)(LeftPaneCollapser)
