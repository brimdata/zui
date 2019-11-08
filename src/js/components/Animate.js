/* @flow */
import React, {useLayoutEffect, useRef, useState} from "react"
import anime from "animejs"

import {whatIs} from "../lib/is"

type AnimationState = "entering" | "in" | "exiting" | "out"
type AnimationOpts = Object | ((Function, HTMLElement) => Object)
type Props = {
  show: boolean,
  enter: AnimationOpts,
  exit: AnimationOpts | "reverse",
  children: *
}

export default function Animate({show, enter, exit, children}: Props) {
  let ref = useRef()
  let [state, setState] = useState<AnimationState>(show ? "in" : "out")

  function buildAnimation(opts) {
    switch (whatIs(opts)) {
      case "Object":
        return anime({
          targets: ref.current,
          ...opts
        })
      case "Function":
        // $FlowFixMe
        return opts(anime, ref.current)
      default:
        return anime({duration: 0})
    }
  }

  function buildExitAnimation() {
    if (exit === "reverse") {
      let ani = buildAnimation(enter)
      ani.reverse()
      ani.restart()
      return ani
    } else {
      return buildAnimation(exit)
    }
  }

  useLayoutEffect(() => {
    switch (state) {
      case "in":
      case "entering":
        if (!show) setState("exiting")
        break
      case "out":
      case "exiting":
        if (show) setState("entering")
        break
    }
  }, [show])

  useLayoutEffect(() => {
    switch (state) {
      case "entering":
        buildAnimation(enter).finished.then(() => setState("in"))
        break
      case "exiting":
        buildExitAnimation().finished.then(() => setState("out"))
        break
    }
  }, [state])

  if (state === "out") {
    return null
  } else {
    let child = React.Children.only(children)
    return React.cloneElement(child, {ref: ref})
  }
}
