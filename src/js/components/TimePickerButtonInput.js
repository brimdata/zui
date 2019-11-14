/* @flow */
import {useSelector} from "react-redux"
import React, {useEffect, useRef, useState} from "react"
import moment from "moment"

import {format} from "../lib/Time"
import {getTimeZone} from "../state/reducers/view"
import {isDate} from "../lib/is"
import Form from "./form/Form"
import lib from "../lib"

type Props = {
  date: Date,
  onSubmit: Function
}

global.moment = moment

export default function TimePickerButtonInput({date, onSubmit}: Props) {
  let el = useRef()
  let zone = useSelector(getTimeZone)

  let [value, setValue] = useState(format(date, "MMM DD, YYYY HH:mm"))
  let [result, setResult] = useState(null)
  let [error, setError] = useState(null)

  useEffect(() => {
    if (el.current) el.current.focus()
  }, [el.current])

  function onChange(e) {
    setValue(e.target.value)
    let d = lib.date.parseInZone(e.target.value, zone)
    if (isDate(d)) {
      setError(null)
      setResult(format(d, "MMM DD, YYYY HH:mm"))
    } else {
      setError("Unknown date format")
      setResult(null)
    }
  }

  function submit() {
    let d = lib.date.parseInZone(value, zone)
    isDate(d) ? onSubmit(d) : onSubmit(date)
  }

  return (
    <Form onSubmit={submit} className="time-picker-button-input">
      <input ref={el} value={value} onChange={onChange} onBlur={submit} />
      <div className="input-suggestions">
        {value.length > 2 && error && (
          <p className="suggestion error">{error}</p>
        )}
        {result && <p className="suggestion active">{result}</p>}
      </div>
    </Form>
  )
}
