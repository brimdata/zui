/* @flow */
import {useSelector} from "react-redux"
import React, {useEffect, useRef, useState} from "react"

import type {TimeArg} from "../../state/search/types"
import {getTimeZone} from "../../state/reducers/view"
import {isString} from "../../lib/is"
import Form from "../form/Form"
import brim from "../../brim"
import lib from "../../lib"

type Props = {
  timeArg: TimeArg,
  onSubmit: Function
}

export default function TimeInput({timeArg, onSubmit}: Props) {
  let el = useRef()
  let zone = useSelector(getTimeZone)

  let [value, setValue] = useState(
    isString(timeArg)
      ? timeArg
      : brim.time(timeArg).format("MMM DD, YYYY HH:mm")
  )
  let [result, setResult] = useState(null)
  let [error, setError] = useState(null)

  useEffect(() => {
    if (el.current) el.current.focus()
  }, [el.current])

  function onChange(e) {
    setValue(e.target.value)
    let d = lib.date.parseInZone(e.target.value, zone)
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
    onSubmit(lib.date.parseInZone(value, zone) || timeArg)
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
