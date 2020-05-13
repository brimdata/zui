/* @flow */
import React, {useState} from "react"

import type {FormFieldConfig} from "../../brim/form"
import FileInput from "./FileInput"
import Link from "../common/Link"

type Props = {
  config: FormFieldConfig
}

const DOCS = "https://github.com/brimsec/brim/wiki"

export default function ZeekRunner({config}: Props) {
  let {name, label, defaultValue} = config
  let [showFeedback, setShowFeedback] = useState(false)

  function onChange(e) {
    setShowFeedback(e.target.value !== defaultValue)
  }

  return (
    <div className="setting-panel">
      <label>
        {config.label}: <Link href={DOCS}>(docs)</Link>
      </label>
      <FileInput
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder="default"
      />
      {showFeedback ? <p className="feedback">Restart required.</p> : null}
    </div>
  )
}
