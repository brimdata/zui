/* @flow */
import React from "react"
import ReactTooltip from "react-tooltip"
import classNames from "classnames"

type Props = {
  children?: *,
  className?: string
}

export default function BrimTooltip({className, children, ...rest}: Props) {
  return (
    <ReactTooltip
      insecure={false}
      className={classNames("brim-tooltip", className)}
      {...rest}
    >
      {children}
    </ReactTooltip>
  )
}
