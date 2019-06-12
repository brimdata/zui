/* @flow */

import {connect, useDispatch, useSelector} from "react-redux"
import React, {useEffect, useState} from "react"
import classNames from "classnames"

import type {Dispatch} from "../state/types"
import {getLeftSidebarWidth} from "../state/reducers/view"
import {hideLeftSidebar} from "../state/actions"
import CircleChevron from "./CircleChevron"
import MouseoverWatch from "../lib/MouseoverWatch"
import dispatchToProps from "../lib/dispatchToProps"

type Props = {
  show: boolean,
  dispatch: Dispatch
}

type OwnProps = {
  show: boolean
}

export function LeftPaneCollapser() {
  let dispatch = useDispatch()
  let [show, setShow] = useState(false)
  let width = useSelector(getLeftSidebarWidth)

  useEffect(() => {
    let watcher = new MouseoverWatch()
      .addListener()
      .condition(([x]) => x < width)
      .onEnter(() => setShow(true))
      .onExit(() => setShow(false))

    return () => {
      watcher.removeListener()
    }
  })

  function onClick() {
    dispatch(hideLeftSidebar())
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

export const XLeftPaneCollapser = connect<Props, OwnProps, _, _, _, _>(
  null,
  dispatchToProps
)(LeftPaneCollapser)
