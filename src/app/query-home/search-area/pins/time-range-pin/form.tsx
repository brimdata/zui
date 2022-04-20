import React from "react"
import {TimeRangeQueryPin} from "src/js/state/Editor/types"
import {useDialog} from "../dialog"
import {
  Actions,
  Button,
  Field,
  getFormData,
  Input,
  Label,
  PrimaryButton
} from "../form-helpers"

export default function Form(props: {
  pin: TimeRangeQueryPin
  onSubmit: (pin: TimeRangeQueryPin) => void
  onReset: () => void
}) {
  useDialog({onCancel: props.onReset})

  return (
    <form
      action="dialog"
      onSubmit={(e) => {
        props.onSubmit(decodeFormData(e))
      }}
    >
      <Field>
        <Label htmlFor="from">From</Label>
        <Input
          name="from"
          defaultValue={encodeDate(props.pin.from)}
          type="datetime-local"
          step="1"
        />
      </Field>
      <Field>
        <Label htmlFor="to">To</Label>
        <Input
          name="to"
          defaultValue={encodeDate(props.pin.to)}
          type="datetime-local"
          step="1"
        />
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
    from: decodeDate(raw.from),
    to: decodeDate(raw.to)
  } as TimeRangeQueryPin
}
