import React, {useState} from "react"
import {useTimeZone} from "src/app/core/format"
import {TimeRangeQueryPin} from "src/js/state/Editor/types"
import {PinFormProps} from "./base-pin"
import {getFormData} from "./form-helpers"
import {getTimeString} from "./get-time-string"

export default function TimeRangePinForm(
  props: PinFormProps<TimeRangeQueryPin>
) {
  const zone = useTimeZone()
  const [fromValue, setFromValue] = useState(props.pin.from)
  const [toValue, setToValue] = useState(props.pin.to)
  return (
    <form
      method="dialog"
      onSubmit={(e) => {
        const raw = getFormData(e)
        props.onSubmit({
          ...raw,
          from: getTimeString(raw.from, zone),
          to: getTimeString(raw.to, zone),
        })
      }}
      onReset={props.onReset}
      className="flow"
    >
      <label htmlFor="field">Time Field</label>
      <input name="field" defaultValue={props.pin.field} type="string" />
      <label htmlFor="from">From</label>
      <input
        name="from"
        type="string"
        value={fromValue}
        onChange={(e) => setFromValue(e.target.value)}
      />
      <label htmlFor="to">To</label>
      <input
        name="to"
        type="string"
        value={toValue}
        onChange={(e) => setToValue(e.target.value)}
      />
      <label>Preview</label>
      <p className="font:mono">
        {getTimeString(fromValue, zone)} - <br />
        {getTimeString(toValue, zone)}
      </p>
      <footer className="repel flow-space-xl">
        <button
          className="button delete"
          type="button"
          onClick={props.onDelete}
        >
          Delete
        </button>
        <div className="repel">
          <button className="button" type="reset">
            Cancel
          </button>
          <button type="submit" className="button submit">
            OK
          </button>
        </div>
      </footer>
    </form>
  )
}
