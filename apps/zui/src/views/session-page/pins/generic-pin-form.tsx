import React from "react"
import {GenericQueryPin} from "src/js/state/Editor/types"
import {PinFormProps} from "./base-pin"
import {getFormData, TextArea, RedLink} from "./form-helpers"
import forms from "src/components/forms.module.css"

export function GenericPinForm(props: PinFormProps<GenericQueryPin>) {
  return (
    <form
      className={forms.form}
      method="dialog"
      onSubmit={(e) => props.onSubmit(getFormData(e))}
      onReset={props.onReset}
    >
      <div className="stack-1">
        <div className="field">
          <label htmlFor="value">Zed Snippet</label>
          <TextArea autoFocus name="value" defaultValue={props.pin.value} />
        </div>
        <div className="field">
          <label htmlFor="label">Label</label>
          <input
            type="text"
            name="label"
            placeholder="Same as Zed Snippet text"
            defaultValue={props.pin.label}
            style={{width: "66%"}}
          />
        </div>

        <div className="cluster-1 justify:between">
          <RedLink onClick={props.onDelete}>Delete</RedLink>

          <div className="cluster">
            <button className={forms.button} type="reset">
              Cancel
            </button>
            <button className={forms.submit} type="submit">
              OK
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
