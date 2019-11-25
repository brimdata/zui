/* @flow */
import React from "react"
import classNames from "classnames"

import Animate from "./Animate"

type Props = {show: boolean, children: *, className?: string}

export default function Notice({show, children, className, ...rest}: Props) {
  let enter = {
    translateY: ["-100%", 0],
    translateX: ["-50%", "-50%"],
    duration: 800
  }
  let exit = {
    opacity: [1, 0],
    easing: "easeOutSine",
    duration: 300
  }
  return (
    <Animate show={show} enter={enter} exit={exit}>
      <p className={classNames("notice-banner", className)} {...rest}>
        {children}
      </p>
    </Animate>
  )
}
