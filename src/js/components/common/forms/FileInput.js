/* @flow */
import {isEmpty} from "lodash"
import React, {useState} from "react"
import classNames from "classnames"

import TextInput from "./TextInput"
import invoke from "../../../electron/ipc/invoke"
import ipc from "../../../electron/ipc"
import useCallbackRef from "../../hooks/useCallbackRef"
import useDropzone from "../../hooks/useDropzone"

type Props = {|
  defaultValue: string,
  name: string,
  placeholder?: string,
  onChange?: Function,
  isDirInput?: boolean,
  textInputProps?: Object
|}

export default function FileInput(props: Props) {
  let [picker, ref] = useCallbackRef()
  let [bindDropzone, dragging] = useDropzone(onDrop)
  let [value, setValue] = useState(props.defaultValue)

  function onClick(e) {
    e && e.preventDefault()
    const {isDirInput} = props
    isDirInput
      ? invoke(ipc.windows.openDirectorySelect()).then(
          ({canceled, filePaths}) => {
            const path = canceled || isEmpty(filePaths) ? "" : filePaths[0]
            setValue((currentVal) => {
              return canceled ? currentVal : path
            })
          }
        )
      : picker && picker.click()
  }

  function onChange(e) {
    setValue(e.target.value)
    props.onChange && props.onChange(e.target.value)
  }

  function onPick(e) {
    let path = Array.from(e.target.files).map((f) => f.path)[0]
    setValue(path)
    props.onChange && props.onChange(path)
  }

  function onDrop(e) {
    let path = Array.from(e.dataTransfer.files).map((f) => f.path)[0]
    setValue(path)
    props.onChange && props.onChange(path)
  }

  return (
    <div className="file-input">
      <button
        className={classNames({dragging})}
        onClick={onClick}
        {...bindDropzone()}
      >
        Choose...
      </button>
      <TextInput
        name={props.name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={props.placeholder}
        {...props.textInputProps}
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
