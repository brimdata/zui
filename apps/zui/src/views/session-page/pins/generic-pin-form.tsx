import React from "react"
import {GenericQueryPin} from "src/js/state/Editor/types"
import {PinFormProps} from "./base-pin"
import {getFormData, RedLink} from "./form-helpers"

export function GenericPinForm(props: PinFormProps<GenericQueryPin>) {
  return (
    <form
      method="dialog"
      onSubmit={(e) => props.onSubmit(getFormData(e))}
      onReset={props.onReset}
      className="flow"
    >
      <label htmlFor="value">Zed Snippet</label>
      <textarea autoFocus name="value" defaultValue={props.pin.value} />

      <label htmlFor="label">Label</label>
      <input
        type="text"
        name="label"
        placeholder="Same as Zed Snippet text"
        defaultValue={props.pin.label}
      />

      <div className="repel flow-space-xl">
        <RedLink onClick={props.onDelete}>Delete</RedLink>

        <div className="repel">
          <button className="button" type="reset">
            Cancel
          </button>
          <button className="button submit" type="submit">
            OK
          </button>
        </div>
      </div>
    </form>
  )
}
