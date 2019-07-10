/* @flow */
import * as React from "react"
import classNames from "classnames"

type Props = {
  children: React.Node,
  className?: string
}

export default function Form({children, className, ...props}: Props) {
  return (
    <form className={classNames("form ", className)} {...props}>
      {children}
    </form>
  )
}
