/* @flow */
import React from "react"

import useInputClassNames from "./useInputClassNames"

type Props = {
  label: string
}

export default function InputCheckbox({label, ...inputProps}: Props) {
  let {className, ref} = useInputClassNames("input-checkbox")

  return (
    <div className={className}>
      <label>
        <input type="checkbox" {...inputProps} ref={ref} />
        {label}
      </label>
    </div>
  )
}
