/* @flow */
import React from "react"

import type {FormFieldConfig} from "../../brim/form"
import Link from "../common/Link"

type Props = {config: FormFieldConfig}

const DOCS = "https://momentjs.com/docs/#/displaying/format/"

export default function TimeFormat({config}: Props) {
  return (
    <div className="setting-panel">
      <div>
        <label>
          {config.label}: <Link href={DOCS}>(docs)</Link>
        </label>
      </div>
      <input
        name={config.name}
        type="text"
        placeholder="ISO-8601"
        defaultValue={config.defaultValue}
      />
    </div>
  )
}
