/* @flow */
import React from "react"
import classNames from "classnames"

type Props = {
  children: *,
  className?: string
}

export default function ButtonRow({children, className, ...props}: Props) {
  return (
    <div className={classNames("button-row", className)} {...props}>
      {children}
    </div>
  )
}
