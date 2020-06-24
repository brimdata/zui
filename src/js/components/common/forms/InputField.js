/* @flow */
import React from "react"
import classNames from "classnames"

export default function InputField({children, className, ...rest}: *) {
  return (
    <div {...rest} className={classNames(className, "input-field")}>
      {children}
    </div>
  )
}
