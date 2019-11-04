/* @flow */
import React from "react"
import classNames from "classnames"

type Props = {children: *, className?: string}

export default function Notice({children, className, ...rest}: Props) {
  return (
    <p className={classNames("notice-banner", className)} {...rest}>
      {children}
    </p>
  )
}
