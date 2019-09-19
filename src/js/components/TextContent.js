/* @flow */
import React from "react"
import classNames from "classnames"

export default function TextContent({children, className, ...props}) {
  return (
    <div className={classNames("text-content", className)} {...props}>
      {children}
    </div>
  )
}
