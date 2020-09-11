import React from "react"
import classNames from "classnames"

export default function InputLabel({children, className, ...rest}: any) {
  return (
    <label {...rest} className={classNames(className, "input-label")}>
      {children}
    </label>
  )
}
