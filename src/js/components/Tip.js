/* @flow */

import {animated, useSpring} from "react-spring"
import React, {useEffect, useState} from "react"
import ReactDOM from "react-dom"

import lib from "../lib"
import useCallbackRef from "./hooks/useCallbackRef"
import useEntrance from "./hooks/useEntrance"
import useTipPosition from "./hooks/useTipPosition"

type Props = {
  show: boolean,
  children: any,
  anchor: HTMLElement | null
}

export default function Tip({show: propShow, children, anchor}: Props) {
  let [show, setShow] = useState(propShow)
  let [popper, setRef] = useCallbackRef()
  let style = useTipPosition(anchor, popper)
  let [status, entered, exited] = useEntrance(show, 100, 300)
  let immediate = (name) => name === "transform"
  let configs = {
    in: {opacity: 1, immediate: false},
    entering: {opacity: 1, onRest: entered, immediate},
    exiting: {opacity: 0, onRest: exited, immediate: false},
    out: {opacity: 0, immediate: false}
  }
  let spring = useSpring({...configs[status], ...style})

  useEffect(() => setShow(propShow), [propShow])

  const onMouseEnter = () => setShow(true)
  const onMouseLeave = () => setShow(false)

  if (status === "out") return null
  else
    return ReactDOM.createPortal(
      <animated.div
        className="tip"
        ref={setRef}
        style={spring}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="tip-bg" />
        <div>{children}</div>
      </animated.div>,
      lib.doc.id("tooltip-root")
    )
}
