import React from "react"
import {GenericQueryPin} from "src/js/state/Editor/types"
import {PinFormProps} from "../base-pin"
import {
  Actions,
  Field,
  getFormData,
  Input,
  Label,
  TextArea,
  RedLink,
  ActionsGroup,
} from "../form-helpers"
import forms from "src/components/forms.module.css"

export function Form(props: PinFormProps<GenericQueryPin>) {
  return (
    <form
      className={forms.form}
      method="dialog"
      onSubmit={(e) => props.onSubmit(getFormData(e))}
      onReset={props.onReset}
    >
      <Field>
        <Label htmlFor="value">Zed Snippet</Label>
        <TextArea autoFocus name="value" defaultValue={props.pin.value} />
      </Field>
      <Field>
        <Label htmlFor="label">Label</Label>
        <Input
          name="label"
          placeholder="Same as Zed Snippet text"
          defaultValue={props.pin.label}
          style={{width: "66%"}}
        />
      </Field>
      <Actions>
        <ActionsGroup>
          <RedLink onClick={props.onDelete}>Delete</RedLink>
        </ActionsGroup>

        <ActionsGroup>
          <button className={forms.button} type="reset">
            Cancel
          </button>
          <button className={forms.submit} type="submit">
            OK
          </button>
        </ActionsGroup>
      </Actions>
    </form>
  )
}
