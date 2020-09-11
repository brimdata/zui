import React, {useLayoutEffect, useRef, useState} from "react"

import lib from "../lib"

type AnimationOpts = Object | ((arg0: Function, arg1: HTMLElement) => Object)
type Props = {
  show: boolean
  enter?: AnimationOpts
  exit?: AnimationOpts | "reverse"
  children: any
}

export default function Animate({show, enter, exit, children}: Props) {
  let [state, setState] = useState(show ? "in" : "out")
  let el = useRef()
  let enterAni = useRef<any>()
  let exitAni = useRef<any>()

  useLayoutEffect(() => {
    switch (state) {
      case "out":
        if (show) setState("entering")
        else seekToEnd(exitAni.current)
        break
      case "entering":
        if (show) playEnter()
        else interuptEnter()
        break
      case "in":
        if (show) seekToEnd(enterAni.current)
        else setState("exiting")
        break
      case "exiting":
        if (show) interuptExit()
        else playExit()
        break
    }
  }, [state, show])

  useLayoutEffect(() => {
    return () => {
      cancel(enterAni.current)
      cancel(exitAni.current)
    }
  }, [])

  function playEnter() {
    if (el.current) {
      enterAni.current = lib.animation(el.current, enter)
      enterAni.current.play().then(() => setState("in"))
    }
  }

  function playExit() {
    if (el.current) {
      exitAni.current =
        exit === "reverse"
          ? lib.animation(el.current, enter).reverse()
          : lib.animation(el.current, exit)
      exitAni.current.play().then(() => setState("out"))
    }
  }

  function interuptEnter() {
    cancel(enterAni.current)
    setState("out")
  }

  function interuptExit() {
    cancel(exitAni.current)
    setState("in")
  }

  function cancel(ani) {
    if (ani) ani.cancel()
  }

  function seekToEnd(ani) {
    if (ani) ani.seekToEnd()
  }

  if (state === "out") return null
  else return React.cloneElement(React.Children.only(children), {ref: el})
}
