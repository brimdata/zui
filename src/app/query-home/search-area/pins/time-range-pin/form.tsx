import React, {useState} from "react"
import {useTimeZone} from "src/app/core/format"
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
import {getTimeString} from "./get-time-preview"

const Preview = styled.time`
  display: block;
  opacity: 0.6;
  line-height: 1.5;
  whitespace: nowrap;
`

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
        const raw = getFormData(e)
        props.onSubmit({
          ...raw,
          from: getTimeString(raw.from, zone),
          to: getTimeString(raw.to, zone),
        })
      }}
      onReset={props.onReset}
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
        <Preview>{getTimeString(fromValue, zone)}</Preview>
        <Preview>{getTimeString(toValue, zone)}</Preview>
      </Field>
      <Actions>
        <Button type="reset">Cancel</Button>
        <PrimaryButton type="submit">OK</PrimaryButton>
      </Actions>
    </form>
  )
}
