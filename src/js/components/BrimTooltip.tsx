import React from "react"
import ReactTooltip from "react-tooltip"
import classNames from "classnames"

type Props = {
  children?: any
  className?: string
}

export default function BrimTooltip({className, children, ...rest}: Props) {
  return (
    <ReactTooltip
      {...rest}
      insecure={false}
      className={classNames("brim-tooltip", className)}
    >
      {children}
    </ReactTooltip>
  )
}
