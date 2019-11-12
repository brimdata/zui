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

  function parseDate() {
    let d = new Date(Date.parse(value))
    return isNaN(d) ? date : d
  }

  return (
    <Form
      onSubmit={() => onSubmit(parseDate())}
      className="time-picker-button-input"
    >
      <input
        ref={el}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => onSubmit(parseDate())}
      />
    </Form>
  )
}
