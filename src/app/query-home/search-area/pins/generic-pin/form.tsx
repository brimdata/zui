import React from "react"
import {GenericQueryPin} from "src/js/state/Editor/types"
import {PinFormProps} from "../base-pin"
import {
  Actions,
  Button,
  Field,
  getFormData,
  Input,
  Label,
  PrimaryButton,
  TextArea,
  RedLink,
  ActionsGroup,
} from "../form-helpers"

export function Form(props: PinFormProps<GenericQueryPin>) {
  return (
    <form
      method="dialog"
      onSubmit={(e) => props.onSubmit(getFormData(e))}
      onReset={props.onReset}
    >
      <Field>
        <Label htmlFor="value">Value</Label>
        <TextArea autoFocus name="value" defaultValue={props.pin.value} />
      </Field>
      <Field>
        <Label htmlFor="label">Label</Label>
        <Input
          name="label"
          placeholder="Same as value"
          defaultValue={props.pin.label}
          style={{width: "66%"}}
        />
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
