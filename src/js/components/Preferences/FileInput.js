/* @flow */
import React, {useState} from "react"
import classNames from "classnames"

import ToolbarButton from "../ToolbarButton"
import useCallbackRef from "../hooks/useCallbackRef"
import useDropzone from "../hooks/useDropzone"

type Props = {|
  defaultValue: string,
  name: string,
  placeholder?: string,
  onChange?: Function
|}

export default function FileInput(props: Props) {
  let [picker, ref] = useCallbackRef()
  let [bindDropzone, dragging] = useDropzone(onDrop)
  let [value, setValue] = useState(props.defaultValue)

  function onChange(e) {
    setValue(e.target.value)
    props.onChange && props.onChange(e)
  }

  function onPick(e) {
    let path = Array.from(e.target.files).map((f) => f.path)[0]
    setValue(path)
  }

  function onDrop(e) {
    let path = Array.from(e.dataTransfer.files).map((f) => f.path)[0]
    setValue(path)
  }

  return (
    <div className="file-input-picker">
      <ToolbarButton
        className={classNames({dragging})}
        text="Choose..."
        onClick={() => picker && picker.click()}
        {...bindDropzone()}
      />
      <input
        name={props.name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={props.placeholder}
      />
      <input
        ref={ref}
        type="file"
        style={{display: "none"}}
        onChange={onPick}
      />
    </div>
  )
}
