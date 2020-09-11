import React from "react"
import classNames from "classnames"

export default function InputField({children, className, ...rest}: any) {
  return (
    <div {...rest} className={classNames(className, "input-field")}>
      {children}
    </div>
  )
}
