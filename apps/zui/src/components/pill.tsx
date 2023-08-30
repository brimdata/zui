import classNames from "classnames"
import styles from "./pill.module.css"
import React from "react"

export function Pill({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={classNames(styles.pill, className)} {...rest}>
      {children}
    </label>
  )
}
