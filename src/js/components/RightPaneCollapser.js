/* @flow */

import {useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"
import classNames from "classnames"

import CircleChevron from "./CircleChevron"
import MouseoverWatch from "../lib/MouseoverWatch"
import View from "../state/View"
import lib from "../lib"

export default function RightPaneCollapser() {
  let dispatch = useDispatch()
  let [show, setShow] = useState(false)
  let width = useSelector(View.getRightSidebarWidth)

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
    dispatch(View.hideRightSidebar())
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
