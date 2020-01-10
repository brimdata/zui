/* @flow */
import React from "react"

type Props = {
  onClick: Function,
  left: number
}

export default function AddTab({onClick, left}: Props) {
  return (
    <a
      className="add-tab"
      onClick={onClick}
      style={{transform: `translateX(${left}px)`}}
    >
      +
    </a>
  )
}
