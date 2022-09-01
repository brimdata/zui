import React, {useState} from "react"
import {useTimeZone} from "src/app/core/format"
import {TimeRangeQueryPin} from "src/js/state/Editor/types"
import styled from "styled-components"
import {PinFormProps} from "../base-pin"
import {
  Actions,
  ActionsGroup,
  Button,
  Field,
  getFormData,
  Input,
  Label,
  PrimaryButton,
  RedLink,
} from "../form-helpers"
import {getTimeString} from "./get-time-string"

const Preview = styled.time`
  display: block;
  opacity: 0.6;
  line-height: 1.5;
  whitespace: nowrap;
`

export default function Form(props: PinFormProps<TimeRangeQueryPin>) {
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
        <ActionsGroup>
          <RedLink onClick={props.onDelete}>Delete</RedLink>
        </ActionsGroup>
        <ActionsGroup>
          <Button type="reset">Cancel</Button>
          <PrimaryButton type="submit">OK</PrimaryButton>
        </ActionsGroup>
      </Actions>
    </form>
  )
}
