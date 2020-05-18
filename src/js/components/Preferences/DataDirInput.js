/* @flow */
import React from "react"

import type {FormFieldConfig} from "../../brim/form"
import FileInput from "./FileInput"

type Props = {
  config: FormFieldConfig
}

export default function DataDirInput({config}: Props) {
  let {name, label, defaultValue} = config
  return (
    <div className="setting-panel">
      <label>{label}</label>
      <FileInput isDirInput {...{name, defaultValue, placeholder: "default"}} />
    </div>
  )
}
