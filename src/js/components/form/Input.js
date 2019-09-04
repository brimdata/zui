/* @flow */
import React from "react"

import useInputClassNames from "./useInputClassNames"

type Props = {
  label?: string,
  defaultValue?: string,
  type?: string,
  name?: string,
  options?: string[],
  onChange?: Function
}

export default function Input({label, ...inputProps}: Props) {
  let {className, ref} = useInputClassNames("input", inputProps.type)

  return (
    <div className={className}>
      <label htmlFor={inputProps.name}>{label}</label>
      <input ref={ref} {...inputProps} />
    </div>
  )
}
