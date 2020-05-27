/* @flow */
import React from "react"

import type {FormFieldConfig} from "../../brim/form"
import {jsonTypeConfigInput} from "../../test/locators"
import FileInput from "./FileInput"
import Link from "../common/Link"

type Props = {
  config: FormFieldConfig
}

export const JSON_TYPE_CONFIG_DOCS =
  "https://github.com/brimsec/brim/wiki/Zeek-JSON-Import"

export default function JSONTypeConfig({config}: Props) {
  let {name, label, defaultValue} = config
  return (
    <div className="setting-panel">
      <label>
        {label}: <Link href={JSON_TYPE_CONFIG_DOCS}>(docs)</Link>
      </label>
      <FileInput
        {...{name, defaultValue, placeholder: "default"}}
        textInputProps={jsonTypeConfigInput.props}
      />
    </div>
  )
}
