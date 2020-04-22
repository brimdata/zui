/* @flow */
import React from "react"

type Props = {
  children: *
}

export default function TimePiece({children, ...rest}: Props) {
  return (
    <div {...rest} className="time-piece">
      <div className="hover-zone" />
      {children}
    </div>
  )
}
