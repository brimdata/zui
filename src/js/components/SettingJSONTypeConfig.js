/* @flow */
import {useSelector} from "react-redux"
import React, {useState} from "react"
import classNames from "classnames"

import {globalDispatch} from "../state/GlobalContext"
import Prefs from "../state/Prefs"
import ToolbarButton from "./ToolbarButton"
import lib from "../lib"
import useCallbackRef from "./hooks/useCallbackRef"
import useDropzone from "./hooks/useDropzone"

export default function SettingJSONTypeConfig() {
  let dispatch = globalDispatch
  let jsonTypeConfig = useSelector(Prefs.getJSONTypeConfig)
  let [picker, ref] = useCallbackRef()
  let [error, setError] = useState(null)
  let [bindDropzone, dragging] = useDropzone(onDrop)

  function onChange(value) {
    dispatch(Prefs.setJSONTypeConfig(value || ""))
  }

  function onPick(e) {
    let path = Array.from(e.target.files).map((f) => f.path)[0]
    onChange(path)
    validate(path)
  }

  function onDrop(e) {
    let path = Array.from(e.dataTransfer.files).map((f) => f.path)[0]
    onChange(path)
    validate(path)
  }

  function validate(path) {
    setError(null)
    if (path === "") return
    lib
      .file(path)
      .read()
      .then((text) => JSON.parse(text))
      .catch((e) => {
        let msg = e.name + ": " + e.message
        if (/SyntaxError/.test(msg)) {
          setError("File does not contain valid JSON.")
        } else if (/ENOENT/.test(msg)) {
          setError("File does not exist.")
        } else {
          setError(msg)
        }
      })
  }

  return (
    <div className="setting-panel">
      <label>JSON Type Config:</label>
      <div className="file-input-picker">
        <ToolbarButton
          className={classNames({dragging})}
          text="Choose..."
          onClick={() => picker && picker.click()}
          {...bindDropzone()}
        />
        <input
          type="text"
          value={jsonTypeConfig}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => validate(jsonTypeConfig)}
          placeholder="default"
        />
        <input
          ref={ref}
          type="file"
          style={{display: "none"}}
          onChange={onPick}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}
