/* @flow */
import React from "react"
import classNames from "classnames"

export default function SelectInput({children, className, ...rest}: *) {
  return (
    <select {...rest} className={classNames(className, "select-input")}>
      {children}
    </select>
  )
}
