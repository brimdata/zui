/* @flow */

import * as React from "react"
import Arrow from "../icons/caret-bottom-sm.svg"

type Children = {
  children: ?React.Node
}

export const ButtonGroup = ({children}: Children) => (
  <div className="button-group">{children}</div>
)

export const ThinButton = ({children}: Children) => (
  <button className="thin-button">{children}</button>
)

export const ThinPicker = () => (
  <button className="thin-button thin-picker">
    <Arrow />
  </button>
)
