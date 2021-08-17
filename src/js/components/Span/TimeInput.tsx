import {useTimeZone} from "app/core/format"
import React, {useEffect, useRef, useState} from "react"
import brim from "../../brim"
import lib from "../../lib"
import {isString} from "../../lib/is"
import {TimeArg} from "../../state/Search/types"
import Form from "../form/Form"
import {SPAN_TIME_FMT} from "./SpanControls"

type Props = {
  timeArg: TimeArg
  onSubmit: Function
}

export default function TimeInput({timeArg, onSubmit}: Props) {
  const el = useRef<HTMLInputElement>()
  const zone = useTimeZone()
  const initValue = isString(timeArg)
    ? timeArg
    : brim.time(timeArg).format(SPAN_TIME_FMT)

  const [value, setValue] = useState(initValue)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (el.current) el.current.focus()
  }, [el.current])

  function onChange(e) {
    setValue(e.target.value)

    const d = lib.date.parseInZone(e.target.value, zone)
    if (d === null) {
      setError("Unknown date format")
      setResult(null)
    } else if (isString(d)) {
      setError(null)
      setResult(d)
    } else {
      setError(null)
      setResult(brim.time(d).format("MMM DD, YYYY HH:mm"))
    }
  }

  function submit() {
    if (value !== initValue) {
      onSubmit(lib.date.parseInZone(value, zone) || timeArg)
    } else {
      onSubmit(timeArg)
    }
  }

  return (
    <Form onSubmit={submit} className="time-picker-button-input">
      <input
        type="text"
        ref={el}
        value={value}
        onChange={onChange}
        onBlur={submit}
      />
      <div className="input-suggestions">
        {value.length > 2 && error && (
          <p className="suggestion error">{error}</p>
        )}
        {result && <p className="suggestion active">{result}</p>}
      </div>
    </Form>
  )
}
