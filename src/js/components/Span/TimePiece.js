/* @flow */
import React from "react"

type Props = {
  children: *
}

export default function TimePiece({children, ...rest}: Props) {
  return (
    <div className="time-piece" {...rest}>
      <div className="hover-zone" />
      {children}
    </div>
  )
}
