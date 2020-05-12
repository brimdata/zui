/* @flow */
import React from "react"

import {shell} from "electron"

import type {FormFieldConfig} from "../../brim/form"

type Props = {config: FormFieldConfig}

export default function TimeFormat({config}: Props) {
  const openDocs = () =>
    shell.openExternal("https://momentjs.com/docs/#/displaying/format/")

  return (
    <div className="setting-panel">
      <div>
        <label>
          {config.label}: <a onClick={openDocs}>(docs)</a>
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
