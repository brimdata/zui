import React from "react"

import {DirectoryField} from "../../brim/form"
import FileInput from "../common/forms/FileInput"
import InputLabel from "../common/forms/InputLabel"

type Props = {
  config: DirectoryField
}

export default function DataDirInput({config}: Props) {
  const {name, label, defaultValue} = config
  return (
    <div className="setting-panel">
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <FileInput
        id={name}
        isDirInput
        {...{name, defaultValue, placeholder: "default"}}
      />
    </div>
  )
}
