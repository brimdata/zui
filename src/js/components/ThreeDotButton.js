/* @flow */
import React from "react"
import classNames from "classnames"

import type {PassProps} from "./types"

//$FlowFixMe
const ThreeDotButton = React.forwardRef(function ThreeDotButton(
  {className, ...props}: PassProps,
  ref
) {
  return (
    <button
      ref={ref}
      className={classNames(className, "three-dot-button")}
      {...props}
    >
      <div className="dot dot-1" />
      <div className="dot dot-2" />
      <div className="dot dot-3" />
    </button>
  )
})

export default ThreeDotButton
