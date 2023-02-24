import React from "react"
import time from "src/js/models/time"

import {FormFieldConfig} from "../../models/form"
import InputLabel from "../common/forms/InputLabel"
import SelectInput from "../common/forms/SelectInput"

type Props = {config: FormFieldConfig}

export default function Timezone({config}: Props) {
  const {label, name, defaultValue} = config
  return (
    <div className="setting-panel">
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <SelectInput name={name} id={name} defaultValue={defaultValue as string}>
        {time.getZoneNames().map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </SelectInput>
    </div>
  )
}
