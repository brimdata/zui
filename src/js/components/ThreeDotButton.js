/* @flow */
import React from "react"
import classNames from "classnames"

import type {PassProps} from "./types"

export default function ThreeDotButton({className, ...props}: PassProps) {
  return (
    <button className={classNames(className, "three-dot-button")} {...props}>
      <div className="dot dot-1" />
      <div className="dot dot-2" />
      <div className="dot dot-3" />
    </button>
  )
}
