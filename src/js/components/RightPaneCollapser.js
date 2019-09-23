/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"
import classNames from "classnames"

import {getRightSidebarWidth} from "../state/reducers/view"
import {hideRightSidebar} from "../state/actions"
import CircleChevron from "./CircleChevron"
import MouseoverWatch from "../lib/MouseoverWatch"
import lib from "../lib"

export default function RightPaneCollapser() {
  let dispatch = useDispatch()
  let [show, setShow] = useState(false)
  let width = useSelector(getRightSidebarWidth)

  useEffect(() => {
    let watcher = new MouseoverWatch()
      .addListener()
      .condition(([x]) => lib.win.getWidth() - x < width)
      .onEnter(() => setShow(true))
      .onExit(() => setShow(false))
      .exitDelay(500)

    return () => {
      watcher.removeListener()
    }
  })

  function onClick() {
    dispatch(hideRightSidebar())
  }

  return (
    <div
      className={classNames("right-pane-collapser", {show})}
      onClick={onClick}
    >
      <CircleChevron collapse right light />
    </div>
  )
}
