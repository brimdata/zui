/* @flow */
import React, {useEffect, useRef, useState} from "react"

import {format} from "../lib/Time"
import Form from "./form/Form"

type Props = {
  date: Date,
  onSubmit: Function
}

export default function TimePickerButtonInput({date, onSubmit}: Props) {
  let el = useRef()
  let [value, setValue] = useState(format(date, "MMM DD, YYYY HH:mm"))

  useEffect(() => {
    if (el.current) el.current.focus()
  }, [el.current])

  let [result, setResult] = useState(null)
  let [error, setError] = useState(null)

  function parseDate() {
    let d = new Date(Date.parse(value))
    return isNaN(d) ? date : d
  }

  function onChange(e) {
    let value = e.target.value
    setValue(value)
    let d = new Date(Date.parse(value))
    if (isNaN(d)) {
      setError("Unknown date format")
      setResult(null)
    } else {
      setError(null)
      setResult(format(d, "MMM DD, YYYY HH:mm"))
    }
  }

  return (
    <Form
      onSubmit={() => onSubmit(parseDate())}
      className="time-picker-button-input"
    >
      <input
        ref={el}
        value={value}
        onChange={onChange}
        onBlur={() => onSubmit(parseDate())}
      />
      <div className="input-suggestions">
        {error && <p className="suggestion error">{error}</p>}
        {result && <p className="suggestion active">{result}</p>}
      </div>
    </Form>
  )
}
