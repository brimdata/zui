/* @flow */
import React, {useState} from "react"
import classNames from "classnames"

import type {FormFieldConfig} from "../../brim/form"
import ToolbarButton from "../ToolbarButton"
import useCallbackRef from "../hooks/useCallbackRef"
import useDropzone from "../hooks/useDropzone"

type Props = {
  config: FormFieldConfig
}

export default function ZeekRunner({config}: Props) {
  let [picker, ref] = useCallbackRef()
  let [bindDropzone, dragging] = useDropzone(onDrop)
  let [value, setValue] = useState(config.defaultValue)

  function onChange(value) {
    setValue(value)
  }

  function onPick(e) {
    let path = Array.from(e.target.files).map((f) => f.path)[0]
    onChange(path)
  }

  function onDrop(e) {
    let path = Array.from(e.dataTransfer.files).map((f) => f.path)[0]
    onChange(path)
  }

  return (
    <div className="setting-panel">
      <label>{config.label}: </label>
      <div className="file-input-picker">
        <ToolbarButton
          className={classNames({dragging})}
          text="Choose..."
          onClick={() => picker && picker.click()}
          {...bindDropzone()}
        />
        <input
          name={config.name}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="default"
        />
        <input
          ref={ref}
          type="file"
          style={{display: "none"}}
          onChange={onPick}
        />
      </div>
    </div>
  )
}
