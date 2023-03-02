import React from "react"
import ReactTooltip from "react-tooltip"
import classNames from "classnames"

type Props = {
  children?: any
  className?: string
  id?: string
}

export default function Tooltip({className, children, id, ...rest}: Props) {
  return (
    <ReactTooltip
      {...rest}
      id={id}
      insecure={false}
      className={classNames("tooltip", className)}
    >
      {children}
    </ReactTooltip>
  )
}
