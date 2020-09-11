import {isEmpty} from "lodash"
import React, {useState, HTMLProps} from "react"
import classNames from "classnames"

type Props = {
  label?: string
  defaultValue?: string
  type?: string
  name?: string
  onChange?: (ChangeEvent) => void
} & HTMLProps<HTMLInputElement>

export function Input({label, ...inputProps}: Props) {
  const [focus, setFocus] = useState(false)
  const [empty, setEmpty] = useState(isEmpty(inputProps.defaultValue))

  function onFocus() {
    setFocus(true)
  }

  function onBlur() {
    setFocus(false)
  }

  function onChange(e) {
    inputProps.onChange && inputProps.onChange(e)
    setEmpty(isEmpty(e.target.value))
  }

  const classes = classNames("input", inputProps.type, {focus, empty})

  return (
    <div className={classes}>
      <label htmlFor={inputProps.name}>{label}</label>
      <input
        {...inputProps}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
      />
    </div>
  )
}

export function InputCheckbox({label, ...inputProps}: Props) {
  const [focus, setFocus] = useState(false)

  function onFocus() {
    setFocus(true)
  }

  function onBlur() {
    setFocus(false)
  }

  const classes = classNames("input-checkbox", {focus})

  return (
    <div className={classes}>
      <label>
        <input
          type="checkbox"
          {...inputProps}
          onFocus={onFocus}
          onBlur={onBlur}
        />{" "}
        {label}
      </label>
    </div>
  )
}

export function InputSubmit({...inputProps}: Props) {
  return (
    <div className="input-submit">
      <input type="submit" {...inputProps} />
    </div>
  )
}
