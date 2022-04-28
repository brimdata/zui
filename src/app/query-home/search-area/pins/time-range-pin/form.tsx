import {isDate} from "date-fns"
import React, {useState} from "react"
import {useTimeZone} from "src/app/core/format"
import time from "src/js/brim/time"
import date from "src/js/lib/date"
import {TimeRangeQueryPin} from "src/js/state/Editor/types"
import styled from "styled-components"
import {useDialog} from "../dialog"
import {
  Actions,
  Button,
  Field,
  getFormData,
  Input,
  Label,
  PrimaryButton,
} from "../form-helpers"

const Preview = styled.time`
  display: block;
  opacity: 0.6;
  line-height: 1.5;
  whitespace: nowrap;
`

function getDatePreview(value: string, zone: string) {
  const result = date.parseInZone(value, zone)
  if (result === null) return "Error parsing date"
  if (typeof result === "string") return result
  if (typeof result === "object") return time(result).toDate().toISOString()
}

export default function Form(props: {
  pin: TimeRangeQueryPin
  onSubmit: (pin: TimeRangeQueryPin) => void
  onReset: () => void
}) {
  useDialog({onCancel: props.onReset, onClose: props.onReset})
  const zone = useTimeZone()
  const [fromValue, setFromValue] = useState(props.pin.from)
  const [toValue, setToValue] = useState(props.pin.to)
  return (
    <form
      action="dialog"
      onSubmit={(e) => {
        props.onSubmit(decodeFormData(e))
      }}
    >
      <Field>
        <Label htmlFor="field">Time Field</Label>
        <Input
          style={{width: "66%"}}
          name="field"
          defaultValue={props.pin.field}
          type="string"
        />
      </Field>
      <Field>
        <Label htmlFor="from">From</Label>
        <Input
          name="from"
          type="string"
          value={fromValue}
          onChange={(e) => setFromValue(e.target.value)}
        />
      </Field>
      <Field>
        <Label htmlFor="to">To</Label>
        <Input
          name="to"
          type="string"
          value={toValue}
          onChange={(e) => setToValue(e.target.value)}
        />
      </Field>
      <Field>
        <Label>Preview</Label>
        <Preview>
          {getDatePreview(fromValue, zone)}
          {getDatePreview(toValue, zone)}
        </Preview>
      </Field>
      <Actions>
        <Button type="reset">Cancel</Button>
        <PrimaryButton type="submit">OK</PrimaryButton>
      </Actions>
    </form>
  )
}

export function encodeDate(date) {
  return date.toISOString().slice(0, 19)
}

function decodeDate(string) {
  return new Date(string)
}

function decodeFormData(e) {
  const raw = getFormData(e)
  return {
    field: raw.field,
    from: decodeDate(raw.from),
    to: decodeDate(raw.to),
  } as TimeRangeQueryPin
}
