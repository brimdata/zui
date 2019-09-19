/* @flow */
import React from "react"
import classNames from "classnames"

export default function ButtonRow({children, className, ...props}) {
  return (
    <div className={classNames("button-row", className)} {...props}>
      {children}
    </div>
  )
}
