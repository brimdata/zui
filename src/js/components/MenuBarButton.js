/* @flow */
import React from "react"
import classNames from "classnames"

type Props = {
  children: *,
  className?: string
}

export default function MenuBarButton({className, children, ...props}: Props) {
  return (
    <button className={classNames(className, "menu-bar-button")} {...props}>
      {children}
    </button>
  )
}
