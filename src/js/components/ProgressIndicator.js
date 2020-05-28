/* @flow */

import React from "react"

type Props = {
  percent: number
}

export default function ProgressIndicator({percent, ...rest}: Props) {
  let style = {
    width: Math.floor(percent * 100) + "%"
  }
  return (
    <div {...rest} className="progress-indicator">
      <div className="progress-track">
        <div className="progress-fill" style={style} />
      </div>
    </div>
  )
}
