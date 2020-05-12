/* @flow */
import React from "react"

import type {FormFieldConfig} from "../../brim/form"
import brim from "../../brim"

type Props = {config: FormFieldConfig}

export default function Timezone({config}: Props) {
  let {label, name, defaultValue} = config
  return (
    <div className="setting-panel">
      <label>{label}:</label>
      <select name={name} defaultValue={defaultValue}>
        {brim.time.getZoneNames().map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}
