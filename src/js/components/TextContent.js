/* @flow */
import React from "react"
import classNames from "classnames"

type Props = {
  children: *,
  className?: string
}

export default function TextContent({children, className, ...props}: Props) {
  return (
    <div {...props} className={classNames("text-content", className)}>
      {children}
    </div>
  )
}
